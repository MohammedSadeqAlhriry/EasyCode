<template>
    <div class="row">
        <Card v-for="project in Projects" 
        :Id="project.id"
        :Title="project.title" 
        :Description="project.supervisorComment"
        :LikesNo="0"
        Type="projectCard"/>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Card from '@/components/Card.vue'

@Options({
    data(){
        return {}
    },
    components:{ Card },
    props: { 
        Title: String,
        Projects: []
     }
})
export default class ProjectsGallery extends Vue {
  Title!: string;
  Projects!: [any];
}
</script>