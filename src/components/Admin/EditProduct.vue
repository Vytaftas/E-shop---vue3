<template>
    <div v-if="product" class="product-wrap">
        <div class="heading-wrap">
            <h3 class="heading">
                Manage Product <span class="product-id">(ID: {{ product.id }})</span>
            </h3>
            <button class="product-update-button button-main">Update</button>
        </div>

        <form class="main-product-form">
            <!-- Product name, description, etc.. -->

            <div class="left-side">
                <div class="product-data-inputs">
                    <div class="single-input-wrap">
                        <label class="input-label" for="name">Name</label>
                        <input type="text" id="name" v-model="formData.name.value" @input="checkIfChanged('name')" />
                    </div>

                    <div class="flex-row">
                        <div class="single-input-wrap">
                            <label class="input-label" for="price">Price</label>
                            <input type="text" id="price" v-model="formData.price.value" @input="checkIfChanged('price')" />
                        </div>
                        <div class="single-input-wrap">
                            <label class="input-label" for="discount-price">Discount Price</label>
                            <input
                                type="text"
                                id="discount-price"
                                v-model="formData.discount_price.value"
                                @input="checkIfChanged('discount_price')"
                            />
                        </div>
                    </div>
                    <div class="flex-row">
                        <div class="single-input-wrap">
                            <label class="input-label" for="sku">SKU</label>
                            <input type="text" id="sku" v-model="formData.SKU.value" @input="checkIfChanged('SKU')" />
                        </div>
                    </div>

                    <div class="single-input-wrap">
                        <label class="input-label" for="description">Description</label>
                        <Editor
                            id="description"
                            api-key="qdcud7bnxxiz7gzo7ceg2uvac0blnhua2pr3ibi1tb4gkym2"
                            :init="{
                                toolbar_mode: 'sliding',
                                menubar: 'edit insert view format table tools',
                                plugins:
                                    'mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents  powerpaste a11ychecker typography inlinecss',
                                toolbar:
                                    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                                onchange_callback: checkIfChanged('description'),
                            }"
                            v-model="formData.description.value"
                        />
                    </div>
                </div>

                <!-- Change v-if -->
                {{ formData.meta_data }}
                <div class="single-input-wrap">
                    <h4>Product Meta</h4>
                    <div class="product-meta-data" v-if="formData.meta_data.value">
                        <div class="single-input-wrap" v-for="(value, key) of formData.meta_data.value" :key="key">
                            <p class="meta-name input-label">{{ key.charAt(0).toUpperCase() + key.slice(1) }}</p>

                            <div class="meta-wrap-container">
                                <div class="single-meta-wrap" v-for="(metaItem, index) of value" :key="metaItem.name + '-' + metaItem.value">
                                    <div v-if="key === 'color'" class="color-select-input-wrap">
                                        <input
                                            type="text"
                                            :value="formData.meta_data.value[key][index].name"
                                            @change="handleColorNameChange($event, key, index)"
                                        />
                                        <label :for="'color-select-' + index">
                                            <div class="color-block" :style="{ backgroundColor: formData.meta_data.value[key][index].value }"></div>
                                        </label>
                                        <input
                                            class="color-input"
                                            type="color"
                                            name="color-select"
                                            :id="'color-select-' + index"
                                            :value="formData.meta_data.value[key][index].value"
                                            @change="handleColorChange($event, key, index)"
                                        />
                                        <!-- :value="formData.meta_data[key].value[index].value" -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Product reviews -->
                <div class="single-input-wrap">
                    <h4>Product Reviews</h4>
                    <div class="product-ratings-slider">
                        <div class="product-ratings-wrap" :style="{ transform: `translateX(${currentRatingsSlide * -100}%)` }">
                            <div
                                class="single-rating"
                                v-for="(rating, index) of formData.product_ratings.value"
                                :key="rating"
                                :style="{ transform: `translateX(${index * 100}%)` }"
                            >
                                <div class="product-rating-form-wrap">
                                    <ProductRatingForm
                                        :data="{
                                            product_id: product.id,
                                            rating: rating.star_rating,
                                            title: rating.rating_heading,
                                            content: rating.rating_text,
                                        }"
                                        :userData="{ name: rating.expand.user_id.name, date: formattedDate(rating.created) }"
                                        :ratingUpdatedMessage="ratingUpdatedMessage"
                                        @update-review="(data) => handleRatingUpdate(rating.id, data)"
                                        @delete-review="handleRemoveRating(rating.id)"
                                    />
                                    <LoadingOverlay background="#00000020" v-if="deletingReview || isInRatingLoadingState(rating.id)" />
                                </div>
                            </div>
                        </div>
                        <Pagination
                            class="pagination"
                            :paginationData="{ page: currentRatingsSlide + 1, totalPages: totalRatingsPages }"
                            @page-change="handleChangeRatingsPage"
                        />
                    </div>
                </div>
            </div>

            <!--  -->

            <div class="right-side">
                <div class="single-input-wrap">
                    <span class="input-label">Product Image</span>
                    <label for="product-image" class="product-image-label">
                        <div class="product-image centered-background" :style="productMainImage">
                            <div class="product-image-overlay">
                                <i class="fa-solid fa-folder-plus product-image-icon"></i>
                            </div>
                        </div>
                    </label>
                    <input
                        ref="fileInput"
                        type="file"
                        name="product-image"
                        id="product-image"
                        class="hidden"
                        @change="(e) => handleImageChange(e, 'main')"
                    />
                    <button class="reset-image-button" @click.prevent="resetImage('main')">Reset Image</button>
                </div>

                <div class="single-input-wrap">
                    <span class="input-label">Gallery Images</span>
                    <div class="gallery-images-wrap" v-if="formData.gallery_images.value">
                        <div
                            class="single-gallery-image centered-background"
                            @click.prevent="handleRemoveGalleryImage(image)"
                            v-for="image of formData.gallery_images.value"
                            :key="image"
                            :style="singleGalleryImage(image)"
                        >
                            <div class="single-gallery-image-overlay">
                                <i class="fa-solid fa-circle-xmark single-gallery-image-icon"></i>
                            </div>
                        </div>
                        <label for="additional-gallery-image" class="product-image-label">
                            <div class="additional-gallery-image">
                                <i class="fa-solid fa-folder-plus additional-gallery-image-icon"></i>
                            </div>
                        </label>
                        <input
                            ref="galleryFileInput"
                            type="file"
                            name="additional-gallery-image"
                            id="additional-gallery-image"
                            class="hidden"
                            @change="(e) => handleImageChange(e, 'notmain')"
                        />
                        <!--  -->
                    </div>
                </div>

                <!-- ///--- GET AVAILABLE CATEGORIES, USE SELECT TO ADD MORE -->
                <div class="single-input-wrap">
                    <span class="input-label">Categories</span>
                    <div class="categories-wrap">
                        <div class="single-category" v-for="category of formData.categories.value" :key="category">
                            <div class="category-button">
                                <span class="category-name">{{ category.name }}</span>
                                <i class="fa-solid fa-xmark category-remove-icon" @click.prevent="handleRemoveCategory(category)"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <!-- <p class="sku">{{ product.SKU }}</p>
        <p class="name">{{ product.name }}</p> -->
        <!-- <p class="categories">{{ product.expand.categories }}</p> -->
        <!-- <p class="product-ratings">{{ product.expand['product_ratings(product_id)'] }}</p> -->
        <!-- <p class="description">{{ product.description }}</p> -->
        <!-- <p class="discount-price">{{ product.discount_price }}</p> -->
        <!-- <p class="price">{{ product.price }}</p> -->
        <!-- <p class="image">{{ product.image }}</p> -->
        <!-- <p class="meta-data">{{ product.gallery_images }}</p> -->
        <p class="meta-data">{{ product.meta_data }}</p>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import Editor from '@tinymce/tinymce-vue';
