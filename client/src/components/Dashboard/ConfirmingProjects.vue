<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-3">
    <div class="container-fluid">
      <form class="d-flex me-auto" @submit.prevent="onSubmit">
        <input v-model="searchTerm" class="form-control me-2" type="search" placeholder="Search" aria-label="Search" id="search-bar">
        <button class="btn btn-outline-success" type="submit"><i class="fas fa-search"></i></button>
      </form>
    </div>
  </nav>
  <div class="container">
    <div class="row">
      <div class="col-12" style="
                                max-height: 415px;
                                overflow-y: scroll;
                                margin: 0;">
        <div v-for="(project,index) in searchResults" :key="index" class="user-card p-5">
          <div class="float-start" @click="goToUserDateilsPage(project.student)">
            <img
              :src="`http://localhost:3000${project.imagePath}`" 
              alt="User Avatar">
            <span class="fw-bold">{{ project.title }}</span>
            <span class="text-muted">@{{project.student.username}}</span>
          </div>
          <div class="btn-group float-end">
            <a
              :href="`http://localhost:3000${project.askedProject.documentsPath}`"
              target="_blank"
              class="btn btn-primary"
              ><i class="fa fa-eye" aria-hidden="true"></i> Asked Project
            </a>
            <a :href="`http://localhost:3000${project.documentPath}`" class="btn btn-outline-primary" title="View Project Document (.rar or .zip)">
              <i class="fas fa-cloud-download"></i>
              Submitted Project
            </a>
            <button @click="confirm(project)" class="btn btn-outline-success" title="Confirme This Project">
              <i class="fas fa-check-circle"></i>
              Approve Project
            </button>
            <button @click="refuse(project)" class="btn btn-outline-danger" title="Refuse This Project">
              <i class="fa fa-recycle"></i>
              Refuse
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import axios from "axios";
import Swal from "sweetalert2";

@Options({
    methods:{
      refuse(project: any) {
        Swal.fire({
          title: "Enter your refusing reason comment as supervisor.",
          input: "text",
          inputPlaceholder: "Enter your refusing comment here...",
          inputValue: "",
          showCancelButton: true,
          confirmButtonText: "Send",
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.isConfirmed) {
            const reviewerComment = result.value;
            const projectReviewd = {
              id: project.id,
              reviewerComment: reviewerComment,
              accepted: false
            };
            this.updateProject(projectReviewd);
            
            Swal.fire({
              title: "Done!",
              text: `The student project has been refused with supervisor comment.`,
              icon: "success",
              timer: 1700,
              showConfirmButton: false,
            });
          }
        });
      },
      confirm(project: any) {
        Swal.fire({
          title: "Enter your confirmation comment as a supervisor.",
          input: "text",
          inputPlaceholder: "Enter your confirmation comment here...",
          inputValue: "",
          showCancelButton: true,
          confirmButtonText: "Send",
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.isConfirmed) {
            const reviewerComment = result.value;
            const projectReviewd = {
              id: project.id,
              reviewerComment: reviewerComment,
              accepted: true
            };
            this.updateProject(projectReviewd);
            Swal.fire({
              title: "Student's project Confirmed!",
              text: `The student project is now accepted.`,
              icon: "success",
              timer: 1700,
              showConfirmButton: false,
            });
          }
        });
      },
      async updateProject(projectReviewd: any) {
        try {
          await axios.put(
            `http://localhost:3000/projects/${projectReviewd.id}`,
            projectReviewd,{ headers: {
              'Authorization': 'Bearer ' + this.$store.state.userTokens,
              'Content-Type': 'application/json'
            }}
          );
          await this.getUnReviewdProjects();
        } catch (error:any) {
          Swal.fire({
            title: "oOPs...!",
            text: error.response.data.message,
            icon: "error"
          });
        }
      },
      async getUnReviewdProjects() {
        try {
          const response = await axios.get('http://localhost:3000/projects/allProjectsWithStatus/unaccepted',{
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.userTokens,
              'Content-Type': 'application/json'
            }
          });
          this.unacceptedProjects = response.data;
          //console.log(this.unacceptedProjects);
        } catch (error) {
          console.log(error);
        }
      },
      goToUserDateilsPage(user: any) {
        this.$store.state.userInUserDetailsPage = user;
        this.$router.push("/user");
      },
    },
    async created() {
      await this.getUnReviewdProjects();
    },
    computed:{
      searchResults() {
        return this.unacceptedProjects.filter((project: any): any => {
          const searchTermLC = this.searchTerm.toLowerCase();
          return ((project.title.toLowerCase().includes(searchTermLC) || project.student.fullName.toLowerCase().includes(searchTermLC)
          || project.student.username.toLowerCase().includes(searchTermLC)) && (project.isAcceptedAndDone == false && project.isSubmitted == true))
        });
      }
    },
    data(){
        return {
          searchTerm: '',
          unacceptedProjects: []
        }
    },
})
export default class ConfirmingProjects extends Vue {
[x: string]: any;
}
</script>

<style scoped>
    .user-card {
      margin-bottom: 20px;
    }
    .user-card img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .form-check-input[type="checkbox"] {
        width: 39px;
        height: 39px;
        
    }
    .user-card .btn {
      margin-right: 5px;
    }
    .user-card:hover {
        background-color: #F5F5F5;
        cursor: pointer;
    }
</style>