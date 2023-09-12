
<template>
  <div class="container marketing mt-5">
			
    <hr class="featurette-divider">

    <div class="row featurette">
      <div class="col-md-7 m-auto">
        <h2 class="featurette-heading fw-normal lh-1"> We share <span class="text-muted">knowledge </span></h2>
        <h2 class="featurette-heading fw-normal lh-1">with the world.</h2>
      </div>
      <div class="col-md-5 order-md-1">
        <img src="../assets/images/img-about.jpg" alt=""  class="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"  width="500" height="500" >
      </div>
    </div>
  
    <hr class="featurette-divider">
    
    <div class="row m-5">
      <div class="border-1 m-auto p-2 d-inline col-lg-6">
        <h3 class="me-3">Our History</h3>
        <p>When we started EasyCode, our goal was to give anyone in the world the ability to learn the skills they’d need to succeed in the 23st century. We set out to create a new, interactive way of learning, making it engaging, flexible, and accessible for as many people as possible. Since then, we have helped millions of people worldwide unlock modern technical skills and reach their full potential through code.</p>
      </div>
      <div class="border-1 m-auto p-2 d-inline col-lg-6">
        <h3 class="me-3">Our Missoin</h3>
        <p>We want to create a world where anyone can build something meaningful with technology, and everyone has the learning tools, resources, and opportunities to do so. Code contains a world of possibilities, all that’s required is the curiosity and drive to learn. At EasyCode, we are committed to empowering all people, regardless of where they are in their coding journeys, to continue to learn, grow, and make an impact on the world around them.</p>
      </div>
    </div>
    
    <h3 class="text-center">Our Team</h3>
    <hr >
    <!-- four columns of text below the carousel -->
    <div class="row text-center justify-content-center">
      <div v-for=" Developer in Developers " class="col-lg-3 mb-3">
        <img :src=" Developer.imgPath" alt="" srcset="" class="bd-placeholder-img rounded-circle bg-info pt-1"  width="150" height="150"  role="img"/>
        <h4 class="fw-normal">{{ Developer.name }}.</h4>
        <p>{{ Developer.Description }}.</p>					
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

  @Options({   
    data () {
      return {
        Developers: [
          {id:1, name:"Abdallrahman", imgPath:"@/assets/images/img-user.png", Description:"Developer website"},
          {id:1, name:"salem",        imgPath:"@/assets/images/img-user.png", Description:"Developer website"},
          {id:1, name:"mohammed",     imgPath:"@/assets/images/img-user.png", Description:"Developer website"},
          {id:1, name:"mohasn",       imgPath:"@/assets/images/img-user.png", Description:"Developer website"}
        ]
      }
    }
  })
  export default class AboutView extends Vue {
    [x: string]: any;
  }
</script>