import useProductImage from '../../hooks/useProductImage';
import ProductRatingForm from '../Forms/ProductRatingForm.vue';
import LoadingOverlay from '../LoadingOverlay.vue';
import Pagination from '../Pagination.vue';

const store = useStore();
const route = useRoute();
const productId = computed(() => route.params.id);

const product = ref(null);
const productLoading = ref(false);

const fileInput = ref(null);
const galleryFileInput = ref(null);

const deletingReview = ref(false);

const ratingUpdatedMessage = ref('');
const ratingButtonLoadingStates = reactive({});

const currentRatingsSlide = ref(0);

const ratingsPerPage = ref(2);
const totalRatingsPages = computed(() => Math.floor(formData.product_ratings.value.length / ratingsPerPage.value));

const isInRatingLoadingState = (id) => ratingButtonLoadingStates[id];

const formData = reactive({
    name: { value: '', changed: false },
    SKU: { value: '', changed: false },
    description: { value: '', changed: false },
    price: { value: '', changed: false },
    discount_price: { value: '', changed: false },
    image: { value: '', changed: false },
    gallery_images: { value: [], changed: false },
    categories: { value: [], changed: false },
    product_ratings: { value: [], changed: false },
    meta_data: { value: [], changed: false },
});

const handleChangeRatingsPage = (val) => {
    if (currentRatingsSlide.value === val - 1) return;
    currentRatingsSlide.value = val - 1;
};

