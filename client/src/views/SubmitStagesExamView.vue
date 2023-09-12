<template>
    <hr class="p-0 m-0"><hr class="p-0 m-0"><hr class="p-0 m-0"><hr class="p-0 m-0 mb-1"><hr class="p-0 m-0">
    <h1 class="text-center" v-if="stage">{{ stage.title }} Stage's Examination Page</h1>
    <hr class="p-0 m-0 mb-1"><hr class="p-0 m-0"><hr class="p-0 m-0"><hr class="p-0 m-0"><hr class="p-0 m-0 mb-1">
    <form v-if="stage">
        <div class="p-3" v-for="(exam, index) in stage.exams" :key="index">
            <label><em><strong style="font-size: larger;">{{ exam.question }}</strong></em></label>
            <div v-for="choice in splitAnswers(exam.answer)" :key="choice">
                <input type="radio" :name="'choice' + index" v-model="selectedAnswers[index]" :value="choice" />
                {{ choice }}
            </div>
            <hr/>
        </div>
        <button type="button" class="btn btn-primary m-4" @click="submit">Submit</button>
        <div class="alert alert-warning" role="alert">
            Will be submitted automatically after 60 minutes, current exam time is now {{ minutesLefted }} minutes.
        </div>
    </form>
    <hr class="p-0 m-0"><hr class="p-0 m-0"><hr class="p-0 m-0"><hr class="p-0 m-0 mb-4">
</template>

<script lang="ts">
import axios from "axios";
import Swal from "sweetalert2";
import { Options, Vue } from "vue-class-component";
@Options({
  async created() {
    await this.loadStage();
    this.startTiming();
    //await this.checkifTheUserHasSubmittedThisStageProject();
  },
  data() {
    return {
      stage: null,
      selectedAnswers: [],
      minutesLefted: 0,
    };
  },
  methods: {
    shuffleArray(array: any[]): any[] {
      const shuffledArray = [...array];
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
      }
      return shuffledArray;
    },
    async submit() {
      try {
        const answers = new Array<{ examId: number, answer: string }>();
        this.selectedAnswers.forEach((answer: any, index: number) => {
          answers.push({ examId: this.stage.exams[index].id, answer: answer });
        });
        const payload = { courseId: this.stage.course.id, examAnswers: answers };
        const response = await axios.post(`http://localhost:3000/exams/calculate-result/${this.stage.id}`,
        payload,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.userTokens,
            'Content-Type': 'application/json'
          }
        });
        if (response.data.stage.id > this.stage.id) {
          this.$store.state.currentStage = response.data.stage;
          Swal.fire({
            icon: "success",
            title: `WELL DONE`,
            text: "well done looks like you are doing great.",
          })
          this.$router.push('/course');
        } else {
          Swal.fire({
            icon: "info",
            title: `oOPs...`,
            text: "you get F but we say F is find another answers, learn more watch more them come back.",
          })
          this.$router.push('/course');
        }
        
      } catch (error) {
        console.log(error);
      }
    },
    splitAnswers(answerString: string) {
      return this.shuffleArray(answerString.split(', '));
    },
    async checkifTheUserHasSubmittedThisStageExam() {
      try {
        // fixe this
        const response = await axios.get(`http://localhost:3000/subscriptions/by-user/:userId/by-course/:courseId`,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.userTokens,
            'Content-Type': 'application/json'
          }
        });
        if (response.data && this.$store.state.user.userType == 'student') {
          this.goToWaitingProjectConfirmationPage();
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: `oOPs...`,
          text: "Network Error.",
        })
      }
    },
    async loadStage() {
      this.stage = await this.$store.state.stageInSubmitStagesExamPage;
      !this.stage ? this.$router.push('/') : this.selectedAnswers = new Array<string>(this.stage.exams.length).fill('.');
      console.log(this.stage);
    },
    startTiming() {
        Swal.fire({
            icon: "info",
            title: "Welcome to the exam page.",
            text: `You have 60 minutes.`,
        });
        let timeLefted = setInterval(() => {
            this.minutesLefted += 1;
        },60000);
        
        const milliseconds = 60 * 60 * 1000;
        let examTime = setTimeout(() => {
            Swal.fire({
                icon: "info",
                title: "Done",
                text: `Examination time is finished.`,
            });
            clearInterval(timeLefted);
            // here do the auto submitting
        }, milliseconds);
    },
  }
})
export default class SubmitStagesExamView extends Vue {
[x: string]: any;
}
</script>

