<template>
  <div class="container py-5" style="min-height: 90vh">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <h1 class="text-center mb-5">Sign Up</h1>
        <form @submit.prevent="submitForm" class="needs-validation" novalidate ref="form">
          <div v-for="(field, index) in fields" :key="index" :class="field.width" class="form-group was-validated mb-2">
            <label class="form-label" :for="field.name">{{
              field.label
            }}</label>
            <template v-if="field.type === 'text' ||
                field.type === 'email' ||
                field.type === 'password'
                ">
              <input :id="field.name" class="form-control" :type="field.type" :name="field.name"
                :placeholder="field.placeholder" v-model="formData[field.name]" :required="field.required"
                :accept="field.accept" />
            </template>
            <template v-else-if="field.type === 'file'">
              <input :id="field.name" class="form-control" :type="field.type" :name="field.name" :accept="field.accept"
                @change="onFileChange" :required="field.required" ref="fileInput" />
              <div class="invalid-feedback fs-6">
                {{ field.validationMessage }}
              </div>
              <img v-if="previewImage" :src="previewImage" class="mt-2" style="max-width: 100%" />
              <div class="valid-feedback fs-6">Looks Good</div>
            </template>
            <template v-else-if="field.type === 'date'">
              <input :id="field.name" class="form-control" :type="field.type" :name="field.name"
                :placeholder="field.placeholder" v-model="formData[field.name]" :required="field.required" />
            </template>
          </div>
          <div class="form-group col-lg-12 mt-2 mb-2">
            <label class="form-label" for="userType">User Type</label>
            <select class="form-select" id="userType" name="userType" v-model="formData.userType" required>
              <option value="student">Student</option>
              <option value="supervisor">Supervisor</option>
            </select>
          </div>
          <div v-if="formData.userType === 'supervisor'" class="form-group col-lg-12 was-validated mt-4 mb-4">
            <label class="form-label" for="certificationsDocs">Certifications Document(PDF)</label>
            <input id="certificationsDocs" class="form-control" type="file" name="certificationsDocs"
              accept="application/pdf" @change="onDocFileChange" required />
          </div>
          <button type="submit" class="btn btn-primary w-100" :disabled="isSubmitting">
            {{
              isSubmitting
              ? addUser
                ? "Adding User ..."
                : "Signing Up ..."
              : addUser
                ? "Add New User"
                : "Sign Up"
            }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

export default {
  props: {
    addUser: Boolean,
  },
  data() {
    return {
      fields: [
        {
          label: "User Name",
          name: "username",
          type: "text",
          width: "col-lg-12",
          placeholder: "Enter your username",
          required: true,
          validationMessage: "Please enter your username",
        },
        {
          label: "Email Address",
          name: "email",
          type: "email",
          width: "col-lg-12",
          placeholder: "Enter your email address",
          required: true,
          validationMessage: "Please enter your email address",
        },
        {
          label: "Password",
          name: "password",
          type: "password",
          width: "col-lg-12",
          placeholder: "Enter your password",
          required: true,
          validationMessage: "Please enter your password",
        },
        {
          label: "Repeat Password",
          name: "password2",
          type: "password",
          width: "col-lg-12",
          placeholder: "Repeat your password",
          required: true,
          validationMessage: "Please repeat your password",
        },
        {
          label: "Full Name",
          name: "fullName",
          type: "text",
          width: "col-lg-12",
          placeholder: "Enter your full name",
          required: true,
          validationMessage: "Please enter your full name",
        },
        {
          label: "Location/Address",
          name: "address",
          type: "text",
          width: "col-lg-12",
          placeholder: "Enter your address",
          required: true,
          validationMessage: "Please enter your address",
        },
        {
          label: "Short Description",
          name: "userDescription",
          type: "text",
          width: "col-lg-12",
          placeholder: "Enter short description about your self",
          required: true,
          validationMessage: "Please enter your description",
        },
        {
          label: "Personal Photo",
          name: "photo",
          type: "file",
          width: "col-lg-12",
          accept: "image/*",
          required: true,
          validationMessage: "Please select a photo for you",
        },
        {
          label: "Birth Date",
          name: "birthDate",
          type: "date",
          width: "col-lg-12",
          placeholder: "Enter your birth date",
          required: true,
          validationMessage: "Please enter your birth date",
        },
      ],
      formData: {
        username: "",
        email: "",
        password: "",
        password2: "",
        fullName: "",
        address: "",
        userDescription: "",
        userType: "student",
        picturePath: "path/will/setup/on/server",
        birthDate: null,
        files: [null, null],
      },
      previewImage: null,
      isSubmitting: false,
    };
  },
  methods: {
    storeUserCookies(tokens) {
      // first store them in the store state userTokens
      this.$store.state.userTokens = tokens;
      // then store them in the browser cookies
      return new Promise((resolve) => {
        Swal.fire({
          title: "cookies?",
          text: "clik on Yes to Allow us to store your tokens in your browser so you can enter our website another time without any need to re-enter your login info.",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes, store my tokens!",
          cancelButtonText: "No",
        }).then((result) => {
          if (result.isConfirmed) {
            Cookies.set("userTokens", tokens, { expires: 30 });
            Swal.fire(
              "Saved!",
              "Your tokens has been saved on your browser for 30 days.",
              "success"
            ).then(() => {
              resolve();
            });
          } else {
            Cookies.set("userTokens", tokens, { expires: null });
            resolve();
          }
        });
      });
    },
    submitForm() {
      if (!this.$refs.form.checkValidity()) {
        Swal.fire({
          icon: "error",
          title: "Validite Error!",
          text: "You need to fill all boxes until their colors turn green, then do submit!",
        });
        return;
      }
      if (this.formData.password != this.formData.password2) {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Passwords do not match!",
        });
        return;
      }
      this.isSubmitting = true;
      // get all data inside formDataInstance
      const formDataInstance = new FormData();

      // add the file data to the FormData object
      formDataInstance.append("files", this.formData.files[0]);
      formDataInstance.append("files", this.formData.files[1]);
      Object.keys(this.formData).forEach((key) => {
        if (key !== "files") {
          formDataInstance.append(key, this.formData[key]);
        }
      });

      axios
        .post("http://localhost:3000/users", formDataInstance, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(async (response) => {
          // know the user type who dose this opertion using the tokens
          if (this.$store.state.user) {
            if (this.$store.state.user.userType == 'admin') {
              this.$router.push("/dashboard");
              await Swal.fire({
                icon: "success",
                title: `DONE`,
                text: `${response.data.user.fullName} has been added successfully`,
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
              });
              this.$emit("done");
            } else {
              this.storeThisNewUserInfo(response.data.user, response.data.tokens);
            }
          } else {
            this.storeThisNewUserInfo(response.data.user, response.data.tokens);
          }
        }).catch((error) => { });
    },
    async storeThisNewUserInfo(user,tokens) {
      this.$store.dispatch("login", user);
      await this.storeUserCookies(tokens);
      if (user.userType == 'supervisor') {
        this.$router.push("/confirmation");
      } else {
        this.$router.push("/user"); // go to user page
      }
      let timerInterval;
      await Swal.fire({
        icon: "success",
        title: `Welcome ${user.fullName}`,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    },
    onFileChange(event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        this.previewImage = event.target.result;
      };

      reader.readAsDataURL(file);
      this.formData.files[0] = file;
    },
    onDocFileChange(event) {
      const file = event.target.files[0];
      this.formData.files[1] = file;
    },
  },
};
</script>
