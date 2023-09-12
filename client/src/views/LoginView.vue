<template>
  <div class="container py-5" style="min-height: 90vh">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <h1 class="text-center mb-5">Login</h1>
        <form
          @submit.prevent="submitForm"
          class="needs-validation"
          novalidate
          ref="form"
        >
          <div class="form-group mb-3">
            <label for="username">Username or Email</label>
            <input
              type="text"
              class="form-control"
              id="username"
              name="username"
              v-model="username"
              required
            />
            <div class="invalid-feedback">
              Please enter your username or email.
            </div>
          </div>
          <div class="form-group mb-3">
            <label for="password">Password</label>
            <input
              type="password"
              class="form-control"
              id="password"
              name="password"
              v-model="password"
              required
            />
            <div class="invalid-feedback">Please enter your password.</div>
          </div>
          <div class="form-group form-check mb-3">
            <input
              type="checkbox"
              class="form-check-input"
              id="remember-me"
              name="remember-me"
              v-model="rememberMe"
            />
            <label class="form-check-label" for="remember-me"
              >Remember me</label
            >
          </div>
          <button
            type="submit"
            class="btn btn-primary w-100"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "Logging in..." : "Login" }}
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
  data() {
    return {
      username: "",
      password: "",
      rememberMe: false,
      isSubmitting: false,
    };
  },
  methods: {
    submitForm() {
      if (this.$refs.form.checkValidity()) {
        this.isSubmitting = true;
        axios
          .post("http://localhost:3000/auth/login", {
            username: this.username,
            password: this.password,
          })
          .then((response) => {
            this.$store.dispatch('login', response.data.user);
            this.$store.state.userTokens = response.data.access_token;
            if (this.rememberMe) {
              Cookies.set("userTokens", response.data.access_token, { expires: 30 });
            }else{
              Cookies.set("userTokens", response.data.access_token, { expires: null });
            }
            const userType = response.data.user.userType;
            if (userType === "admin") {
              this.$router.push("/dashboard");
            } else {
              if (userType == 'supervisor') {
                if (response.data.user.supervisorConfirmation[0].isConfirmed) {
                  this.$router.push("/user");
                } else {
                  this.$router.push("/confirmation");
                }
              } else {
                this.$router.push("/user"); // go to user page
              }
            }
            Swal.fire({
              icon: "success",
              title: "Welcome back!",
              text: `You have successfully logged in as ${userType}.`,
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.response.data.message,
            });
          })
          .finally(() => {
            this.isSubmitting = false;
          });
      } else {
        this.$refs.form.classList.add("was-validated");
      }
    },
    getUserProfileUsingStoredTokens() {
      const userCookies = Cookies.get("userTokens");
      if (userCookies) {
        axios
          .get("http://localhost:3000/auth/profile", {
            headers: { Authorization: `Bearer ${userCookies}` },
          })
          .then((res) => {
            this.$store.dispatch('login', res.data);
            this.$store.state.userTokens = userCookies;
            if (res.data.userType == "admin") {
              this.$router.push("/dashboard"); // go to dashboard
              Swal.fire({
                icon: "success",
                title: "Welcome back!",
                text: "You have successfully logged in as an Admin.",
              });
            } else {
              if (res.data.userType == 'supervisor') {
                if (res.data.supervisorConfirmation[0].isConfirmed) {
                  this.$router.push("/user");
                } else {
                  this.$router.push("/confirmation");
                }
              } else {
                this.$router.push("/user"); // go to user page
              }
              Swal.fire({
                icon: "success",
                title: "Welcome back!",
                text: `You have successfully logged in as ${res.user.userType}.`,
              });
            }
          })
          .catch((err) => {});
      }
    }
  },
  mounted() {
    this.getUserProfileUsingStoredTokens();
  },
};
</script>
