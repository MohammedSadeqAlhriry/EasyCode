<template>
  <div class="container mt-4" style="min-height: 70vh">
    <h1>Stages Questions</h1>
    <h6>{{ time }} minutes are expected to finish the stage exam</h6>
    <div class="d-flex align-items-center">
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addQuestionModal">
        Add Question <i class="fas fa-plus"></i>
      </button>
      <AddNewQusetion @AddQuestionEvent="addQuestion" />
    </div>
    <div v-if="getStage && stage" class="mt-4">
      <div v-for="(exam, index) in stage.exams" :key="index" class="mb-3">
        <div class="d-flex justify-content-between align-items-center">
          <div>{{ exam.question }}</div>
          <div>
            <button class="btn btn-sm btn-danger" @click="deleteExam(exam)">
              <i class="bi bi-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import AddNewQusetion from "@/components/Course/AddNewQuestion.vue";
import axios from "axios";
import Swal from "sweetalert2";

@Options({
  name: "StageQuestion",
  components: {
    AddNewQusetion,
  },
  data() {
    return {
      stage: null,
      time: -1
    };
  },
  methods: {
    async formatAnswers(wrongAnswers: string[], correctAnswer: string) {
      const randomIndex = Math.floor(Math.random() * (wrongAnswers.length + 1));
      wrongAnswers.splice(randomIndex, 0, correctAnswer);
      const allAnswers = wrongAnswers.join(', ');
      return allAnswers;
    },
    async addQuestion(questionData: any) {
      let payload = await {
        stage: this.stage,
        question: questionData.questionText,
        rightAnswer: questionData.rightAnswerText,
        answer: await this.formatAnswers(questionData.wrongAnswersArray, questionData.rightAnswerText)
      };
      try {
        const response = await axios.post('http://localhost:3000/exams',payload);
        // update state and current stage
        const refreshedStageResponse = await axios.get(`http://localhost:3000/stages/${this.stage.id}`);
        this.$store.state.stageInExamPage = refreshedStageResponse.data;
        this.time = (this.stage.exams.length * 2);
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Network Error",
          text: error.message,
        });
      }
    },
    async deleteExam(exam: any) {
      // axios delete function
      try {
        const response  = await axios.delete(`http://localhost:3000/exams/${exam.id}`);
        this.stage.exams = this.stage.exams.filter((filterdExams:any) => exam !== filterdExams);
        this.time = (this.stage.exams.length * 2);
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Network Error",
          text: error.message,
        });
      }
      // reset the state value
    }
  },
  computed: {
    async getStage() {
      this.stage = await this.$store.state.stageInExamPage;
      !this.stage ? this.$router.push('/') : this.time = (this.stage.exams.length * 2);
      return this.stage;
    },
  }
})
export default class ExamView extends Vue {
  [x: string]: any;
}
</script>

