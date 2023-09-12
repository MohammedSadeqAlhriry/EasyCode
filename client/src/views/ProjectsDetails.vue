<template>
  <div class="container mt-5" style="min-height: 65vh;" v-if="project">
    <div class="row">
      <div class="col-md-6">
        <img :src="`http://localhost:3000/${project.imagePath}`" class="rounded float-left shadw w-90" alt="">
      </div>
      <div class="col-md-6">
        <h1>                                          {{ project.title }}</h1>
        <p><strong>Created date: </strong>            {{ project.createdDate }} </p>
        <p><strong>Likes number: </strong>            {{ project.likes.length }}</p>
        <p><strong>Refused times: </strong>           {{ project.refusedTimes }}</p>
        <p><strong>Supervisor comment:</strong>       {{ project.supervisorComment }} </p>
        <p><strong>Supervisor user name: </strong>   @{{ project.supervisor.username }}</p>
        <p><strong>Student user name: </strong>      @{{ project.student.username }}</p>
        <hr>
        <div class="mt-3">
          <a @click="downloadStudentProject()" class="btn btn-primary m-2">
            <i class="fas fa-download"></i> 
            {{ isDownloading? 'Downloading...' : 'Download' }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">

import axios from 'axios';
import Swal from 'sweetalert2';
import { Options, Vue } from 'vue-class-component';
@Options({
  async created() {
    this.project = await this.$store.state.ProjectInProjectDatailsPage;
    //console.log(this.project);
  },
  data() {
    return {
      isDownloading: false,
      newComment: '',
      project: null
    }
  },
  methods: {
    async downloadStudentProject() {
      console.log("Downloading...");
      this.isDownloading = true;
      const parts = this.project.documentPath.split("/");
      const filename = parts[parts.length - 1];
      //const filenameWithoutExtension = filename.slice(0, filename.lastIndexOf('.'));
      axios({
        url: `http://localhost:3000/downloads/${filename}`,
        method: "GET",
        responseType: "blob",
      })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename);
          link.style.display = "none"; // hide the link
          document.body.appendChild(link); // append the link to the document body
          link.click();
          Swal.fire({
            icon: "success",
            title: "Download Compeleted.",
            text: `downloading ${this.project.title} has been compeleted successfully.`,
          });
          document.body.removeChild(link); // remove the link from the document body after download is complete
        })
        .catch((error) => {
          console.log(error);
        }).finally(() => {
          this.isDownloading = false;
        });
    },
    addComment() {
      if (this.newComment.length > 0) {
        this.project.comments.push({
          id: this.project.comments.length + 1,
          author: 'You',
          message: this.newComment,
          date: new Date().toISOString().slice(0, 10)
        })
        this.newComment = ''
      }
    }
  }



})
export default class ProjectsDetails extends Vue {
  [x: string]: any;
}

</script>
  