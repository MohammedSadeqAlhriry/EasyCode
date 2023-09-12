<template>
    <div v-if="stage" class="container my-5">
      <div class="row">
        <div class="col-lg-8">
          <div v-if="currentLessonURL" class="video-container mb-4">
            <iframe width="100%" :src="`https://www.youtube.com/embed/${currentLessonURL}`" frameborder="0" allowfullscreen></iframe>
          </div>
          <div class="row mb-4">
            <span @click="previousLesson" class="btn btn-primary col-lg-2 col-md-2 col-sm-10 m-1">
              <i class="bi bi-caret-left"></i>&leftarrow; 
              Previous
            </span>
            <span @click="nextLesson" class="btn btn-primary col-lg-2 col-md-2 col-sm-10 m-1">
              <i class="bi bi-caret-right"></i>
              Next &rightarrow;
            </span>
            <a :href="`https://www.yout.com/watch?v=${currentLessonURL}`" class="btn btn-info col-lg-3 col-md-3 col-sm-10 m-1">
              <i class="bi bi-caret-right"></i>
              <strong>&downarrow; Download</strong>
            </a>
            <span @click="goToExamOrAskedProjectPage" v-if="stage.exams.length > 0 || stage.stageAskedProjects.length > 0" class="btn btn-info col-lg-4 col-md-4 col-sm-10 m-1">
              <strong>
                <i class="fas fa-clipboard-list"></i> 
                Start The Examination
              </strong>
            </span>
          </div>
          <h1 class="mt-4">Instructions</h1>
          <hr>
          <p class="lead">
            This stage and it's lessons are about {{ stage.title }} in {{ stage.course.name }}.
            Learn the concepts from this stage by watching the videos. 
            You can either watch them sequentially or use the navigation bar to control the display of the lesson content. 
            Ensure that you have understood the concepts covered before moving on to the stage exam or project, 
            and only proceed to the next stage once you are ready.
          </p>
          <hr>
        </div>
        <div class="col-lg-4">
          <h3>Stage Lessons URLs</h3>
          <div class="list-group">
            <a v-for="(lesson,index) in stage.lessons" 
              :key="index" 
              :href="`https://www.youtube.com/watch?v=${lesson.url}`" 
              class="list-group-item list-group-item-action">{{ `${(index+1)} - https://www.youtube.com/watch?v=${lesson.url}` }}</a>
          </div>
          <hr>
        </div>
      </div>
    </div>
</template>
<script lang="ts">
  import { Options, Vue } from 'vue-class-component';  
  @Options({
    async created() {
      await this.getStagesLessons();
    },
    methods: {
      async goToExamOrAskedProjectPage() {
        if (this.stage.hasProject) {
          this.$store.state.stageInShowAskedProjectPage = await this.stage;
          this.$router.push('/submit-project')
        }else{
          this.$store.state.stageInSubmitStagesExamPage = await this.stage;
          this.$router.push('/submit-exam')
        }
      },
      async getStagesLessons() {
        this.stage = await this.$store.state.stageInLessonPage;
        !this.stage ? this.$router.push('/') : this.currentLessonURL = this.stage.lessons[0].url;
      },
      nextLesson() {
        if (this.stage.lessons.length - 1 > this.lessonIndex) {
          this.lessonIndex++;
          this.currentLessonURL = this.stage.lessons[this.lessonIndex].url;
        }else{
          // getting exam or project
        }
      },
      previousLesson() {
        if (this.lessonIndex > 0) {
          this.lessonIndex--;
          this.currentLessonURL = this.stage.lesson[this.lessonIndex].url;
        } else {
          this.lessonIndex = 0;
        }
      }
    },
    data () {
      return {
        stage: null,
        currentLessonURL: '',
        lessonIndex: 0
      }
    },
  })
  export default class LessonView extends Vue {
    [x: string]: any;
  }
</script>
<style>
    .video-container {
      position: relative;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;
    }
    .video-container iframe,
    .video-container video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .like-btn {
      font-size: 1.2rem;
      font-weight: bold;
      cursor: pointer;
    }
</style>