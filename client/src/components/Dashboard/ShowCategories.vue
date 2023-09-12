<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light mb-3">
    <div class="container-fluid">
      <form class="d-flex me-auto" @submit.prevent="onSubmit">
        <input
          v-model="searchTerm"
          class="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          id="search-bar"
        />
        <button class="btn btn-outline-success" type="submit">
          <i class="fas fa-search"></i>
        </button>
      </form>
      <button
        id="addButton"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#addCategoryModal"
      >
        Add New Category <i class="fas fa-plus"></i>
      </button>
    </div>
  </nav>
  <div class="container">
    <div class="row">
      <div
        class="col-12"
        style="max-height: 415px; overflow-y: scroll; margin: 0"
      >
        <div
          v-for="(category, index) in searchResults"
          :key="index"
          class="user-card p-4"
        >
          <span class="fw-bold">{{ category.name }}</span>
          <span class="text-muted">@_{{ category.courses.length }}_course</span>
          <div class="btn-group float-end">
            <button
              @click="editThisCategory(category)"
              class="btn btn-outline-info"
              title="Edit this category"
            >
              <i class="fas fa-edit"></i>
              Edit
            </button>
            <button
              @click="deleteCategory(category)"
              class="btn btn-outline-danger"
              title="Remove this category"
            >
              <i class="fa-solid fa-trash"></i>
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--Adding New User Modal-->
  <AddNewCategory @add="add" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import AddNewCategory from "@/components/Dashboard/AddNewCategory.vue";
import axios from "axios";
import Swal from "sweetalert2";

@Options({
  components: {
    AddNewCategory,
  },
  methods: {
    editThisCategory(category: any) {
      Swal.fire({
        title: "Enter new category name",
        input: "text",
        inputPlaceholder: "Enter new category name here...",
        inputValue: category.name,
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
      }).then((result) => {
        // start updateing if conffirme button clciked
        if (result.isConfirmed) {
          const newNameValue = result.value;
          category.name = newNameValue;
          this.uploadChanges(category);
          // Show success message
          Swal.fire({
            title: "Category name updated!",
            text: `The new name is "${newNameValue}".`,
            icon: "success",
            timer: 1700,
            showConfirmButton: false,
          });
        }
      });
    },
    add(category: any) {
      this.loadCategories();
    },
    async loadCategories() {
      try {
        const response = await axios.get("http://localhost:3000/categories");
        //console.log(response.data);
        this.categories = response.data;
      } catch (error) {
        alert(error);
      }
    },
    async uploadChanges(newCategory: any) {
      try {
        await axios.put(
          `http://localhost:3000/categories/${newCategory.id}`,
          newCategory
        );
      } catch (error) {
        alert(error);
      }
    },
    deleteCategory(category: any) {
      Swal.fire({
        title: `Are you sure you want to delete "${category.name}"?`,
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          axios.delete(`http://localhost:3000/categories/${category.id}`)
          .then((response) => {
            Swal.fire({
              title: "Category deleted!",
              text: `"${category.name}" has been deleted.`,
              icon: "success",
              timer: 1700,
              showConfirmButton: false,
            });
            this.loadCategories();
          }).catch((error) => {
            Swal.fire({
              title: "Error",
              text: error.response.data.message,
              icon: "error",
            });
          });
        }
      });
    },
  },
  mounted() {
    this.loadCategories();
  },
  computed: {
    searchResults() {
      return this.categories.filter(
        (category: {
          id: number;
          name: string;
          numberOfCourses: number;
        }): any => {
          const searchTermLC = this.searchTerm.toLowerCase();
          return (
            category.name.toLowerCase().includes(searchTermLC) ||
            category.numberOfCourses
              .toString()
              .toLowerCase()
              .includes(searchTermLC)
          );
        }
      );
    },
  },
  data() {
    return {
      searchTerm: "",
      categories: [],
    };
  },
})
export default class ShowCategories extends Vue {
  [x: string]: any;
}
</script>

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
  background-color: #f5f5f5;
  cursor: pointer;
}
</style>
