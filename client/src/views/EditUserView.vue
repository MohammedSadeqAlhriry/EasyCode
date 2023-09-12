<template>
  <div class="container py-5" style="min-height: 90vh" v-if="user">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <h1 class="text-center mb-5">Edit User Information</h1>
        <form @submit.prevent="submitForm" class="needs-validation" novalidate ref="form">
          <div v-for="(field, index) in fields" :key="index" :class="field.width" class="form-group was-validated mb-2">
            <label class="form-label" :for="field.name">{{
              field.label
            }}</label>
            <template v-if="field.type === 'text' || field.type === 'email'">
              <input :id="field.name" class="form-control" :type="field.type" :name="field.name"
                :placeholder="field.placeholder" v-model="formData[field.name]"
                :accept="field.accept" :required="field.required" />
            </template>
            <template v-if="field.type === 'password'">
              <input :id="field.name" class="form-control" :type="field.type" :name="field.name"
                :placeholder="field.placeholder" v-model="formData[field.name]"
                :accept="field.accept" />
            </template>
            <template v-else-if="field.type === 'file'">
              <img :src="previewImage ? previewImage : `http://localhost:3000${user.picturePath}`" class="mt-2" style="max-width: 100%" />
              <input :id="field.name" class="form-control" :type="field.type" :name="field.name" :accept="field.accept"
                @change="onFileChange" ref="fileInput" />
              <div class="valid-feedback fs-6">Looks Good</div>
            </template>
            <template v-else-if="field.type === 'date'">
              <input :id="field.name" class="form-control" :type="field.type" :name="field.name"
                :placeholder="field.placeholder" v-model="formData[field.name]" :required="field.required" />
            </template>
          </div>
          <div v-if="formData.userType === 'supervisor'" class="form-group col-lg-12 was-validated mt-4 mb-4">
            <label class="form-label" for="certificationsDocs">
              Certifications Document(PDF) 
              <a class="btn btn-info" target="__blank" :href="`http://localhost:3000${user.supervisorConfirmation[0].certificationsDocsPath}`">Show Previous</a>
            </label>
            <input id="certificationsDocs" class="form-control" type="file" name="certificationsDocs"
              accept="application/pdf" @change="onDocFileChange" />
          </div>
          <button type="submit" class="btn btn-primary w-100" :disabled="isSubmitting">
            {{ isSubmitting ? "Editing..." : "Update" }}
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
  created() {
    this.user = this.$store.state.userInEditUserPage;
    if (!this.user) {
      this.$router.push('/');
    }else{
      this.formData.username        = this.user.username;
      this.formData.fullName        = this.user.fullName;
      this.formData.email           = this.user.email;
      this.formData.address         = this.user.address;
      this.formData.userType        = this.user.userType;
      this.formData.userDescription = this.user.userDescription;
      // change date type to the accepted way
      const timestamp = this.user.birthDate;
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const day = ("0" + date.getDate()).slice(-2);
      const dateStr = `${year}-${month}-${day}`;
      this.formData.birthDate = dateStr;
    }
  },
  data() {
    return {
      fields: [
        {
          label: "Personal Photo",
          name: "photo",
          type: "file",
          width: "col-lg-12",
          accept: "image/*",
          validationMessage: "Please select a photo for you",
        },
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
          label: "Old Password",
          name: "password",
          type: "password",
          width: "col-lg-12",
          placeholder: "Enter Your Old Password",
        },
        {
          label: "New Password",
          name: "newPassword",
          type: "password",
          width: "col-lg-12",
          placeholder: "Enter The New Password",
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
        oldPassword: "",
        newPassword: "",
        fullName: "",
        address: "",
        userDescription: "",
        userType: "student",
        birthDate: null,
        files: [null, null],
      },
      previewImage: null,
      isSubmitting: false,
      user: null
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
          text: "You need to fill all required boxes until their colors turn green, then do submit!",
        });
        return;
      }
      this.isSubmitting = true;
      // get all data inside formDataInstance
      const formDataInstance = new FormData();

      // add the file data to the FormData object
      formDataInstance.append("files", this.formData.files[0]);
      formDataInstance.append("files", this.formData.files[1]);
      if (this.formData.files[0]) {
        formDataInstance.append("isPhotoChanged", "true");
      }
      if (this.formData.files[1]) {
        formDataInstance.append("isCertificationsDocsChanged", "true");
      }
      Object.keys(this.formData).forEach((key) => {
        if (key !== "files") {
          formDataInstance.append(key, this.formData[key]);
        }
      });
      axios.put(`http://localhost:3000/users/${this.user.id}`, formDataInstance, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
      }).then(async (response) => {
        if (this.$store.state.user.userType == 'admin') {
          this.$router.push("/dashboard");
          await Swal.fire({
            icon: "success",
            title: `UPDATED`,
            text: `${response.data.user.fullName} has been updated successfully`,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
        } else {
          this.storeThisNewUserInfo(response.data.user, response.data.tokens);
        }
      }).catch((error) => { 
        console.log(error);
      });
    },
    async storeThisNewUserInfo(user,tokens) {
      this.$store.dispatch("login", user);
      await this.storeUserCookies(tokens);
      if (user.userType == 'supervisor') {
        if (user.supervisorConfirmation[0].isConfirmed) {
          this.$router.push("/user");
        } else {
          this.$router.push("/confirmation");
        }
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
