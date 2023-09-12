<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-3">
    <div class="container-fluid">
      <form class="d-flex me-auto" @submit.prevent="onSubmit">
        <input v-model="searchTerm" class="form-control me-2" type="search" placeholder="Search" aria-label="Search" id="search-bar">
        <button class="btn btn-outline-success" type="submit"><i class="fas fa-search"></i></button>
      </form>
      
      <div class="dropdown me-3">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="filter-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
          Filter: {{ filter }}
        </button>
        <ul class="dropdown-menu" aria-labelledby="filter-dropdown">
          <li><a class="dropdown-item btn" @click="changeFilterValue('')">All Users</a></li>
          <li><a class="dropdown-item btn" @click="changeFilterValue('supervisor')">Supervisors</a></li>
          <li><a class="dropdown-item btn" @click="changeFilterValue('Student')">Students</a></li>
          <li><a class="dropdown-item btn" @click="changeFilterValue('admin')">Admins</a></li>
        </ul>
      </div>
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addUserModal">Add New User <i class="fas fa-plus"></i></button>
    </div>
  </nav>
  <div class="container">
    <div class="row">
      <div class="col-12" style="
                                max-height: 415px;
                                overflow-y: scroll;
                                margin: 0;">
        <div v-for="(user,index) in searchResults" :key="index" class="user-card">
          <img src="https://via.placeholder.com/50" alt="User Avatar">
          <span class="fw-bold">{{ user.fullName }}</span>
          <span class="text-muted">@{{user.username}}</span>
          <div class="btn-group float-end">
            <button @click="goToUserDateilsPage(user)" class="btn btn-outline-secondary" title="View Details"><i class="fas fa-info-circle"></i></button>
            <button @click="goToEditUserPage(user)" class="btn btn-outline-secondary" title="Edit User"><i class="fas fa-edit"></i></button>
            <button @click="deleteUser(user)" class="btn btn-outline-danger" title="Delete User"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--Adding New User Modal-->
  <AddNewUser />
</template>
<style scoped>
    .user-card {
      margin-bottom: 20px;
    }
    .user-card img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .user-card .btn {
      margin-right: 5px;
    }
    .user-card:hover {
        background-color: #F5F5F5;
        cursor: pointer;
    }
</style>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import AddNewUser from '@/components/Dashboard/AddNewUser.vue'
import axios from 'axios';
import Swal from "sweetalert2";

@Options({
    components:{
      AddNewUser,
    },
    methods:{
      goToEditUserPage(user: any) {
        this.$store.state.userInEditUserPage = user;
        this.$router.push("/edituser");
      },
      goToUserDateilsPage(user: any) {
        this.$store.state.userInUserDetailsPage = user;
        this.$router.push("/user");
      },
      changeFilterValue(value: String) { this.filter = value; }/*for change the filter parameter value*/,
      async getAllUsers() {
        try {
          const response = await axios.get('http://localhost:3000/users');
          this.users = response.data;
        } catch (error) {
          alert(error);
        }
      },
      async deleteUser(user: any) {
        if (user.userType == 'admin') {
          Swal.fire({
            title: "ADMIN?",
            text: `You can not delete the admin ${ user.fullName }.`,
            icon: "error",
          });
          return;
        }
        Swal.fire({
          title: "Delete?",
          text: `Are you sure. you went to delete ${ user.fullName }.`,
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: '#ff0101',
          cancelButtonColor: '#22aa22',
          confirmButtonText: "Yes, Delete",
          cancelButtonText: "No",
        }).then((result) => {
          if (result.isConfirmed) {
            this.deleteUserById(user.id);
            Swal.fire(
              "Deleted!",
              "User deleted successfully.",
              "success"
            );
          }
        });
      },
      async deleteUserById(userId: number) {
        try {
          console.log(userId);
          await axios.delete(`http://localhost:3000/users/${userId}`);
          await this.getAllUsers(); // fetch users from the db
        } catch (error) {
          alert(error);
        }
      }
    },
    async created() {
      await this.getAllUsers();
    },
    computed:{
      searchResults() {
        return this.users.filter((user: { id: number; fullName: string; username: string; userType: string;}): any => {
          const searchTermLC = this.searchTerm.toLowerCase();
          const userTypeFilter = this.filter.toLowerCase();
          return (user.fullName.toLowerCase().includes(searchTermLC) || user.username.toLowerCase().includes(searchTermLC)) 
            && user.userType.toLowerCase().includes(userTypeFilter);
        });
      }
    },
    data(){
        return {
            searchTerm: '',
            filter: '',
            users: [] // data will be fetched into this array when create method call getAllUsers method
        }
    },
})
export default class ShowUsers extends Vue {
[x: string]: any;
}
</script>