const handleColorChange = (e, key, index) => {
    formData.meta_data.value[key][index].value = e.target.value;
    formData.meta_data.changed = e.target.value !== product.value.meta_data[key][index].value;
};
const handleColorNameChange = (e, key, index) => {
    formData.meta_data.value[key][index].name = e.target.value;
    formData.meta_data.changed = e.target.value !== product.value.meta_data[key][index].name;
};

const checkIfChanged = (key) => {
    if (key === 'price' || key === 'discount_price') formData[key].value = formData[key].value.replace(/[^0-9.]/g, '');

    return (formData[key].changed = formData[key].value !== product.value[key]);
};

const formattedDate = (originalDate) => {
    const date = new Date(originalDate);
    return `${date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
};

const productMainImage = computed(() => {
    if (formData.image.value === product.value.image) return useProductImage(product.value.id, product.value.image);
    if (formData.image.value) {
        return formData.image.value.indexOf('http')
            ? { backgroundImage: `url('${formData.image.value}')` }
            : useProductImage(product.value.id, product.value.image);
    } else {
        return useProductImage(product.value.id, product.value.image);
    }
});

///--- Image upload functionality

const handleImageChange = (e, type) => {
    const file = e.target.files[0];

    if (!file) return resetImage(type);

    const reader = new FileReader();
    reader.onload = (e) => {
        if (type === 'main') {
            formData.image.value = e.target.result;
            checkIfChanged('image');
        } else {
            formData.gallery_images.value = [...formData.gallery_images.value, e.target.result];
            resetImage(type);
            formData.gallery_images.changed = !arraysAreEqual(product.value.gallery_images, formData.gallery_images.value);
        }
    };
    reader.readAsDataURL(file);
};

const resetImage = (type) => {
    if (type === 'main') {
        fileInput.value.value = '';
        formData.image.value = product.value.image ? product.value.image : '';
        checkIfChanged('image');
    } else {
        galleryFileInput.value.value = '';
        formData.gallery_images.changed = !arraysAreEqual(product.value.gallery_images, formData.gallery_images.value);
    }
};

const handleRemoveGalleryImage = (image) => {
    if (!formData.gallery_images.value.length) return;

    formData.gallery_images.value = formData.gallery_images.value.filter((item) => item !== image);

    const newImages = formData.gallery_images.value.filter((item) => !product.value.gallery_images.includes(item)); //images to add
    const originalImages = formData.gallery_images.value.filter((item) => product.value.gallery_images.includes(item));

    const isTheSame = arraysAreEqual(originalImages, product.value.gallery_images); // use to upload changed existing images

    formData.gallery_images.changed = !arraysAreEqual(product.value.gallery_images, formData.gallery_images.value);
};

const handleRemoveCategory = (category) => {
    if (!formData.categories.value.length) return;

    formData.categories.value = formData.categories.value.filter((item) => item.id !== category.id);

    const newCategories = formData.categories.value.filter((item) => !product.value.expand.categories.includes(item)); //images to add
    const originalCategories = formData.categories.value.filter((item) => product.value.expand.categories.includes(item));

    const isTheSame = arraysAreEqual(originalCategories, product.value.expand.categories); // use to upload changed existing images

    formData.categories.changed = !arraysAreEqual(product.value.expand.categories, formData.categories.value);
};

const handleRemoveRating = async (ratingId) => {
    // SHOW ALERT
    if (!formData.product_ratings.value.length) return;

    if (window.confirm('Are you sure you want to delete this review?')) {
        try {
            deletingReview.value = true;
            await store.dispatch('deleteReview', ratingId);

            getProduct();
        } catch (error) {
            console.log(error);
        } finally {
            deletingReview.value = false;
        }
    }
};

const handleRatingUpdate = async (ratingId, data) => {
    let newData = {};

    const currentRating = product.value.expand['product_ratings(product_id)'].filter((rating) => rating.id === ratingId)[0];

    for (let key in data) {
        if (data[key] !== currentRating[key]) {
            newData = { ...newData, [key]: data[key] };
        }
    }

    if (!Object.keys(newData).length) return console.log('nothing changed'); // NOTHING CHANGED

    if (!ratingButtonLoadingStates[ratingId]) {
        ratingButtonLoadingStates[ratingId] = false;
    }

    try {
        // loading.value = true;
        ratingButtonLoadingStates[ratingId] = true;
        await store.dispatch('updateReview', {
            ratingId,
            data: newData,
        });

        ratingUpdatedMessage.value = 'Updated Successfully';
        setTimeout(() => {
            ratingUpdatedMessage.value = '';
        }, 3000);
    } catch (error) {
        console.log(error);
        ratingUpdatedMessage.value = 'Failed to Update';
        setTimeout(() => {
            ratingUpdatedMessage.value = '';
        }, 3000);
    } finally {
        ratingButtonLoadingStates[ratingId] = false;
    }
};

const singleGalleryImage = (image) => {
    const imageInDB = product.value.gallery_images.indexOf(image);

    if (imageInDB === -1) {
        return { backgroundImage: `url('${image}')` };
    } else {
        return useProductImage(product.value.id, image);
    }
};

const arraysAreEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }

    return true;
};

const getProduct = async () => {
    try {
        productLoading.value = true;
        const response = await store.dispatch('getProduct', productId.value);

        product.value = response;

        const responseCopy = JSON.parse(JSON.stringify(response));

        for (let key in responseCopy) {
            if (responseCopy[key].categories || responseCopy[key]['product_ratings(product_id)']) {
                if (formData.categories) formData.categories.value = responseCopy[key].categories;
                if (formData.product_ratings) {
                    responseCopy[key]['product_ratings(product_id)'].sort((item1, item2) => new Date(item2.created) - new Date(item1.created));
                    formData.product_ratings.value = responseCopy[key]['product_ratings(product_id)'];
                }
            } else {
                if (formData.hasOwnProperty(key) && key !== 'categories') {
                    formData[key].value = responseCopy[key];
                }
            }
        }
    } catch (error) {
        console.log(error);
    } finally {
        productLoading.value = false;
    }
};

onMounted(async () => {
    getProduct();
});
</script>

<style scoped>
.main-product-form {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 25px;
}

.product-wrap {
    background-color: #f6faff;
    padding: 25px;
}

.single-input-wrap {
    display: flex;
    flex-direction: column;
}

.product-image {
    height: 400px;
    width: 400px;
    border-radius: 5px;
    position: relative;
}

.product-image-label {
    display: flex;
    flex-direction: column;

    max-width: 200px;

    cursor: pointer;
}

.product-image-label:hover .product-image-overlay {
    opacity: 1;
}

.product-image-overlay {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: 0.3s;
    font-size: 50px;
    color: white;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.212);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
}

/*  */

.gallery-images-wrap {
    display: grid;
    grid-template-columns: repeat(3, calc(100px - 10px / 3));
    gap: 5px;
}
.single-gallery-image {
    position: relative;
    height: 96.65px;
    cursor: pointer;
    border-radius: 5px;
}

.single-gallery-image:hover .single-gallery-image-overlay {
    opacity: 1;
}

.single-gallery-image-overlay {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: 0.3s;
    font-size: 30px;
    color: white;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.212);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
}

.additional-gallery-image {
    transition: 0.3s;
    font-size: 30px;
    color: white;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.112);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 96.65px;
    border-radius: 5px;
}
.additional-gallery-image:hover {
    background-color: rgba(0, 0, 0, 0.212);
}

.hidden {
    display: none;
}
/*  */
.categories-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
}

.single-category {
    background-color: lightgray;
    color: black;
    display: flex;
    justify-content: center;
    width: fit-content;
    padding: 3px 10px;
    padding-right: 24px;
    position: relative;
    border-radius: 10px;
    font-size: 14px;
}

.category-button {
    display: flex;
    justify-content: center;
    align-items: center;
}

.category-remove-icon {
    cursor: pointer;
    position: absolute;
    right: 8px;
    font-size: 12px;
    top: calc(50% + 0.5px);
    transform: translateY(-50%);
}

/*  */
.product-ratings-slider {
    overflow: hidden;
}
.product-ratings-wrap {
    display: flex;
    position: relative;
    min-height: 600px;
    transition: 0.5s;
}
.product-rating-form-wrap {
}

.single-rating {
    position: absolute;
    left: 0;
    top: 0;
    width: calc(100% / 2);
    padding: 0 10px;
}

.single-rating:nth-child(odd) {
    padding-left: 5px;
    padding-right: 10px;
}

.single-rating:nth-child(even) {
    padding-left: 10px;
    padding-right: 5px;
}

/*  */

.heading-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 35px;
}
.heading {
    font-size: 30px;
    font-weight: 600;
    line-height: 1em;
    position: relative;
}

.product-id {
    color: gray;
    font-size: 14px;
    line-height: 1em;
    position: absolute;
    left: 0;
    bottom: -10px;
    transform: translateY(100%);
    font-weight: 400;
}

/*  */

.left-side {
    display: flex;
    flex-direction: column;
    gap: 25px;
}
.product-data-inputs {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.left-side input {
    padding: 10px;
    outline: none;
    border: none;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    font-weight: 400;
    /* background-color: rgba(0, 110, 255, 0.144); */
    width: 100%;
    transition: 0.2s;
}

.left-side input:focus-visible {
    border: 1px solid black;
}

.input-label {
    font-weight: 500;
    margin-bottom: 3px;
}

.flex-row {
    display: flex;
    gap: 20px;
}

h4 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 10px;
}

.left-side form {
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.11);
}

.pagination {
    margin-top: 5px;
    margin-left: 5px;
}

.right-side {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.reset-image-button {
    margin-top: 10px;
    padding: 5px 20px;
    background-color: #0071ff;
    color: white;
    transition: 0.2s;
    border-radius: 3px;
}

.reset-image-button:hover {
    background-color: #0059ff;
}

/* Meta */
.product-meta-data {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.meta-name {
    font-weight: 600;
}

.meta-wrap-container {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.color-select-input-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: white;
    /* padding: 5px 10px; */
    max-width: 200px;
    box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.089);
    border-radius: 3px;
    position: relative;
}

.color-select-input-wrap input {
    padding: 0;
    background-color: transparent;
    border: none;
    border-radius: 0;
    outline: none;
    padding: 5px 10px;
}
/* .color-select-input-wrap input:not(.color-input) {
} */
.color-select-input-wrap input:focus-visible {
    border: none;
    outline: none;
}

.color-block {
    width: 16px;
    height: 16px;
    cursor: pointer;
    margin: 5px 10px;
}

.color-select-input-wrap .color-input {
    opacity: 0;
    visibility: hidden;
    position: absolute;
    left: 0;
    top: 0;
}
</style>
