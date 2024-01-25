<template>
    <div class="manage-categories-wrapper">
        <LoadingOverlay v-if="categoriesLoading" background="transparent" color="black" />
        <div class="manage-categories">
            <h3 class="heading">Manage Categories</h3>
            <div class="add-new-wrap" @click="addNewCategory">
                <i class="fa-solid fa-square-plus"></i>
                <span>Add New</span>
            </div>

            <div class="categories-data">
                <div class="single-category category-headings">
                    <div class="category-image-heading">Image</div>
                    <div>Name</div>
                    <div>Link</div>
                    <div class="categories-delete-heading">Actions</div>
                </div>

                <div class="divider"></div>

                <div class="categories-wrap">
                    <div class="single-category" v-for="(category, index) of newCategories" :key="category.id">
                        <div class="category-image-block">
                            <label :for="'category-image' + index" class="category-image-label">
                                <div class="category-image centered-background" :style="categoryImage(category.id, category.image)">
                                    <div class="category-image-overlay">
                                        <i class="fa-solid fa-folder-plus category-image-icon"></i>
                                    </div>
                                </div>
                            </label>
                            <input
                                ref="fileInput"
                                type="file"
                                :name="'category-image' + index"
                                accept="image/gif, image/jpeg, image/png, image/webp"
                                :id="'category-image' + index"
                                class="hidden"
                                @change="handleImageChange($event, index)"
                            />
                        </div>

                        <div class="category-name-wrap">
                            <input class="category-name editable" type="text" v-model="category.name" />
                        </div>

                        <div class="category-link-wrap">
                            <input class="category-link editable" type="text" v-model="category.link" />
                        </div>

                        <div class="category-actions-wrap">
                            <button class="button-main save-button" @click="saveCategory(category.id, index)">
                                {{ categoriesSaving[index] ? 'Saving..' : 'Save' }}
                            </button>
                            <button class="button-main delete-button" @click="deleteCategory(category.id, index)">
                                {{ categoriesDeleting[index] ? 'Deleting..' : 'Delete' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import NoImage from '../../assets/no-image.png';
import { onMounted, reactive, ref, watch } from 'vue';
import { useStore } from 'vuex';
import LoadingOverlay from '../LoadingOverlay.vue';

const store = useStore();

const categories = ref(null);

const newCategories = ref(null);

const categoriesLoading = ref(false);
const categoriesSaving = reactive({});
const categoriesDeleting = reactive({});

const categoryImage = (id, imageUrl) => {
    if (!imageUrl) return { backgroundImage: `url('${NoImage}')` };

    if (typeof imageUrl === 'object') {
        const urlImg = URL.createObjectURL(imageUrl);
        return { backgroundImage: `url('${urlImg}')` };
    } else {
        const url = `https://my-shop-app.pockethost.io/api/files/available_categories/${id}/${imageUrl}`;
        return { backgroundImage: `url('${url}')` };
    }
};

watch(categories, (value) => {
    if (value) newCategories.value = JSON.parse(JSON.stringify(value));
});

const handleImageChange = (e, index) => {
    const file = e.target.files[0];

    if (!file) return (newCategories.value[index].image = ''); // set to no img

    const reader = new FileReader();
    reader.onload = () => {
        newCategories.value[index].image = file;
    };
    reader.readAsDataURL(file);
};

const addNewCategory = () => {
    newCategories.value.unshift({ name: 'New Category', link: 'category-link', image: '', new: true });
};

const saveCategory = async (categoryId, index) => {
    const data = new FormData();

    Object.keys(newCategories.value[index]).forEach((key) => {
        if (key === 'image' || key === 'name' || key === 'link') data.append(key, newCategories.value[index][key]);
    });

    try {
        categoriesSaving[index] = true;
        if (newCategories.value[index].new) {
            await store.dispatch('addCategory', data);
            delete newCategories.value[index].new;
        } else {
            await store.dispatch('updateCategory', { categoryId, data });
        }
    } catch (error) {
        console.log(error);
    } finally {
        categoriesSaving[index] = false;
    }
};

const deleteCategory = async (categoryId, index) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this category?');

    if (!isConfirmed) return;

    try {
        categoriesDeleting[index] = true;

        await store.dispatch('deleteCategory', categoryId);
        getAvailableCategories();
    } catch (error) {
        console.log(error);
    } finally {
        categoriesDeleting[index] = false;
    }
};

const getAvailableCategories = async () => {
    try {
        categoriesLoading.value = true;
        const response = await store.dispatch('getAvailableCategories');
        categories.value = response;
    } catch (error) {
        console.log(error);
    } finally {
        categoriesLoading.value = false;
    }
};

onMounted(() => {
    getAvailableCategories();
});
</script>

<style scoped>
.manage-categories-wrapper {
    position: relative;
    height: 100%;
    background-color: #f6faff;
}

.manage-categories {
    padding: 25px;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.categories-wrap {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.heading {
    font-size: 30px;
    font-weight: 600;
}

.categories-data {
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 3px 5px #0000000f;
    padding: 25px;
    overflow: auto;
}

.category-image {
    min-height: 75px;
    min-width: 75px;
    border-radius: 5px;
    position: relative;
}

.single-category {
    display: grid;
    grid-template-columns: 75px 300px 200px 200px;
    align-items: center;
}

.single-category > div:not(.category-image-heading, .category-image-block) {
    padding: 10px 30px;
}

.category-headings .category-image-heading {
    padding: 10px 0px;
    min-height: initial;
    min-width: initial;
}

.category-name {
    font-size: 18px;
    font-weight: 500;
}

.divider {
    background-color: rgba(0, 0, 0, 0.082);
    height: 1px;
    margin: 10px 0;
}

.link-underline {
    text-decoration: 1px underline transparent;
    transition: 0.2s;
}
.link-underline:hover {
    text-decoration-color: inherit;
}
.category-headings {
    font-weight: 500;
}

.editable {
    border: none;
    outline: none;
    padding: 0;
}

.add-new-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    width: fit-content;
    cursor: pointer;
    margin: 15px 0 25px 0;
}

.add-new-wrap:hover i {
    color: #0059ff;
}

.add-new-wrap i {
    font-size: 30px;
    color: #0050e6;
    transition: 0.2s;
}

/* img */

.category-image-label {
    display: flex;
    flex-direction: column;

    max-width: 200px;

    cursor: pointer;
}

.category-image-label:hover .category-image-overlay {
    opacity: 1;
}

.category-image-overlay {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: 0.3s;
    font-size: 36px;
    color: white;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.212);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
}

.hidden {
    display: none;
}

.category-actions-wrap {
    display: flex;
    gap: 10px;
}

.button-main {
    padding: 3px 10px;
}

.save-button {
    background-color: #004ad3;
}
.save-button:hover {
    background-color: #0058fc;
}
.delete-button {
    background-color: rgb(214, 0, 0);
}
.delete-button:hover {
    background-color: rgb(255, 0, 0);
}
</style>
