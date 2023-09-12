<template>
  <section class="bg-white m-2 p-0">
    <div class="container h-100 w-100">
      <div class="row d-flex justify-content-center">
        <div class="h-100 w-100">
          <div class="card h-100">
            <div class="card-header align-items-center fw-bold p-3">
              <span class="fa fa-comments me-2 fs-5"></span>
              <span class="mb-0 fs-4">CourseName ChattingRoom</span>
            </div>
            <div
              id="messagescontainer"
              class="card-body overflow-auto"
              data-mdb-perfect-scrollbar="true"
              style="position: relative; height: 400px"
            >
              <div v-for="(message,index) in messages" :key="index">
                <div
                  v-if="message.sender.id === me.id"
                  class="d-flex flex-row justify-content-end"
                >
                  <div>
                    <h6 class="text-end fw-bold text-secondary">
                        <small class="text-primary" style="font-size: 12px;">(me)</small> 
                        {{ message.sender.username }}@
                    </h6> 
                    <p class="small p-2 me-3 mb-1 rounded-3" style="background-color: #cfe2ff;">
                      {{ message.textContent }}
                    </p>
                    <p style="font-size: 10px;"
                      class="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end"
                    >
                    {{ new Date(message.DateAndTime).toLocaleDateString() }} - {{ new Date(message.DateAndTime).toLocaleTimeString() }}
                    </p>
                  </div>
                  <img
                    src="@/assets/images/img-user.png"
                    alt="avatar 1"
                    style="width: 20px; height: 100%"
                  />
                </div>
                <div v-else class="d-flex flex-row justify-content-start">
                  <img
                    src="@/assets/images/img-user.png"
                    alt="avatar 1"
                    style="width: 20px; height: 100%"
                  />
                  <div>
                    <h6 class="text-start fw-bold text-secondary">
                        @{{ message.sender.username }}
                    </h6> 
                    <p class="small p-2 ms-3 mb-1 rounded-3 bg-light">
                      {{ message.textContent }}
                    </p>
                    <p class="small ms-3 mb-3 rounded-3 text-muted" style="font-size: 10px;">
                      {{ new Date(message.DateAndTime).toLocaleDateString() }} - {{ new Date(message.DateAndTime).toLocaleTimeString() }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="card-footer text-muted d-flex justify-content-start align-items-center p-2"
            >
              <img
                src="@/assets/images/img-user.png"
                class="m-1"
                alt="avatar 3"
                style="width: 40px; height: 100%"
              />
              <input
                @keyup.enter="sendMessage"
                v-model="textContent"
                type="text"
                placeholder="Type your message"
                class="form-control form-control-lg"
                name=""
                id=""
              />
              <a style="cursor: pointer; color: rgb(8, 91, 91);" @click="sendMessage">
                <i class="fas fa-paper-plane fs-3 p-1"></i>
            </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import axios from "axios";
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    currentCourse: null,
  },
  async created() {
    this.me = this.$store.state.user;
    await this.loadMessages();
    var objDiv: any = document.getElementById("messagescontainer");
    objDiv.scrollTop = objDiv.scrollHeight;
  },
  methods: {
    async sendMessage() {
        const response = await axios.post(
            "http://localhost:3000/messages",
            { 
                course: {id:this.currentCourse.id},
                sender: this.me,
                textContent: this.textContent,
            },
            {
                headers: {
                    Authorization: "Bearer " + this.$store.state.userTokens,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log(response);
        this.textContent = "";
        this.loadMessages();
    },
    async loadMessages() {
      const response = await axios.post(
        "http://localhost:3000/messages/get-user-msgs",
        { courseId: this.currentCourse.id },
        {
          headers: {
            Authorization: "Bearer " + this.$store.state.userTokens,
            "Content-Type": "application/json",
          },
        }
      );
      this.messages = response.data;
    },
  },
  data() {
    return {
      messages: [],
      me:null,
      textContent: '',
      intervalId: null,
    };
  },
  mounted() {
    this.intervalId = setInterval(() => {
      this.loadMessages();
    }, 5000);
  },
  unmounted() {
    clearInterval(this.intervalId);
  }
})
export default class ChatRoom extends Vue {
  [x: string]: any;
}
</script>
