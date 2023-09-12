<template>
    <div v-for="(student) in students" class="user-card">
    <img src="https://via.placeholder.com/50" alt="User Avatar">
    <span class="fw-bold">{{ student.fullname }}</span>
    <span class="text-muted">{{student.username}}</span>
    <div class="btn-group float-end">
      <button class="btn btn-outline-secondary" title="Send Email"><i class="fas fa-envelope"></i></button>
      <button class="btn btn-outline-secondary" title="View Details"><i class="fas fa-info-circle"></i></button>
      <button class="btn btn-outline-secondary" title="Edit User"><i class="fas fa-edit"></i></button>
      <button class="btn btn-outline-danger" title="Delete User"><i class="fas fa-trash"></i></button>
    </div>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    data(){
        return{
            students: [
                {fullname: 'Abdu Khalid Abdullh', username:'AK01REDWAN',type: 'Admin'},
                {fullname: 'Salem Nagy Khasem', username:'5488', type: 'Student'},
                {fullname: 'Ahmed Mohammed', username:'AK01REDWAN', type: 'Student'},
                {fullname: 'Weas Humza', username:'AK01REDWAN', type: 'Student'},
                {fullname: 'Abdurhman Khald', username:'AK01REDWAN', type: 'Student'},
                {fullname: 'New Person Name', username:'AK01REDWAN', type: 'Student'},
                {fullname: 'Another Person Name', username:'AK01REDWAN', type: 'Student'},
                {fullname: 'Another Person Name', username:'AK01REDWAN', type: 'Admin Supervisor'},
                {fullname: 'Another Person Name', username:'AK01REDWAN', type: 'Admin Supervisor'},
                {fullname: 'Another Person Name', username:'AK01REDWAN', type: 'Admin Supervisor'},
                {fullname: 'Another Person Name', username:'AK01REDWAN', type: 'Normal Supervisor'},
                {fullname: 'Another Person Name', username:'AK01REDWAN', type: 'Normal Supervisor'},
                {fullname: 'Another Person Name', username:'AK01REDWAN', type: 'Normal Supervisor'}
            ]
        }
    }
})
export default class Students extends Vue {
[x: string]: any;
}
</script>