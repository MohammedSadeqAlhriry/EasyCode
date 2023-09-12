<template>
  <div v-if="askedProject">
    <div class="m-5">
      <h1 class="text-center">
        <strong>You are required to biuld this project</strong>
      </h1>
      <div class="m-3">
        <span class="fs-4 fw-bold me-1">Name:</span>
        <span class="fs-5">{{ askedProject.name }}</span>
      </div>
      <div class="m-3">
        <span class="fs-4 fw-bold me-1 fw-bold">
          <i class="fa fa-file-archive" aria-hidden="true"></i> Decoument:
        </span>
        <button
          @click="downloadThisStagesAskedProjectFile(askedProject)"
          class="btn btn-info" :disabled="isDownloading"
        >
          <i class="fa fa-cloud-download" aria-hidden="true"></i> 
          {{ isDownloading ? 'Downloading...' : 'Download' }}
        </button>
        or
        <a
          :href="`http://localhost:3000${askedProject.documentsPath}`"
          target="_blank"
          class="btn btn-primary"
          ><i class="fa fa-eye" aria-hidden="true"></i> View
        </a>
      </div>
    </div>
    <div class="border rounded p-3 m-5">
      <h5 class="border-bottom pb-2 text-warning">
        <i class="fa fa-exclamation-triangle" aria-hidden="true"></i> Note
      </h5>
      <p class="text-secondary">
        You need to download or view this PDF document in order to read the
        asked project details and then submit the project from the form bellow.
        <span class="text-warning d-block">
          (save your project in .zip or .rar and submit it bellow)</span
        >
      </p>
    </div>
    <div class="card border-primary m-5 row" style="background: #eaebed">
      <form @submit.prevent="createStudentProject" class="col-12 needs-validated p-4">
        <!--title the form -->
        <h3 class="col-12">Submit The Project.</h3>
        <!-- Project title input -->
        <div class="mb-3 was-validated">
          <label for="projectTitle" class="form-label ms-2"
            >Enter your project title</label
          >
          <input
            v-model="projectTitle"
            type="text"
            class="form-control"
            id="projectTitle"
            required
          />
          <div class="invalid-feedback fs-6">
            Please enter your project title.
          </div>
          <div class="valid-feedback fs-6">Looks Good</div>
        </div>

        <!-- Project image input -->
        <div class="mb-3 was-validated">
          <label for="projectImage" class="form-label ms-2"
            >Enter your project image</label
          >
          <input
            @change="onImageFileChange"
            ref="projectImage"
            type="file"
            class="form-control"
            id="projectImage"
            accept="image/*"
            required
          />
          <div class="invalid-feedback fs-6">
            Please enter your project image.
          </div>
          <div class="valid-feedback fs-6">Looks Good</div>
        </div>

        <!-- Project document input -->
        <div class="mb-3 was-validated">
          <label for="projectDocument" class="form-label ms-2"
            >Enter your project document (.rar or .zip)</label
          >
          <input
            @change="onProjectFileChange"
            ref="projectDocument"
            type="file"
            class="form-control"
            id="projectDocument"
            accept=".rar,.zip"
            required
          />
          <div class="invalid-feedback fs-6">
            Please enter your project document.
          </div>
          <div class="valid-feedback fs-6">Looks Good</div>
        </div>

        <!-- Submit button -->
        <button
          type="submit"
          class="btn btn-primary d-block mt-4 m-auto fw-bold col-9"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import Swal from "sweetalert2";
import { Options, Vue } from "vue-class-component";
@Options({
  async created() {
    await this.loadStage();
    await this.checkifTheUserHasSubmittedThisStageProject();
  },
  data() {
    return {
      askedProject: null,
      stage: null,
      // those here are the students projects variables
      projectTitle: "",
      isDownloading: false,
      imageFile: null,
      projectFile: null
    };
  },
  methods: {
    async checkifTheUserHasSubmittedThisStageProject() {
      try {
        const response = await axios.get('http://localhost:3000/projects/getByStageAskedProjectId/'+this.askedProject.id,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.userTokens,
            'Content-Type': 'application/json'
          }
        });
        if (response.data && this.$store.state.user.userType == 'student') {
          this.goToWaitingProjectConfirmationPage();
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: `oOPs...`,
          text: "Network Error.",
        })
      }
    },
    goToWaitingProjectConfirmationPage() {
      this.$router.push('/projectConfirmation');
    },
    createStudentProject() {
      if (this.$store.state.user.userType != 'student') {
        Swal.fire({
          icon: "error",
          title: `oOPs...`,
          text: "You are not allowd to do this action.",
        })
        return;
      }
      this.isSubmitting = true;
      var sumittingProgressTime : number = 20000;
      Swal.fire({
        icon: "info",
        title: `Uploading!...`,
        text: "please wait until we finishing submitted your project.",
        showConfirmButton: false,
        timer: sumittingProgressTime,
        timerProgressBar: true,
      })
      const formDataInstance = new FormData();
      formDataInstance.append("files", this.imageFile);
      formDataInstance.append("files", this.projectFile);
      formDataInstance.append("title", this.projectTitle);
      formDataInstance.append("askedProject", JSON.stringify(this.askedProject));
      formDataInstance.append("student", JSON.stringify(this.$store.state.user));
      if (this.$store.state.courseInCourseDatailsPage){
        formDataInstance.append("course", JSON.stringify(this.$store.state.courseInCourseDatailsPage));
      } else {
        formDataInstance.append("course", JSON.stringify({
          id: this.$store.state.user.currentCourseId
        }));
      }
      
      axios
        .post("http://localhost:3000/projects", formDataInstance, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          sumittingProgressTime = 1000;
          Swal.fire({
            icon: "success",
            title: `Done!...`,
            text: "Project Submitted successfully, we are going to direct you to go To Waiting Project Confirmation Page."
          });
          this.goToWaitingProjectConfirmationPage();
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: error.response.data.message,
          });
        }).finally(() => {
          this.isSubmitting = false;
        });
    },
    onImageFileChange(event: any) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {};
      reader.readAsDataURL(file);
      this.imageFile = file;
    },
    onProjectFileChange(event: any) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {};
      reader.readAsDataURL(file);
      this.projectFile = file;
    },
    async downloadThisStagesAskedProjectFile(askedProject: any) {
      console.log("Downloading...");
      this.isDownloading = true;
      const parts = askedProject.documentsPath.split("/");
      const filename = parts[parts.length - 1];
      //const filenameWithoutExtension = filename.slice(0, filename.lastIndexOf('.'));
      axios({
        url: `http://localhost:3000/downloads/${filename}`,
        method: "GET",
        responseType: "blob",
      })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename);
          link.style.display = "none"; // hide the link
          document.body.appendChild(link); // append the link to the document body
          link.click();
          Swal.fire({
            icon: "info",
            title: "Download Compeleted.",
            text: `downloading ${askedProject.name} has been compeleted successfully.`,
          });
          document.body.removeChild(link); // remove the link from the document body after download is complete
        })
        .catch((error) => {
          console.log(error);
        }).finally(() => {
          this.isDownloading = false;
        });
    },
    async loadStage() {
      this.stage = await this.$store.state.stageInShowAskedProjectPage;
      !this.stage
        ? this.$router.push("/")
        : (this.askedProject = this.stage.stageAskedProjects[0]);
    }
  },
})
export default class StageAskedProjectView extends Vue {
  [x: string]: any;
  askedProject: any;
  projectTitle: any;
}
</script>
