<template>
  <div
    class="modal fade"
    id="addCourseAdmin"
    tabindex="-1"
    aria-labelledby="addCourseAdminModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addCourseAdminModalLabel">Add Course Admin</h5>
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
            <div class="mb-3" v-if="searchedSupervisor">
              <label for="selectedSupervisor" class="form-label"
                >Selected Supervisor fullName and username</label
              >
              <input
                v-model="slelctedSupervisor.fullName"
                type="text"
                class="form-control"
                id="selectedSupervisor"
                readonly
              />
              <br>
              <input
                v-model="slelctedSupervisor.username"
                type="text"
                class="form-control"
                id="selectedSupervisor"
                readonly
              />
            </div>
            <div class="mb-3">
              <label for="parentSupervisorSearchTerm" class="form-label"
                >Search for Supervisor</label
              >
              <input
                v-model="parentSupervisorSearchTerm"
                type="text"
                class="form-control"
                id="parentSupervisorSearchTerm"
                placeholder="Enter Supervisor username, full name, email..."
                required
              />
              <div class="invalid-feedback">Please select a Supervisor.</div>
            </div>
            <div class="modal-footer">
                <button id="addCourseAdminCancelButton" type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    Close
                </button>
                <button :disabled="isSubmitting" type="submit" class="btn btn-primary">
                    {{ isSubmitting ? 'Adding ....' : 'Add Course Admin' }}
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
import axios from "axios";
import Swal from "sweetalert2";

@Options({
  props: {
    courseToBeAssignedUserAdminTo: null
  },
  async created() {
    await this.loadSupervisors();
  },
  data() {
    return {
      isSubmitting: false,
      parentSupervisorSearchTerm: "",
      supervisors: [],
      slelctedSupervisor: null,
      course: null
    };
  },
  computed: {
    searchedSupervisor() {
      if (this.parentSupervisorSearchTerm !== "") {
        const searchTermLC = this.parentSupervisorSearchTerm.toLowerCase();
        this.slelctedSupervisor = this.supervisors.find((supervisor: any) => {
          return supervisor.username.toLowerCase().includes(searchTermLC) || 
          supervisor.fullName.toLowerCase().includes(searchTermLC) ||
          supervisor.email.toLowerCase().includes(searchTermLC);
        });
        if (this.slelctedSupervisor) {
          this.course = this.courseToBeAssignedUserAdminTo;
        }
        return this.slelctedSupervisor;
      } else {
        return null;
      }
    },
  },
  methods: {
    async loadSupervisors() {
      try {
        const respons = await axios.get('http://localhost:3000/users/supervisors');
        this.supervisors = await respons.data;
      } catch (error) {}
    },
    async onSubmit() {
        const form = document.querySelector('.needs-validation') as HTMLFormElement;
        if (form.checkValidity() === true) {
          if (!this.slelctedSupervisor) {
            await Swal.fire({
                icon: "error",
                title: `oOPs..`,
                text: "No supervisor found.",
            });
            return;
          }
          try {
            this.isSubmitting = true;
            const response = await axios.post(`http://localhost:3000/courses/adminForThisCourse/${this.course.id}`,{
              id: this.slelctedSupervisor.id
            });
          } catch (error) {
            console.log(error);
          } finally {
            this.isSubmitting = false;
          }
          await Swal.fire({
              icon: "success",
              title: `Done!...`,
              text: "Course Admin Added successfully",
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
          });
          const cancelButton = document.getElementById("addCourseAdminCancelButton");
          (cancelButton as any).click();
        }
    
    },
  },
})
export default class AddCourseAdmin extends Vue {
  [x: string]: any;
}
</script>
