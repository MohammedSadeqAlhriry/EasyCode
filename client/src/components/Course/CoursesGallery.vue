<template>
    <div class="row">
        <Card v-for="course in getCourses" :key="course.id"
        :Id="course.id" 
        :Title="course.name" 
        :Description="course.name"
        Type="courseCard"
        :LikesNo="course.likes.length"/>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Card from '@/components/Card.vue'

@Options({
    data(){
        return {  
        }
    },
    components:{
        Card
    },
    props: {
        Title: String,
        Courses: []
    },
    computed:{
        getCourses() {
            console.log(this.Courses);
            return this.Courses;
        }
    }
})
export default class CoursesGallery extends Vue {
[x: string]: any;
  Title!: string;
  Courses!: [any];
}
</script>