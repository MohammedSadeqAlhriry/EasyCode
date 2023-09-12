<template>
  <div class="main-body">
    <div class="row gutters-sm d-flex justify-content-center">
      <div class="col-md-8">
        <div @click="expindUserImage" class="text-center col-12 m-1">
          <img style="cursor: pointer;"
            :src="`http://localhost:3000${UserInfo.picturePath}`"
            alt=""
            class="bd-placeholder-img rounded-circle bg-info"
            width="150"
            height="150"
            role="img"
          />
        </div>
        <div class="card mb-3">
          <div class="card-body">
            <div v-for="(user,index) in userProperties" :key="index">
                <div class="row">
                    <div class="col-sm-3">
                        <h6 class="mb-0">{{ user.propertyLabel }}</h6>
                    </div>
                    <div class="col-sm-9 text-secondary">
                        {{ user.propertyValue }}
                    </div>
                </div>
                <hr />
            </div>
            <div v-if="UserInfo.userType == 'supervisor'" class="row">
                <div class="col-sm-3">
                    <h6 class="mb-0">Certifications</h6>
                </div>
                <div class="col-sm-9">
                    <a class="btn btn-info" target="__blank" :href="`http://localhost:3000${UserInfo.supervisorConfirmation[0].certificationsDocsPath}`">
                      Show Certification Documents
                    </a>
                </div>
            </div>
            <hr v-if="UserInfo.userType == 'supervisor'"/>
            <div class="row">
              <div class="col-sm-12">
                Status
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 mb-3">
            <div class="card h-100">
              <div class="card-body">
                <h6 class="d-flex align-items-center mb-3">
                  <i class="material-icons text-info mr-2">assignment </i
                  >Project Status
                </h6>
                <small>Web Design</small>
                <div class="progress mb-3" style="height: 5px">
                  <div
                    class="progress-bar bg-primary"
                    role="progressbar"
                    style="width: 80%"
                    aria-valuenow="80"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <small>Website Markup</small>
                <div class="progress mb-3" style="height: 5px">
                  <div
                    class="progress-bar bg-primary"
                    role="progressbar"
                    style="width: 72%"
                    aria-valuenow="72"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <small>One Page</small>
                <div class="progress mb-3" style="height: 5px">
                  <div
                    class="progress-bar bg-primary"
                    role="progressbar"
                    style="width: 89%"
                    aria-valuenow="89"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <small>Mobile Template</small>
                <div class="progress mb-3" style="height: 5px">
                  <div
                    class="progress-bar bg-primary"
                    role="progressbar"
                    style="width: 55%"
                    aria-valuenow="55"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <small>Backend API</small>
                <div class="progress mb-3" style="height: 5px">
                  <div
                    class="progress-bar bg-primary"
                    role="progressbar"
                    style="width: 66%"
                    aria-valuenow="66"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
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
import Swal from "sweetalert2";

@Options({
  props: {
    UserInfo: null,
  },
  data() {
    return {
      userProperties: []
    }
  },
  created() {
    this.userProperties.push({propertyLabel: 'Full Name', propertyValue: this.UserInfo.fullName});
    this.userProperties.push({propertyLabel: 'User Name', propertyValue: this.UserInfo.username});
    this.userProperties.push({propertyLabel: 'User Email', propertyValue: this.UserInfo.email});
    this.userProperties.push({propertyLabel: 'User Type', propertyValue: this.UserInfo.userType});
    this.userProperties.push({propertyLabel: 'User Address', propertyValue: this.UserInfo.address});
    this.userProperties.push({propertyLabel: 'Birth Date', propertyValue: this.UserInfo.birthDate});
    this.userProperties.push({propertyLabel: 'Short Description', propertyValue: this.UserInfo.userDescription});
  },
  methods: {
    expindUserImage() {
      Swal.fire({
        title: "<strong>User Photo</strong>",
        html:
          "<img src=\"http://localhost:3000"+ this.UserInfo.picturePath + "\" "+
            "class=\"bd-placeholder-img bg-info\""+
            "width=\"100%\" />",
      });
    },
  },
})
export default class UserDetials extends Vue {
  UserInfo: any;
  expindUserImage: ((payload: MouseEvent) => void) | undefined;
  keepRefreshed: any;
  displayUserData: any;
  userProperties: any;
}
</script>
