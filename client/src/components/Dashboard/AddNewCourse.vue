<template>
    <div class="modal fade" id="addCourseModal" tabindex="-1" aria-labelledby="addCourseModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addCourseModalLabel">Add New Course</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="form-container d-flex align-items-center justify-content-center fs-4">
                            <div class="form-border w-100 p-4 ratio-1x1  rounded" style="background:#EAEBED">
                                <form  @submit.prevent="createCourse" class="needs-validated row">
                                    <div class="form-group was-validated col-lg-12 mb-2">
                                        <label class="form-label"  for="my-name">Course Name</label>
                                        <input v-model="name" id="my-name" class="form-control" type="text" name="" placeholder="Enter your course name" required>
                                        <div class="invalid-feedback fs-6">Please enter your course name</div>
                                        <div class="valid-feedback fs-6">Looks Good</div>
                                    </div>
                                    <div class="form-group was-validated col-lg-12 mb-2">
                                        <label class="form-label" for="my-category">Category</label>
                                        <input v-model="searchTerm" @keyup="getCategory()" class="form-control" id="my-category"  type="text" name="" placeholder="Enter the course category to search about" required>
                                        <input v-model="category.name" class="form-control" id="my-category"  type="text" name="" placeholder="Enter the course category" required disabled>
                                        <div class="invalid-feedback fs-6">Please enter your email address</div>
                                        <div class="valid-feedback fs-6">Looks Good but enure that the category with it's full name is in the disabled input</div>
                                    </div>
                                    <div class="form-group was-validated col-lg-12 mb-2">
                                        <label class="form-label" for="my-password">Course Description</label>
                                        <textarea v-model="description" id="my-courseDescription" class="form-control" name="" placeholder="Enter course description" required></textarea>
                                        <div class="invalid-feedback fs-6">Please enter the course description</div>
                                        <div class="valid-feedback fs-6">Looks Good</div>
                                    </div>
                                    <div class="form-group was-validated col-lg-12 mb-2">
                                        <label for="my-courseImage">Course Image</label>
                                        <input @change="onFileChange" id="my-courseImage" class="form-control" type="file" accept="image/*" name="" required>
                                        <div class="invalid-feedback fs-6 ">Please enter the course image</div>
                                        <div class="valid-feedback fs-6">Looks Good</div>
                                    </div>           
                                    <input :disabled="isSubmitting" type="submit" class="btn btn-success col-10 m-auto mt-3 fs-5" :value="`${isSubmitting?'creating...':'create'}`">
                                </form>
                            </div>
                        </div>
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
import axios from 'axios';
import Swal from 'sweetalert2';

@Options({
    components: { },
    data () { 
        return {
            category: '----',
            searchTerm: '',
            categories: [],
            name: '',
            description: '',
            imagePath: '/no/path',
            image: null,
            isSubmitting: false
        }
    },
    methods: {
        createCourse() {
            this.isSubmitting = true;
            const formDataInstance = new FormData();
            formDataInstance.append("files", this.image);
            formDataInstance.append('imagePath', this.imagePath);
            formDataInstance.append('name', this.name);
            formDataInstance.append('description', this.description);
            formDataInstance.append('category',JSON.stringify(this.category));

            axios.post('http://localhost:3000/courses',formDataInstance,{
                headers: {
                "Content-Type": "multipart/form-data",
                },
            }).then(async (response) => {
                await Swal.fire({
                    icon: "success",
                    title: `Done!...`,
                    text: "Course Added successfully",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                });
                this.name = '',
                this.isSubmitting = false;
                const cancelButton = document.getElementById("cancelButton");
                (cancelButton as any).click();
                this.$emit('done');
            }).catch((error) => {
                console.log(error);
                Swal.fire({
                    icon: "error",
                    title: "Oops!",
                    text: error.response.data.message,
                });
                this.isSubmitting = false;
            });
        },
        onFileChange(event: any) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {};
            reader.readAsDataURL(file);
            this.image = file;
        },
        async loadCategories() {
            try {
                const response = await axios.get("http://localhost:3000/categories");
                this.categories = response.data;
            } catch (error) {
                alert(error);
            }
        },
        getCategory(){
            this.category = this.categories.filter((category: {id: number; name: string;}): any => {
                const searchTermLC = this.searchTerm.toLowerCase();
                return category.name.toLowerCase().includes(searchTermLC);
            })[0];
        }
    },
    async mounted() {
        await this.loadCategories();
    }
})
export default class AddNewCourse extends Vue {
[x: string]: any;
}
</script>
