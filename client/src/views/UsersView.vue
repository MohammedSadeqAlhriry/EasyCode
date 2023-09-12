<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Filterd by {{ filter ? filter : 'all user' }}s
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item btn" @click="setFilterValue('student')">Students</a></li>
                <li><a class="dropdown-item btn" @click="setFilterValue('supervisor')">Supervisors</a></li>
                <li><a class="dropdown-item btn" @click="setFilterValue('')">All Users</a></li>
              </ul>
            </li>
          </ul>
          <form class="d-flex" role="search">
            <input
              v-model="search"
              class="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button class="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
    <div
      v-if="currentDisplayedUsers.length > 0"
      class="container"
      style="min-height: 600px"
    >
      <div class="row mt-4">
        <UserCard
          v-for="(user, index) in currentDisplayedUsers"
          :key="index"
          :user="user"
        />
      </div>
      <pagination
        v-model="page"
        :records="getUsersAfterFilter.length"
        :per-page="perPage"
        @paginate="handlePageClick"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import axios from "axios";
import UserCard from "@/components/User/UserCard.vue";

@Options({
  name: 'users',
  components: {
    UserCard,
  },
  data() {
    return {
      page: 1,
      perPage: 8,
      search: "",
      filter: "",
    };
  },
  computed: {
    getDefaultFilterValue() {
      // getting filter value if there is
      const displayThisTypeOfUsers = this.$store.state.showUsersWithType;
      if (displayThisTypeOfUsers != this.filter) {
        this.filter = displayThisTypeOfUsers;
      }
      return this.filter;
    },
    getUsersAfterFilter() {
      return this.users.filter(
        (user: {
          id: number;
          fullName: string;
          username: string;
          userType: string;
        }): any => {
          const searchTermLC = this.search.toLowerCase();
          const userTypeFilter = this.getDefaultFilterValue.toLowerCase();
          return (
            (user.fullName.toLowerCase().includes(searchTermLC) ||
              user.username.toLowerCase().includes(searchTermLC)) &&
            user.userType.toLowerCase().includes(userTypeFilter)
          );
        }
      );
    },
    currentDisplayedUsers() {
      const from = (this.page - 1) * this.perPage;
      let to = 0;
      if (from + this.perPage > this.getUsersAfterFilter.length) {
        to = this.getUsersAfterFilter.length;
      } else {
        to = from + this.perPage;
      }
      return this.getUsersAfterFilter.slice(from, to);
    },
  },
  methods: {
    setFilterValue(value: string) {
      this.$store.state.showUsersWithType = value;
    },
    handlePageClick(newPage: number) {
      this.page = newPage;
    },
  },
  mounted() {
    //this.getDefaultFilterValue();
  },
})
export default class UsersView extends Vue {
  [x: string]: any;
  users: any[] = [];

  async created() {
    // loading data
    try {
      const response = await axios.get("http://localhost:3000/users");
      this.users = response.data;
    } catch (error) {
      console.log(error);
    }
  }
}
</script>
