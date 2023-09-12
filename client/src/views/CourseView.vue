<template>
    <div class="container-fluid" v-if="course">
      <div class="row flex-nowrap">
          <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark shadow-lg ">
            <div class="align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
              <router-link to="/user" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                  <span class="fs-4 m-1"> {{ course.name }} </span>
              </router-link>
              <hr>
              <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                  <li v-for="(item, index) in SideBarData" :key="index" class="nav-item" v-if="user">
                      <button v-if="(subscriped && !(user.userType == 'student' && item.itemName == 'Chatting Room')) || user.userType == 'admin'"  @click="ShowOption(index)" class="nav-link align-middle px-0">
                        <i class="fa-solid" :class="item.itemIconClass"></i> <span class="ms-1 d-none d-sm-inline text-secondary">{{ item.itemName }}</span>
                      </button>
                  </li>
                  <li class="nav-item w-100">{{ (!subscriped && user.userType != 'admin') ? 'subscripe right now to see more things about this course.' : '' }}</li>
                  <li class="nav-item w-100">
                    <button v-if="user ? (user.userType != 'admin' ? true : false) : true" @click="subscribe()" class="btn btn-primary w-100 mt-2">
                      <i class="fa-solid fa-square-check"></i>
                      <strong>{{ subscriped ? ' unsubscripe' : ' subscripe' }}</strong>
                    </button>
                  </li>
              </ul>
            </div>
        </div>
        <!--Content-->
        <div class="col m-0 " style="overflow-y: auto;">
          <!--Getting Course Details-->
          <CourseDetails :course="course" v-if="currentOption === listOptions[0]" />
          <!--Getting Course ChatRoom-->
          <ChatRoom :currentCourse="course" v-if="currentOption === listOptions[4]" />
          <!--Getting Course Stages-->
          <div v-if="currentOption === listOptions[1]" class="row">
            <CourseStage v-for="(stage,index) in course.stages" :key="index"
              :stageId="(index+1)"
              :stageTitle="stage.title"
              :isOpen="stage.id <= currentStage.id"
              style="cursor: pointer;"
              @click="goToStagesLessons(stage)"
            /> 
          </div>

          
          <!--Getting Students-->
          <div v-if="currentOption === listOptions[2]" class="row m-0" style="            
          overflow-y: scroll;
          ">
            <div class="container-fluid bg-light m-0 p-1">
              <form class="d-flex w-50 m-1" @submit.prevent="onSubmit">
                <input v-model="searchTerm" class="form-control me-2" type="search" placeholder="Search" aria-label="Search" id="search-bar">
                <button class="btn btn-outline-success" type="submit"><i class="fas fa-search"></i></button>
              </form>
            </div>
          
            <div v-for="(studentSub,index) in searchResults" :key="index" class="user-card col-12 p-3">
              <img :src="`http://localhost:3000/${studentSub.user.picturePath}`"  alt="User Avatar" style="border-radius: 50%; widows: 50px; height: 50px;">
              <span class="fw-bold m-4">{{ studentSub.user.fullName }}</span>
              <span class="text-muted m-3">@{{studentSub.user.username}}</span>
              <div class="btn-group float-end">
                <button class="btn btn-outline-primary" title="View Details"><i class="fas fa-info-circle"></i></button>
              </div>
            </div>
          </div>
          <!--Getting Supervisers-->
          <div v-if="currentOption === listOptions[3]" class="row m-0" style="            
          overflow-y: scroll;
          ">
            <div class="container-fluid bg-light m-0 p-1">
              <form class="d-flex w-50 m-1" @submit.prevent="onSubmit">
                <input v-model="searchTerm" class="form-control me-2" type="search" placeholder="Search" aria-label="Search" id="search-bar">
                <button class="btn btn-outline-success" type="submit"><i class="fas fa-search"></i></button>
              </form>
            </div>
            <div v-for="(supervisorSub,index) in searchResultsSuperviser" :key="index" class="user-card col-12  p-3">
              <img :src="`http://localhost:3000/${supervisorSub.user.picturePath}`"  alt="User Avatar" style="border-radius: 50%; widows: 50px; height: 50px;">
              <span class="fw-bold m-4 ">{{ supervisorSub.user.fullName }}</span>
              <span class="text-muted m-3 ">{{supervisorSub.user.username}}</span>
              <div class="btn-group float-end">
                <button class="btn btn-outline-primary" title="View Details"><i class="fas fa-info-circle"></i></button>
              </div>
            </div>
          </div> 
        </div>
      </div>
    </div>
  </template>
  
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import CourseStage from '@/components/Course/CourseStage.vue';
import CourseDetails from '@/components/Course/CourseDetails.vue'
import ChatRoom from '@/components/Course/ChatRoom.vue';
import Swal from 'sweetalert2';
import axios from 'axios';
  
  @Options({
    components: {
      CourseStage,
      CourseDetails,
      ChatRoom,
    },
    data () {
      return {
        currentOption: "CourseDetails",
        listOptions: ['CourseDetails','Stages','Students','Supervisors','ChattingRoom'],
        SideBarData: [
            {itemName: 'Details', itemIconClass: 'fa-circle-info'},
            {itemName: 'Stages', itemIconClass: 'fa-circle-play'},
            {itemName: 'Students', itemIconClass: 'fa-users'},
            {itemName: 'Supervisors', itemIconClass: 'fa-person-chalkboard'},
            {itemName: 'Chatting Room', itemIconClass: 'fa-comments'},
        ],
        searchTerm: "",
        course: null,
        subscriped: false,
        user: null,
        currentStage: null,
        students: [],
        Supervisers: [],
      }
    },
    methods: {
      async goToStagesLessons(stage: any) {
        if (stage.id > this.currentStage.id) {
          Swal.fire({
            icon: "warning",
            title: "NOT ALLOWED!",
            text: "You can not open this stage until you finish it's previous one.",
          });
          return;
        }
        try {
          const respons = await axios.get(`http://localhost:3000/stages/${stage.id}`);
          this.$store.state.stageInLessonPage = await respons.data;
          //console.log(this.$store.state.stageInLessonPage);
          this.$router.push('/stage');
        } catch (error) {}
      },
      async subscribe() {
        if (!this.user) {
          Swal.fire({
            icon: "info",
            title: "Not Allowed!",
            text: "In order to subscribe in this course you need first to be logged in.",
          });
          this.$router.push('/login');
          return;
        }
        if (this.course.stages.length <= 0) {
          Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "This course dose not have any stages yet so you can not subscripe right now.",
          });
          return;
        }
        if (this.user.userType == 'supervisor') {
          if (!this.user.supervisorConfirmation[0].isConfirmed) {
            Swal.fire({
                icon: "error",
                title: "Oops!",
                text: "Your certification documents as a supervisor are not confirmed yet",
            });
            this.$router.push('/confirmation');
            return;
          }
        } 
        try {
          const response = await axios.post(`http://localhost:3000/subscriptions`,{ courseId: this.course.id},{
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.userTokens,
              'Content-Type': 'application/json'
            }
          });
          if (response.data) {
            this.subscriped = true;
            Swal.fire("WELL DONE", `You have subscriped to ${this.course.name} course.`, "success");
          } else {
            Swal.fire("LEAVE OUT", `You are now out of ${this.course.name} course, you may loss some of this course prevliages.`, "warning");
            this.currentOption = "CourseDetails";
            this.subscriped = false;
          }
          try {
            const response = await axios.get(`http://localhost:3000/subscriptions/by-user/${this.user.id}/by-course/${this.course.id}`);
            response.data.stage ? this.currentStage = response.data.stage : '';
          } catch (error) {
            console.log(error);
          }
        } catch (error) {
          console.log(error);
          Swal.fire("oOps!", "You Can not you have now some relations with this subscription.", "error");
        }
      },
      async getCourseData() {
        try {
          this.user = await this.$store.state.user;
          this.course = await this.$store.state.courseInCourseDatailsPage;
          this.currentOption = this.$store.state.currentCourseDisplayedContent;
          if (!this.course) {
            this.$router.push('/courses');
          }
          const response = await axios.get(`http://localhost:3000/subscriptions/by-course/${this.course.id}`);
          this.Supervisers = response.data.filter((sub: any) => {
            return (sub.user.userType == 'supervisor')
          });
          this.students = response.data.filter((sub: any) => {
            return (sub.user.userType == 'student')
          });
        } catch (error) {
          console.log(error);
        }
      },
      ShowOption(optionNumber: number){
        this.currentOption = this.listOptions[optionNumber];
        console.log(this.currentOption);
      }
    },
    computed:{
      searchResults() {
        return this.students.filter((student: any) => {
          const searchTerm = this.searchTerm.toLowerCase();
          return (student.user.fullName.toLowerCase().includes(searchTerm) || student.user.username.toLowerCase().includes(searchTerm));
        });
      },
      searchResultsSuperviser() {
        return this.Supervisers.filter((sub: any) => {
            const searchTerm = this.searchTerm.toLowerCase();
            return (sub.user.fullName.toLowerCase().includes(searchTerm) || sub.user.username.toLowerCase().includes(searchTerm));
        });
      }
    },
    async created() {
      await this.getCourseData();
      if (this.user && this.course) {
        if (this.$store.state.currentStage) {
          this.currentOption = this.listOptions[1];
        }
        try {
          const response = await axios.get(`http://localhost:3000/subscriptions/by-user/${this.user.id}/by-course/${this.course.id}`);
          await response.data.id ? this.subscriped = true : this.subscriped = false;
          response.data.stage ? this.currentStage = response.data.stage : '';
        } catch (error) {
          console.log(error);
        }
      }else{
        Swal.fire({
          icon: 'warning',
          title: 'No Account',
          text: 'You need to login in or sign up to access more things.'
        });
        this.$router.push('/login');
      }
    },
  })
  export default class CourseView extends Vue {
    [x: string]: any;
  }
  </script>
  