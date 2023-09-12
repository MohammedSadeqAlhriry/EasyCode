<template>
<div class="card mb-1 col-lg-4 col-sm-5 shadow-lg">
  <img src="https://mdbootstrap.com/img/new/standard/nature/111.jpg" class="card-img-top" alt="Course Image">
  <div class="card-body">
    <h5 class="card-title">{{ Title }}</h5>
    <p class="card-text">{{ Description.substring(0,50) }}</p>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item" @click="likeThisCourse">
      <i class="fas fa-thumbs-up"></i>
      Likes: {{ numberOfLikes }}
      <button class="btn btn-outline-primary btn-sm float-end"><i :class="`fas fa-thumbs-${liked ? 'up' : 'down'}`"></i> Like</button>
    </li>
  </ul>
  <div class="card-footer">
    <a @click="goToCourseDetails" class="btn btn-primary"><i class="fas fa-info-circle"></i> Details</a>
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
    async likeThisCourse() {
      try {
        const response = await axios.get('http://localhost:3000/courses/'+this.Id);
        const course = await response.data;
        const user = await this.$store.state.user;
        if (course) {
          const likeResponse = await axios.post('http://localhost:3000/likes/course',{
            user: user,
            course: course
          });
          likeResponse.data.like.course ? this.liked = false : this.liked = true;
          likeResponse.data.like.course ? this.numberOfLikes++ : this.numberOfLikes--;
        }
      } catch (error) {
        Swal.fire("oOps!", "Network Error, refresh and try like it again.", "error");
      }
    },
    async goToCourseDetails() {
      try {
        const response = await axios.get('http://localhost:3000/courses/'+this.Id);
        const course = response.data;
        if (course) {
          this.$store.state.courseInCourseDatailsPage = await course;
          this.$router.push('/course');
        }
      } catch (error) {
        Swal.fire("oOps!", "Network Error, refresh and try again.", "error");
      }
    }
  }
})
export default class CoursesGallery extends Vue {
  Id!: Number;
  Title!: String;
  Description!: String;
  Type!: String;
  LikesNo!: Number;
  likeThisCourse: ((payload: MouseEvent) => void) | undefined;
  goToCourseDetails: ((payload: MouseEvent) => void) | undefined;
  numberOfLikes: any;
liked: any;
}
</script>