<template>
  <div v-if="getUser" class="container mt-2">
    <div class="row">
      <div class="col-12">
        <div class="card mb-5">
          <div class="card-header">
            <h4>Confirmation Status</h4>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-4">
                <img
                  :src="`http://localhost:3000${user.picturePath}`"
                  class="img-fluid rounded-start"
                  alt="User Avatar"
                />
              </div>
              <div v-if="user.supervisorConfirmation[0]" class="col-md-8">
                <h5 class="card-title">{{ user.fullName }}</h5>
                <p class="card-text">@{{ user.username }}</p>
                <div
                  v-if="user.supervisorConfirmation[0].isConfirmed"
                  class="alert alert-success"
                  role="alert"
                >
                  Congratulations! Your certification documents are confirmed.
                </div>
                <div v-else class="alert alert-warning" role="alert">
                  Your certification documents are not confirmed yet.
                </div>
                <div v-if="!user.supervisorConfirmation[0].isConfirmed">
                  <h6 class="card-subtitle mb-2 text-muted">
                    Reviewer Comment:
                  </h6>
                  <p>{{ user.supervisorConfirmation[0].reviewerComment }}</p>
                  <a
                    :href="`http://localhost:3000${user.supervisorConfirmation[0].certificationsDocsPath}`"
                    class="btn btn-outline-primary"
                  >
                    <i class="fas fa-file-pdf"></i>
                    Show Certification Documents </a
                  ><br />
                  <div
                    class="btn-group mt-2 mb-2"
                    role="group"
                    aria-label="Basic checkbox toggle button group"
                  >
                    <input
                      v-model="showForm"
                      type="checkbox"
                      class="btn-check"
                      id="btncheck1"
                      autocomplete="off"
                    />
                    <label class="btn btn-outline-primary" for="btncheck1"
                      >Change Certification Documents</label
                    >
                  </div>
                  <form
                    class="border border-primary p-3"
                    v-if="showForm"
                    @submit.prevent="updateCertifcationDoc"
                  >
                    <div id="form-group">
                      <div class="mb-3">
                        <label for="pdf-file" class="form-label"
                          >Upload Certification Documents (PDF)</label
                        >
                        <input
                          type="file"
                          class="form-control"
                          id="pdf-file"
                          accept="application/pdf"
                          @change="onFileChange"
                        />
                      </div>
                      <button
                        :disabled="isSubmitting"
                        type="submit"
                        class="btn btn-primary"
                      >
                        Update
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
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
  data() {
    return {
      user: null,
      showForm: false,
      formData: {
        certificationDocs: null,
      },
      isSubmitting: false,
    };
  },
  created() {
    setInterval(() => {
      this.getUserProfileUsingStoredTokens();
    },10000);
  },
  methods: {
    getUserProfileUsingStoredTokens() {
      const userCookies = this.$store.state.userTokens;
      if (userCookies) {
        axios
          .get("http://localhost:3000/auth/profile", {
            headers: {
              'Authorization': 'Bearer ' + userCookies,
              'Content-Type': 'application/json'
            }
          })
          .then((res) => {
            if (res.data){
              this.user = res.data;
              this.$store.dispatch('login', res.data);
            }
          })
          .catch((err) => {});
      }
    },
    updateCertifcationDoc() {
      if (!this.formData.certificationDocs) {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "No PDF file was located!",
        });
        return;
      }
      this.isSubmitting = true;
      const formDataInstance = new FormData();
      formDataInstance.append("files", this.formData.certificationDocs);
      axios
        .post(
          `http://localhost:3000/confirmations/${this.user.supervisorConfirmation[0].id}`,
          formDataInstance,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then(async (response) => {
          this.user.supervisorConfirmation[0].certificationsDocsPath =
            response.data.certificationsDocsPath;
          await Swal.fire({
            icon: "success",
            title: `Done!...`,
            text: "Certification Documents updated successfully",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: error.response.data.message,
          });
          this.isSubmitting = false;
        });
    },
    onFileChange(event: any) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {};

      reader.readAsDataURL(file);
      this.formData.certificationDocs = file;
    },
  },
  computed: {
    getUser() {
      this.user = this.$store.state.user;
      if (this.user) {
        this.user.userType != "supervisor" ? this.$router.push("/user") : null;
      }
      return this.user;
    },
  },
})
export default class WaitingConfirmationView extends Vue {
  [x: string]: any;
}
</script>

<style scoped></style>
