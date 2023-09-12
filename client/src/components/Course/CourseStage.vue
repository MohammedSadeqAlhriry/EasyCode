<template>
    <div class="m-2 p-0 card text-dark bg-light font-size-26 shadow-lg rounded" style="max-width: 17.5rem;">
        <div class="card-header">
            <p class="m-0 text-center">{{ stageTitle }}</p>
        </div>
        <div class="card-body text-center">
            <i class="fa-solid color text-color4" :class="{'fa-lock-open': isOpen, 'fa-lock': !isOpen}" style="font-size: 8rem;"></i>
            <h6 class="text-muted font-size-26 mt-2">{{ stageId }}</h6>
        </div>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    props: {
        stageId: Number,
        stageTitle: String,
        isOpen: false,
    }
})
export default class CourseStage extends Vue {
    stageId!: Number;
    stageTitle!: String;
    isOpen!: Boolean;
}
</script>