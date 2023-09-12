<template>
  <div v-if="courses" class="container-fluid">
    <div class="row flex-nowrap">
      <div class="col-auto col-md-2 col-xl-2 px-sm-2 px-0 bg-dark">
        <div
          class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100"
        >
          <a
            href="/"
            class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none"
          >
            <span class="fs-5 d-none d-sm-inline"
              ><strong>categories</strong></span
            >
          </a>
          <ul
            class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
            id="menu"
          >
            <li class="nav-item">
              <a
                class="nav-link align-middle px-0 w-100"
                style="cursor: grab"
                @click="changeCurrentCategoryValue(null)"
              >
                <i class="fa fa-folder-open"></i>
                <span class="ms-1 d-none d-sm-inline">All categories</span>
              </a>
            </li>
            <li
              class="nav-item"
              v-for="(course, index) in getUniqueCoursesByCategory()"
              :key="index"
            >
              <a
                style="cursor: grab"
                class="nav-link align-middle px-0 w-100"
                @click="changeCurrentCategoryValue(course.category)"
              >
                <i class="fa fa-folder-open"></i>
                <span class="ms-1 d-none d-sm-inline">{{
                  course.category.name
                }}</span>
              </a>
            </li>
          </ul>
          <hr />
        </div>
      </div>
      <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <nav class="navbar navbar-expand-lg navbar-light bg-light mb-3">
          <div class="container-fluid">
            <form class="d-flex me-auto" @submit.prevent="onSubmit">
              <input
                v-model="searchText"
                class="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                id="search-bar"
              />
              <button class="btn btn-outline-success" type="submit">
                <i class="fas fa-search"></i>
              </button>
            </form>
          </div>
        </nav>
        <div class="row">
          <Card
            v-for="course in filteringCourses"
            :Id="course.id"
            :Title="course.name"
            :ImagePath="course.imagePath"
            :Description="course.description"
            :Type="course.category.name"
            :LikesNo="course.likes.length"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Card from "@/components/Course/Card.vue";
import Swal from "sweetalert2";
import axios from "axios";

@Options({
  components: {
    Card,
  },
  data() {
    return {
      displayedCategories: [],
      currentCategory: null,
      searchText: "",
      courses: [],
    };
  },
  methods: {
    
    async getAllCourses() {
      try {
        const response = await axios.get("http://localhost:3000/courses");
        this.courses = response.data;
      } catch (error) {
        Swal.fire("oOps!", "Network Error.", "error");
      }
    },
    changeCurrentCategoryValue(value: any) {
      this.currentCategory = value;
    },
    chooseByCategory() {
      return this.courses.filter((course: { category: any }): any => {
        const currentCategoryId = this.currentCategory
          ? this.currentCategory.id
          : -1;
        return (
          course.category.id == currentCategoryId ||
          this.currentCategory == null
        );
      });
    },
    getUniqueCoursesByCategory(): any[] {
      const categoriesSet = new Set<string>();
      return this.courses.filter((course: any) => {
        if (!categoriesSet.has(course.category.name)) {
          categoriesSet.add(course.category.name);
          return true;
        }
        return false;
      });
    },
  },
  computed: {
    filteringCourses() {
      return this.chooseByCategory().filter(
        (course: any): any => {
          const searchTerm = this.searchText.toLowerCase();
          return ((
            course.name.toLowerCase().includes(searchTerm) ||
            course.description.toLowerCase().includes(searchTerm))
            && course.isPublished
          );
        }
      );
    },
  },
  created() {
    this.getAllCourses();
  },
})
export default class CoursesView extends Vue {
  [x: string]: any;
}
</script>
