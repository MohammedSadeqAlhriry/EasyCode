<template>
  <div
    class="modal fade"
    id="addCategoryModal"
    tabindex="-1"
    aria-labelledby="addCategoryModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addCategoryModalLabel">
            Add New Category
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div
            class="form-container d-flex align-items-center justify-content-center fs-4"
          >
            <div
              class="form-border w-100 p-4 ratio-1x1 rounded"
              style="background: #eaebed"
            >
              <div class="card">
                <div class="card-header bg-primary text-white">
                  Add New Category
                </div>
                <div class="card-body">
                  <form @submit.prevent="createNewCategory">
                    <div class="mb-3">
                      <label for="categoryName" class="form-label"
                        >Category Name</label
                      >
                      <input
                        v-model="categoryName"
                        type="text"
                        class="form-control"
                        id="categoryName"
                        name="categoryName"
                        placeholder="Enter category name"
                        required
                      />
                      <div
                        v-if="!categoryName"
                        class="alert alert-danger m-2"
                        role="alert"
                      >
                        Please enter a category name.
                      </div>
                    </div>
                    <button type="submit" class="btn btn-primary">
                      Add Category
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            id="cancelButton"
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import axios from "axios";

@Options({
  data() {
    return {
      categoryName: "",
    };
  },
  methods: {
    async createNewCategory() {
      try {
        let payload = {
          name: this.categoryName,
        };
        const response = await axios.post(
          "http://localhost:3000/categories",
          payload
        );
        this.categoryName = "";
        this.$emit("add", response.data);
        const cancelButton = document.getElementById("cancelButton");
        (cancelButton as any).click();
      } catch (error) {
        alert(error);
      }
    },
  },
})
export default class AddNewCategory extends Vue {
  [x: string]: any;
}
</script>
