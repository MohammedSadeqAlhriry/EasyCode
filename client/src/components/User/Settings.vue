<template>
  <div class="form-container d-flex align-items-center justify-content-center fs-4">
    <div class="form-border m-lg-5 m-3 w-75 p-4 ratio-1x1  rounded" style="background:#EAEBED">
      <h2 class="tital text-center mb-4 ">Settings</h2>
      <hr>

      <form action="" class="needs-validated row mt-4">
        <div class="form-group was-validated col-lg-6 mb-2">
            <label class="form-label"  for="username">User Name</label>
            <input  id="username" class="form-control" type="text" name="" placeholder="Enter your username" required>
            <div class="invalid-feedback fs-6">Please enter your user name</div>
            <div class="valid-feedback fs-6">Looks Good</div>
        </div>
        <div class="form-group was-validated col-lg-6 mb-2">
            <label class="form-label" for="my-email">Email Address</label>
            <input  id="my-email" class="form-control" type="email" name="" placeholder="Enter your email address" required>
            <div class="invalid-feedback fs-6">Please enter your email address</div>
            <div class="valid-feedback fs-6">Looks Good</div>
        </div>
        <div class="form-group was-validated col-lg-6 mb-2 mb-2">
            <label class="form-label" for="my-password">Password</label>
            <input id="my-password" class="form-control" type="password" name="" placeholder="Enter your password" required>
            <div class="invalid-feedback fs-6">Please enter your password</div>
            <div class="valid-feedback fs-6">Looks Good</div>
        </div>
        
        <div class="form-group was-validated col-lg-6 mb-2">
            <label class="form-label" for="my-repassword">Repeat Password</label>
            <input id="my-repassword" class="form-control" type="password" name="" placeholder="Enter repeat your password" required>
            <div class="invalid-feedback fs-6">Please enter your password confirmation</div>
            <div class="valid-feedback fs-6">Looks Good</div>
        </div>
        <div class="form-group was-validated col-lg-6 mb-2">
            <label class="form-label"  for="fullname">Full Name</label>
            <input  id="fullname" class="form-control" type="text" name="" placeholder="Enter your full name" required>
            <div class="invalid-feedback fs-6">Please enter your full name</div>
            <div class="valid-feedback fs-6">Looks Good</div>
        </div>
        <div class="form-group was-validated  col-lg-6 mb-2">
            <label class="form-label" for="my-address">Address</label>
            <input id="my-address" class="form-control " type="text" name="" placeholder="Enter your address" required>
            <div class="invalid-feedback fs-6">Please enter your address</div>
            <div class="valid-feedback fs-6">Looks Good</div>
        </div>
        <div class="group-Elements-supervisor col-lg-12 row p-0  m-auto " id="supervisorElement">
            <div class="form-group col-lg-6 was-validated">
                <label for="degree-score">Degree Score 100%</label>
                <input id="degree-score" class="form-control" type="number" name="" required>
                <div class="invalid-feedback fs-6 ">Please enter your Degree Score</div>
            <div class="valid-feedback fs-6">Looks Good</div>
            </div>
            <div class="form-group was-validated col-lg-6 mb-2">
                <label class="form-label" for="my-birthdate">Birth date</label>
                <input id="my-birthdate" class="form-control" type="date" name="" placeholder="Enter your Birth date" required>
                <div class="invalid-feedback fs-6 ">Please enter your Birth date</div>
                <div class="valid-feedback fs-6">Looks Good</div>
            </div>
        </div>
        <div class="group-Elements-supervisor col-lg-12 row p-0  m-auto " id="supervisorElement">
            <div class="form-group col-lg-6 was-validated">
                <label for="personal-image">Personal Image</label>
                <input id="personal-image" class="form-control" type="file" name="" required>
                <div class="invalid-feedback fs-6 ">Please enter your personal image</div>
                <div class="valid-feedback fs-6">Looks Good</div>
            </div>
            <div class="form-group col-lg-6 was-validated">
                <label for="certifications-documents">Certifications Documents</label>
                <input id="certifications-documents" class="form-control" type="file" name="" required>
                <div class="invalid-feedback fs-6 ">Please enter your Certifications Documents</div>
                <div class="valid-feedback fs-6">Looks Good</div>
            </div>
        </div>           
        <div class="row">
          <input type="submit" class="btn saveChangesButton col-lg-5 m-auto mt-3 fs-5 fw-bold m-2" value="Save Changes">
          <button class="btn btn-danger col-lg-5 m-auto mt-3 fs-5 fw-bold m-2">Delete</button>
        </div> 
      </form>
    </div>
  </div>
</template>
<style scoped>
  :root{
    --COLOR-ONE:#243B67;
    --COLOR-TWO:#6E5DCF;
    --COLOR-THREE:#C27DFC;
    --COLOR-FOUR:#EAEBED;
  }
  .saveChangesButton {
    background-color: #6E5DCF;
  }
  .saveChangesButton:hover {
    background-color: #243B67;
    color: white;
    font-weight: bolder;
  }
</style>


<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    Title: String
  }
})
export default class Settings extends Vue {
  Title!: string
}
</script>