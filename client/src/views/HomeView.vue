<template>
  <div class="home">
    <WelcomeCarousel />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import WelcomeCarousel from '@/components/WelcomeCarousel.vue'; // @ is an alias to /src

@Options({
  components: {
    WelcomeCarousel,
  },
})
export default class HomeView extends Vue {}
</script>
