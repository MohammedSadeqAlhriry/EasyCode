<template>
    <div class="col-lg-3 col-md-12 mb-0">
        <div class="card shadow-lg mb-5 bg-body rounded">
          <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
            <img v-if="user.picturePath" :src="`http://localhost:3000${user.picturePath}`" class="img-fluid" alt="Project Image">
            <img v-else src="https://mdbootstrap.com/img/new/standard/nature/111.jpg" class="img-fluid" alt="Project Image">
          </div>
          <div class="card-body">
            <h5 class="card-title mb-0">{{ user.fullName }}</h5>
            <h6 class="mt-0 text-secondary text-decoration-underline">@{{ user.username }}</h6>
            <p class="card-text">{{ user.userDescription }}</p>
            <button @click="goToUserDateilsPage" class="m-1 btn btn-outline-primary">
              <i class="fa fa-circle-info"></i> 
              show {{ user.userType }} details 
            </button>
          </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    user: JSON
  },
  methods: {
    goToUserDateilsPage() {
      this.$store.state.userInUserDetailsPage = this.user;
      this.$router.push("/user");
    },
  }
})
export default class UserCard extends Vue {
  user!: any;
  goToUserDateilsPage: ((payload: MouseEvent) => void) | undefined;
}
</script>