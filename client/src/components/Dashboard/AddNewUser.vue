<template>
    <div class="modal fade" id="addUserModal" tabindex="-1" aria-labelledby="addUserModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addUserModalLabel">Add New User</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <SignupView @done="done" :addUser="true" />
                    </div>
                    <div class="modal-footer">
                        <button id="cancelButton" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import SignupView from '@/views/SignupView.vue'

@Options({
  components: {
    SignupView
  },
  data () {
    return {}
  },
  computed: {
  },
  methods: {
    done() {
      //console.log("done");
      const cancelButton = document.getElementById('cancelButton');
      (cancelButton as any).click();
    }
  }
})
export default class AddNewUser extends Vue {
[x: string]: any;
}
</script>
