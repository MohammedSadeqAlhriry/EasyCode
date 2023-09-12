<template>
  <div class="container-fluid" v-if="userInfo">
    <div class="row flex-nowrap">
      <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark shadow-lg">
        <div
          class="align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100"
        >
          <router-link
            to="/user"
            class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
          >
            <div
              @click="activatedItemContentName = 'UserDetails'"
              class="text-center text-primary w-100"
            >
              <i class="fa-solid fa-user fs-1"></i><br />
              <span
                class="text-secondary text-nowrap bd-highlight"
                style="font-size: 14px"
              >
                <strong>{{
                  userInfo.fullName
                }}</strong> </span
              ><br />
              <span
                class="lead text-secondary text-decoration-underline"
                style="font-size: 14px"
              >
                @{{ userInfo.username }}
              </span>
            </div>
          </router-link>
          <hr />
          <ul
            class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
            id="menu"
          >
            <li
              v-for="(item, index) in getSidebarItems()"
              :key="index"
              class="nav-item"
            >
              <button
                @click="
                  changeTheShowBasedOnThisSidebarContentValue(item.content)
                "
                class="nav-link align-middle px-0"
              >
                <i :class="item.icon"></i>
                <span
                  class="ms-1 d-none d-sm-inline text-secondary"
                  style="font-size: 14px"
                >
                  {{ item.text }}
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div class="col py-3" style="overflow-y: auto; max-height: 720px">
        <!--Getting user's Details-->
        <UserDetails
          :UserInfo="userInfo"
          v-if="activatedItemContentName === 'UserDetails'"
        />
        <!-- Getting Current Course Stages -->
        <div
          class="row"
          v-else-if="activatedItemContentName === 'CurrentActiveCourseStages'"
        >
          <CourseStage v-for="(stage,index) in currentCourse.stages" :key="index"
              :stageId="(index+1)"
              :stageTitle="stage.title"
              :isOpen="stage.id <= currentStage.id"
              style="cursor: pointer;"
              @click="goToStagesLessons(stage)"
            /> 
        </div>
        <!-- Getting User's Subscriped Courses -->
        <CoursesGallery
          :Courses="myCourses"
          :Title="activatedItemContentName"
          v-else-if="activatedItemContentName === 'SubscripedCourses'"
        />
        <!--Getting User's Projects-->
        <ProjectsGallery
          :Projects="myProjects"
          :Title="activatedItemContentName"
          v-else-if="activatedItemContentName === 'Projects'"
        />
        <!-- Getting User's Completed Courses -->
        <CoursesGallery
          :Courses="myCompletedCourses"
          :Title="activatedItemContentName"
          v-if="activatedItemContentName === 'CompletedCourses'"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Swal from "sweetalert2";

import ProjectsGallery from "@/components/Project/ProjectsGallery.vue";
import CoursesGallery from "@/components/Course/CoursesGallery.vue";
import CourseStage from "@/components/Course/CourseStage.vue";
import UserDetails from "@/components/User/UserDetails.vue";
import axios from "axios";

@Options({
  components: {
    UserDetails,
    CourseStage,
    CoursesGallery,
    ProjectsGallery,
  },
  data() {
    return {
      userInfo: null,
      activatedItemContentName: "UserDetails",
      sidebarItems: [
        {
          text: "Personal Details",
          icon: "fa-solid fa-circle-info",
          content: "UserDetails",
        },
        {
          text: "Active Course stages",
          icon: "fa fa-certificate",
          content: "CurrentActiveCourseStages",
        },
        {
          text: "Subscriped Courses",
          icon: "fa-solid fa-video",
          content: "SubscripedCourses",
        },
        {
          text: "Completed Projects",
          icon: "fa-solid fa-diagram-project",
          content: "Projects",
        },
        {
          text: "Completed Courses",
          icon: "fa-solid fa-video",
          content: "CompletedCourses",
        },
        { text: "Settings", icon: "fa-solid fa-gear", content: "Settings" },
      ],
      currentStage: null,
      currentCourse: null,
      myCourses: [],
      myCompletedCourses: [],
      myProjects: [],
    };
  },
  methods: {
    async getMyProjects() {
      try {
        const response = await axios.get(`http://localhost:3000/projects/by-student-id/${this.userInfo.id}`);
        return response.data;
      } catch (error) {
        console.log(error);
      }
      return [];
    },
    async getMyCompletedCourses() {
      const courses = new Array();
      try {
        const response = await axios.get(`http://localhost:3000/subscriptions/by-user/${this.userInfo.id}`);
        response.data.forEach((subs: any) => { 
          if (subs.isDone) {
            courses.push(subs.course);
          } 
        });
      } catch (error) {
        console.log(error);
      }
      return courses; 
    },
    async getMyCourses() {
      const courses = new Array();
      try {
        const response = await axios.get(`http://localhost:3000/subscriptions/by-user/${this.userInfo.id}`);
        response.data.forEach((subs: any) => { courses.push(subs.course); });
      } catch (error) {
        console.log(error);
      }
      return courses;
    },
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
    async getCurrentCourse() {
      try {
        const response = await axios.get(`http://localhost:3000/courses/${this.userInfo.currentCourseId}`);
        this.currentCourse = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getCurrentStage() {
      try {
        const response = await axios.get(`http://localhost:3000/subscriptions/by-user/${this.userInfo.id}/by-course/${this.userInfo.currentCourseId}`);
        response.data.stage ? this.currentStage = response.data.stage : '';
      } catch (error) {
        console.log(error);
      }
    },
    getSidebarItems() {
      console.log(this.userInfo);
      if (this.userInfo.id != this.$store.state.user.id) {
        return this.sidebarItems.filter((item: any) => {
        switch (item.content) {
          case 'CurrentActiveCourseStages':
            return false;
            break;
          case 'SubscripedCourses':
            return false;
            break;
          case 'Settings':
            return false;
            break;

          default:
            return true;
            break;
        }
      });
      } else {
        return this.sidebarItems;
      }
    },
    goToEditUserPage() {
      this.$store.state.userInEditUserPage = this.$store.state.user;
      this.$router.push("/edituser");
    },
    getUserFromStoredState() {
      if (!this.$store.state.user) {
        this.$router.push("/login");
      }else{
        const currentUser = this.$store.state.userInUserDetailsPage;
        if (currentUser) {
          this.userInfo = currentUser;
        } else {
          this.userInfo = this.$store.state.user;
        }
      }
      //console.log(this.userInfo);
    },
    getSidebarItemByContent(content: string) {
      const result = this.sidebarItems.filter(
        (sidebarItem: { content: string }): any => {
          const searchTermLC = content.toLowerCase();
          return sidebarItem.content.toLowerCase() == searchTermLC;
        }
      )[0];
      if (result.content == 'Settings') {
        if (this.$store.state.user.id == this.userInfo.id){
          this.goToEditUserPage();
          return this.sidebarItems[0];
        }else{
          Swal.fire({
            icon: "error",
            title: "UnAuthrized",
            text: "you are not allowed to edit this profile info."
          });
          return this.sidebarItems[0];
        }
      }
      return result;
    },
    changeTheShowBasedOnThisSidebarContentValue(content: string) {
      this.activatedItemContentName =
        this.getSidebarItemByContent(content).content;
    },
  },
  async created() {
    await this.getUserFromStoredState();
    await this.getCurrentCourse();
    await this.getCurrentStage();
    this.myCourses = await this.getMyCourses();
    this.myProjects = await this.getMyProjects();
    this.myCompletedCourses = await this.getMyCompletedCourses();
  }
})
export default class UserDetailsView extends Vue {
  [x: string]: any;
}
</script>
