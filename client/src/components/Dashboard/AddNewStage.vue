<template>
  <div
    class="modal fade"
    id="addStageModal"
    tabindex="-1"
    aria-labelledby="addStageModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addStageModalLabel">Add New Stage</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form
            @submit.prevent="onSubmit"
            class="needs-validation was-validated"
            novalidate
          >
            <div class="mb-3">
              <label for="title" class="form-label">Title</label>
              <input
                v-model="stage.title"
                type="text"
                class="form-control"
                id="title"
                required
              />
              <div class="invalid-feedback">Title is required.</div>
            </div>
            <div class="mb-3">
              <label class="form-label">Type</label>
              <div>
                <label class="form-check-inline me-3">
                  <input
                    name="hasProjectOrExam"
                    @click="stage.hasProject = false"
                    type="radio"
                    id="hasExam"
                    value="true"
                    checked
                    class="form-check-input"
                  />
                  <span class="form-check-label">Has Exam</span>
                </label>
                <label class="form-check-inline">
                  <input
                    name="hasProjectOrExam"
                    @click="stage.hasProject = true"
                    type="radio"
                    id="hasProject"
                    value="false"
                    class="form-check-input"
                  />
                  <span class="form-check-label">Has Project</span>
                </label>
              </div>
            </div>
            <div class="mb-3" v-if="searchedCourse">
              <label for="selectedCourse" class="form-label"
                >Selected Course</label
              >
              <input
                v-model="searchedCourse.name"
                type="text"
                class="form-control"
                id="selectedCourse"
                readonly
              />
            </div>
            <div class="mb-3">
              <label for="parentCourseSearchTerm" class="form-label"
                >Search for Course</label
              >
              <input
                v-model="parentCourseSearchTerm"
                type="text"
                class="form-control"
                id="parentCourseSearchTerm"
                placeholder="Enter course name..."
                required
              />
              <div class="invalid-feedback">Please select a course.</div>
            </div>
            <div class="modal-footer">
                <button id="cancelButton" type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    Close
                </button>
                <button :disabled="isSubmitting" type="submit" class="btn btn-primary">
                    {{ isSubmitting ? 'Adding ....' : 'Add Stage' }}
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { MY_YOUTUBE_DEV_API_KEY } from '@/youtube'
import axios from "axios";
import Swal from "sweetalert2";

@Options({
  created() {
    this.loadCourses();
  },
  data() {
    return {
      isSubmitting: false,
      stage: {
        title: "",
        hasProject: false,
        course: null,
      },
      parentCourseSearchTerm: "",
      courses: [],
    };
  },
  computed: {
    searchedCourse() {
      if (this.parentCourseSearchTerm !== "") {
        const searchTermLC = this.parentCourseSearchTerm.toLowerCase();
        this.stage.course = this.courses.find((course: { name: string }) => {
          return course.name.toLowerCase().includes(searchTermLC);
        });
        return this.stage.course;
      } else {
        return null;
      }
    },
  },
  methods: {
    async loadCourses() {
      try {
        const user = await this.$store.state.user;
        let response = { data: []};
        if (user.userType == 'supervisor') {
          response = await axios.get(`http://localhost:3000/courses/by-course-admin-id/${user.id}`);
          if (response.data.length >= 1) {
            this.stage.course = response.data[0];
            this.parentCourseSearchTerm = this.stage.course.name;
          }
        } else {
          response = await axios.get('http://localhost:3000/courses');
        }
        this.courses = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async loadLessonsDataFromYoutube(stageId: number) {
      const description = `using ${this.stage.course.name} to explain ${this.stage.title} how to do ${this.stage.title} on ${this.stage.course.name}`;
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=100&q=${encodeURIComponent(description)}&key=${MY_YOUTUBE_DEV_API_KEY}&type=video`;
      try {
        const response = await axios.get(url);
        return response.data.items.filter((item: any) => item.id.kind === 'youtube#video')
              .slice(0, 10).map((item: any) => ({
                url: item.id.videoId,
                stage: {id: stageId}
              }));
      } catch (error) {
        console.log(error);
      }
    },
    async createStagesLessons(lessonsData: []) {
      try {
        const respons = await axios.post('http://localhost:3000/lessons',lessonsData);
      } catch (error) {
        console.log(error);
      }
    },
    async onSubmit() {
        const form = document.querySelector('.needs-validation') as HTMLFormElement;
        if (form.checkValidity() === true) {
            if (!this.stage.course){
              Swal.fire({
                icon: "error",
                title: "Oops!",
                text: 'We do not found any course to put this stage inside it!.',
              });
            }else{ // when inputs are validated and parent course is selected
              try {
                this.isSubmitting = true;
                // do this to make user wait
                var time: number = 30000;
                Swal.fire({
                  icon: 'info',
                  title: 'Please wait',
                  text: 'Creating stage and fetching lessons from YouTube API...',
                  allowOutsideClick: false, // Prevent the user from dismissing the alert by clicking outside of it
                  timerProgressBar: true, // Enable the progress bar
                  timer: time,
                  showConfirmButton: false,
                  showCancelButton: false,
                });
                // start work
                const response = await axios.post('http://localhost:3000/stages',{
                  title: this.stage.title,
                  hasProject: this.stage.hasProject,
                  course: this.stage.course
                });
                const lessonsData = await this.loadLessonsDataFromYoutube(response.data.id);
                this.createStagesLessons(lessonsData);
                time = 1;
                Swal.fire({
                  icon: "success",
                  title: "Done...!",
                  text: 'Stagge Added with it\'s lessons successfully.!',
                });
              } catch (error) {
                console.log(error);
              } finally {
                this.isSubmitting = false;
              }
              // return emit and hide this modal
              this.$emit("stage-created", this.stage);
              const cancelButton = document.getElementById("cancelButton");
              (cancelButton as any).click();
            }
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: 'You should fill all boxes! and be sure that you found the course that will hold this stage.',
          });
        }
    },
  },
})
export default class AddNewStage extends Vue {
  [x: string]: any;
}
</script>
