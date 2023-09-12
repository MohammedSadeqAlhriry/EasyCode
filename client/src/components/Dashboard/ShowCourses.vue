<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-3">
    <div class="container-fluid" v-if="user">
      <form class="d-flex me-auto" @submit.prevent="onSubmit">
        <input v-model="searchTerm" class="form-control me-2" type="search" placeholder="Search" aria-label="Search" id="search-bar">
        <button class="btn btn-outline-success" type="submit"><i class="fas fa-search"></i></button>
      </form>
      <div class="dropdown me-3">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="filter-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
          Filter: {{ filter }}
        </button>
        <ul class="dropdown-menu" aria-labelledby="filter-dropdown">
          <li><a class="dropdown-item btn" @click="changeFilterValue('')">All Course</a></li>
          <li><a class="dropdown-item btn" @click="changeFilterValue('Published')">Published</a></li>
          <li><a class="dropdown-item btn" @click="changeFilterValue('Unpublished')">Unpublished</a></li>
        </ul>
      </div>
      <button v-if="user.userType == 'admin'" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addCourseModal">
        Add New Course 
        <i class="fas fa-plus"></i>
      </button>
    </div>
  </nav>
  <div class="container">
    <div class="row">
      <div class="col-12" style="
                                max-height: 415px;
                                overflow-y: scroll;
                                margin: 0;">
        <div v-for="(course,index) in searchResults" :key="index" class="user-card">
          <img :src="`http://localhost:3000${course.imagePath}`" alt="User Avatar">
          <span class="fw-bold">{{ course.name }}</span>
          <span class="text-muted">@{{course.category.name}}</span>
          <div class="btn-group float-end">
            <button v-if="user.userType == 'admin'" @click="addCourseAdmin(course)" data-bs-toggle="modal" data-bs-target="#addCourseAdmin" class="btn btn-outline-secondary" title="Add Course's Admin"><i class="fa-solid fa-plus"></i></button>
            <button @click="toggleCoursePublished(course.id)" v-if="!course.isPublished" class="btn btn-outline-secondary" title="Publish this course"><i class="fa-solid fa-upload"></i></button>
            <button @click="toggleCoursePublished(course.id)" v-else-if="course.isPublished" class="btn btn-outline-secondary" title="Unpublish this course"><i class="fa-sharp fa-regular fa-circle-stop"></i></button>
            <button @click="viewCourseDetails(course)" class="btn btn-outline-info" title="View Details"><i class="fas fa-info-circle"></i></button>
            <button v-if="user.userType == 'admin'" @click="deleteThisCourse(course)" class="btn btn-outline-danger" title="Delete This Course"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--Adding New User Modal-->
  <AddNewCourse @done="getAllCourses"/>
  <!--Adding Course Admin Modal-->
  <AddCourseAdmin :courseToBeAssignedUserAdminTo="courseToBeAssignedUserAdminTo" />

</template>
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
    .user-card .btn {
      margin-right: 5px;
    }
    .user-card:hover {
        background-color: #F5F5F5;
        cursor: pointer;
    }
</style>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import AddNewCourse from '@/components/Dashboard/AddNewCourse.vue';
import AddCourseAdmin from '@/components/Dashboard/AddCourseAdmin.vue';
import axios from 'axios';
import Swal from 'sweetalert2';

@Options({
    components:{
      AddNewCourse,
      AddCourseAdmin,
    },
    async created() {
      this.user = await this.$store.state.user;
      this.getAllCourses();
    },
    methods:{
      addCourseAdmin(course: any) {
        this.courseToBeAssignedUserAdminTo = course;
      },
      async viewCourseDetails(course: any){
        this.$store.state.courseInCourseDatailsPage = await course;
        this.$router.push('/course');
      },
      deleteThisCourse(course: any) {
        Swal.fire({
          title: "Delete?",
          text: `Are you sure. you went to delete ${ course.name }.`,
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: '#ff0101',
          cancelButtonColor: '#22aa22',
          confirmButtonText: "Yes, Delete",
          cancelButtonText: "No",
        }).then((result) => {
          if (result.isConfirmed) {
            this.deleteCourseById(course.id);
            Swal.fire(
              "Deleted!",
              "Course deleted successfully.",
              "success"
            );
          }
        });
      },
      async toggleCoursePublished(courseId: number) {
        try {
          const response = await axios.post('http://localhost:3000/courses/toggleCoursePublished/'+courseId);
          Swal.fire({
            icon: "success",
            title: `${response.data.isPublished?'Published':'Unpublished'}!`,
            text: `course ${response.data.name} has been ${response.data.isPublished?'published':'unPublished'} successfully.`,
            showConfirmButton: false,
            timer: 2500
          });
          await this.getAllCourses();
        } catch (error) {
          Swal.fire(
            "oOps!",
            "Network Error.",
            "error"
          );
        }
      },
      async deleteCourseById(id: number) {
        try {
          const response = await axios.delete('http://localhost:3000/courses/'+id);
          await this.getAllCourses();
        } catch (error) {
          Swal.fire(
            "oOps!",
            "Network Error.",
            "error"
          );
        }
      },
      async getAllCourses() {
        try {
          if (this.user.userType == 'supervisor') {
            const response = await axios.get(`http://localhost:3000/courses/by-course-admin-id/${this.user.id}`);
            this.courses = response.data;
          } else {
            const response = await axios.get('http://localhost:3000/courses');
            this.courses = response.data;
          }
        } catch (error) {
          Swal.fire(
            "oOps!",
            "Network Error.",
            "error"
          );
        }
      },
      changeFilterValue(value: string){ this.filter = value; },
    },
    computed:{
        searchResults() {
            return this.courses.filter((course: {id: number; name: string; isPublished: boolean; category: string;}): any => {
                const searchTermLC = this.searchTerm.toLowerCase();
                switch(this.filter){
                  case '':
                    return (course.name.toLowerCase().includes(searchTermLC) || course.category.toLowerCase().includes(searchTermLC));
                    break;
                  case 'Published':
                    return (course.name.toLowerCase().includes(searchTermLC) 
                        || course.category.toLowerCase().includes(searchTermLC)) && course.isPublished == true;
                    break;
                  case 'Unpublished':
                    return (course.name.toLowerCase().includes(searchTermLC) 
                        || course.category.toLowerCase().includes(searchTermLC)) && course.isPublished == false;
                    break;
                }   
            });
        }
    },
    data(){
        return {
          user: null,
          searchTerm: '',
          filter: '',
          courses: [],
          courseToBeAssignedUserAdminTo: null
        }
    }
})
export default class ShowCourses extends Vue {
[x: string]: any;
}
</script>