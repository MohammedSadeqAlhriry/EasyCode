<style>
.custom-notification-background:hover {
    background-color: #a0c4fa;
}
</style>

<template>
    <header class="p-3 bg-dark text-white">
    <div class="container">
      <h1>
        Notifications
        <button class="btn btn-secondary" @click="declaringNotificationsHaveBeenViewed">
            Done Viewd
        </button>
      </h1>
    </div>
  </header>

  <main class="container mt-4" style="min-height: 70vh;">
    <div class="alert alert-primary m-1 btn w-100 custom-notification-background"
        @click="goToPage(notification)" 
        v-for="(notification, index) in notifications" :key="index">
      {{ notification.text }}
    </div>
  </main>
</template>

<script lang="ts">
import axios from "axios";
import { Options, Vue } from "vue-class-component";

@Options({
    data() {
        return {
            notifications: []
        }
    },
    async created() {
        await this.getNotifications();
    },
    methods:{
        async declaringNotificationsHaveBeenViewed() {
            this.notifications = [];
            // no notify that the user did read the notifications
            if (this.$store.state.user.id) {
                const res = await axios.post(`http://localhost:3000/notifications/declaringNotificationsHaveBeenViewed/${this.$store.state.user.id}`);
                //console.log(res);
            }
        },
        goToPage(notification: any) {
            switch (notification.pageSection) {
                case 'ChattingRoom':
                    this.$store.state.currentCourseDisplayedContent = "ChattingRoom";
                    this.$router.push(`/${notification.pagePath}`);
                    break;
            
                default:
                    this.$router.push(`/${notification.pagePath}`);
                    break;
            }
        },
        async getNotifications() {
            try {
                const userId = await this.$store.state.user.id;
                const response = await axios.get(`http://localhost:3000/notifications/${userId}`);
                this.notifications = response.data;
                //console.log(this.notifications);
            } catch (error) {
                console.log(error);
            }
        },
    }
})
export default class NotificationsView extends Vue {
[x: string]: any;
}
</script>