<template>
  <div class="card mb-1 col-lg-4 col-sm-5 shadow-lg p-0">
    <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
      <img v-if="ImagePath" :src="`http://localhost:3000${ImagePath}`" class="img-fluid" alt="Project Image">
      <img v-else src="https://mdbootstrap.com/img/new/standard/nature/111.jpg" class="img-fluid" alt="Project Image">
    </div>
    <div class="card-body">
      <h5 class="card-title">{{ Title }}</h5>
      <p class="card-text">{{ Description.substring(0,50) }}</p>
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item" @click="likeThisProject">
        <i class="fas fa-thumbs-up"></i>
        Likes: {{ numberOfLikes }}
        <button class="btn btn-outline-primary btn-sm float-end"><i :class="`fas fa-thumbs-${liked ? 'up' : 'down'}`"></i> Like</button>
      </li>
    </ul>
    <div class="card-footer">
      <a @click="goToProjectDetails" class="btn btn-primary"><i class="fas fa-info-circle"></i> Details</a>
    </div>
  </div>
</template>
<script lang="ts">
import axios from 'axios';
import Swal from 'sweetalert2';
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    Id: Number,
    Title: String,
    ImagePath: String,
    Description: String,
    Type: String,
    LikesNo: Number,
  },
  mounted() {
  },
  data() {
    return {
      numberOfLikes: this.LikesNo,
      liked: true
    }
  },
  methods: {
    async likeThisProject() {
      try {
        const response = await axios.get('http://localhost:3000/Projects/'+this.Id);
        const Project = await response.data;
        const user = await this.$store.state.user;
        if (Project) {
          const likeResponse = await axios.post('http://localhost:3000/likes/Project',{
            user: user,
            Project: Project
          });
          likeResponse.data.like.Project ? this.liked = false : this.liked = true;
          likeResponse.data.like.Project ? this.numberOfLikes++ : this.numberOfLikes--;
        }
      } catch (error) {
        Swal.fire("oOps!", "Network Error, refresh and try like it again.", "error");
      }
    },
    async goToProjectDetails() {
      try {
        const response = await axios.get('http://localhost:3000/Projects/'+this.Id);
        const Project = response.data;
        if (Project) {
          this.$store.state.ProjectInProjectDatailsPage = await Project;
          this.$router.push('/Project');
        }
      } catch (error) {
        Swal.fire("oOps!", "Network Error, refresh and try again.", "error");
      }
    }
  }
})
export default class ProjectsGallery extends Vue {
  Id!: Number;
  Title!: String;
  ImagePath!: String;
  Description!: String;
  Type!: String;
  LikesNo!: Number;
  likeThisProject: ((payload: MouseEvent) => void) | undefined;
  goToProjectDetails: ((payload: MouseEvent) => void) | undefined;
  numberOfLikes: any;
liked: any;
}
</script>