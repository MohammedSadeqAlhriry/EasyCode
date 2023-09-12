<template>
  <div
    id="addNewtageAskedProject"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="AddStageAskedProjectModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addCourseModalLabel">
            Add the Stage Asked Project.
          </h5>
          <button
            id="addAskedProjectCancelButton"
            class="btn btn-outline-danger"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="btn-close m-1"></i>
          </button>
        </div>
        <div class="modal-body">
          <div
            class="form-container d-flex align-items-center justify-content-center fs-4"
          >
            <div
              class="form-border w-100 p-4 ratio-1x1 rounded"
              style="background: #eaebed"
            >
              <form @submit.prevent="createStageAskedProject" class="needs-validated">
                <!-- Project name input -->
                <div class="mb-3 was-validated">
                  <label for="projectName" class="form-label"
                    >Project name</label
                  >
                  <input
                    v-model="name"
                    type="text"
                    class="form-control"
                    id="projectName"
                    required
                  />
                  <div class="invalid-feedback fs-6">
                    Please enter your project name
                  </div>
                  <div class="valid-feedback fs-6">Looks Good</div>
                </div>

                <!-- Project document file input -->
                <div class="mb-3 was-validated">
                  <label for="projectDocument" class="form-label"
                    >Project document</label
                  >
                  <input
                    @change="onFileChnage"
                    type="file"
                    class="form-control"
                    id="projectDocument"
                    accept=".pdf"
                    required
                  />
                  <div class="invalid-feedback fs-6">
                    Please enter your project path
                  </div>
                  <div class="valid-feedback fs-6">Looks Good</div>
                </div>

                <!-- Submit button -->
                <button type="submit" class="btn btn-success col-10 ms-5 mt-4 fs-5 fw-bold">
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import Swal from 'sweetalert2';
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    currentStageForCreateAskedProject: null
  },
  data() {
    return {
      name: '',
      projectFile: null,
      isSubmitting: false
    }
  },
  methods: {
    onFileChnage(event: any) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {};
      reader.readAsDataURL(file);
      this.projectFile = file;
    },
    createStageAskedProject() {
      this.isSubmitting = true;
      const formDataInstance = new FormData();
      formDataInstance.append("files", this.projectFile);
      formDataInstance.append('name', this.name);
      formDataInstance.append('stage',JSON.stringify(this.currentStageForCreateAskedProject));

      axios.post('http://localhost:3000/stage-asked-project',formDataInstance,{
        headers: {
        "Content-Type": "multipart/form-data",
        },
      }).then(async (response) => {
        const cancelButton = document.getElementById("addAskedProjectCancelButton");
        (cancelButton as any).click();
        this.name = '',
        this.isSubmitting = false;
        await Swal.fire({
          icon: "success",
          title: `Done!...`,
          text: "Asked Project Added successfully",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        this.$emit('done');
      }).catch((error) => {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: error.response.data.message,
        });
        this.isSubmitting = false;
      });
    }
  },
})
export default class ShowSAddNewStageAskedProjecttages extends Vue {
  [x: string]: any;
}
</script>
