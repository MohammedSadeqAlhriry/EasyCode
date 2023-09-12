<template>
  <div class="container-fluid">
    <div class="row flex-nowrap">
      <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
        <div class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
          <a style="color: rgb(81, 113, 141); width: 100%; font-size: 24px;">
            <i class="fa-solid fa-diagram-project"></i>
            <strong style="margin: 0 20px;">projects</strong>
          </a>
          <hr style="color: aliceblue; background-color: aliceblue; width: 100%;"/>
          <p> {{ currentCourse }} </p>
          <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
            <li class="nav-item" v-for="(project, index) in getUniqueprojectsByCourse(projects)" :key="index">
              <a href="#" class="nav-link align-middle px-0"
                @click="changeCurrentCourseValue(project.course.name)">
                <i class="fa-solid fa-video"></i> <span class="ms-1 d-none d-sm-inline">{{ project.course.name
                }}</span>
              </a>
            </li>
          </ul>
          <hr>
        </div>

      </div>

      <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div class="container-fluid">
          <input v-model="searchText" class="mt-2 mb-2 w-50 p-2" placeholder="Search...">
        </div>
        <div class="row">
          <Card v-for="project in filteringprojects" 
            :Id="project.id" 
            :Title="project.title"
            :ImagePath="project.imagePath"
            :Description="`@${project.student.username} & ${project.supervisor.username}\n${project.supervisorComment}`" 
            :Type="project.course.name" 
            :LikesNo="0" />
        </div>
      </main>
    </div>
  </div>
</template>
  
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Card from '@/components/Project/Card.vue'
import axios from 'axios';

@Options({
  components: {
    Card
  },
  data() {
    return {
      displayedCategories: [],
      currentCourse: "",
      searchText: "",
      projects: []
    }
  },
  methods: {
    async getAllProjects() {
      try {
        const response = await axios.get('http://localhost:3000/projects');
        console.log(response.data);
        this.projects = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    changeCurrentCourseValue(value: string) { this.currentCourse = value; },
    chooseByCourse() {
      return this.projects.filter((project: any) => {
        const searchCatoTerm = this.currentCourse.toLowerCase();
        return (project.course.name.toLowerCase().includes(searchCatoTerm));
      });
    },
    getUniqueprojectsByCourse(projects: any[]): any[] {
      const categoriesSet = new Set<string>();
      return projects.filter((project) => {
        if (!categoriesSet.has(project.course.name)) {
          categoriesSet.add(project.course.name);
          return true;
        }
        return false;
      });
    }

  },
  computed: {
    filteringprojects() {
      return this.chooseByCourse().filter((project: any) => {
        const searchTerm = this.searchText.toLowerCase();
        return (project.title.toLowerCase().includes(searchTerm) 
        || project.supervisorComment.toLowerCase().includes(searchTerm)
        || project.student.username.toLowerCase().includes(searchTerm)
        || project.course.name.toLowerCase().includes(searchTerm)
        || project.supervisor.username.toLowerCase().includes(searchTerm));
      });
    }
  },
  async created() {
    await this.getAllProjects();
  },
})
export default class ProjectsVeiw extends Vue {
  [x: string]: any;
}
</script>

  