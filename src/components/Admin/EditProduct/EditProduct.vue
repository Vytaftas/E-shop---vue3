<template>
    <div v-if="product" class="product-wrap">
        <div class="heading-wrap">
            <h3 class="heading">
                Manage Product <span class="product-id">(ID: {{ product.id }})</span>
            </h3>
            <button class="product-update-button button-main">Update</button>
        </div>

        <form class="main-product-form">
            <div class="top">
                <div class="left-side">
                    <div class="product-data-wrap">
                        <EditDataInputs
                            :productData="{
                                name: formData.name,
                                price: formData.price,
                                discount_price: formData.discount_price,
                                SKU: formData.SKU,
                                description: formData.description,
                            }"
                            :product="product"
                            @data-change="handleDataInputsChange"
                        />
                    </div>

                    <div class="product-meta-wrap">
                        <EditMeta :meta="formData.meta_data" :product="product" @meta-change="formData.meta_data['value'] = $event" />
                    </div>
                </div>
                <!-- right -->
                <div class="right-side">
                    <!--  -->
                    <EditImages :image="formData.image" :gallery="formData.gallery_images" :product="product" />

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
            </div>
            <div class="bottom">
                <div class="product-reviews-wrap">
                    <h4 class="section-heading">Product Reviews</h4>
                    <EditReviews
                        :reviews="formData.product_ratings"
                        :product="product"
                        :ratingsPerPage="ratingsPerPage"
                        @reviews-updated="getProduct"
                    />
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

// import useProductImage from '../../../hooks/useProductImage';

import EditMeta from './EditMeta.vue';
import EditDataInputs from './EditDataInputs.vue';
import EditReviews from './EditReviews.vue';
import EditImages from './EditImages.vue';
import arraysAreEqual from '../../../helpers/arraysAreEqual';

const store = useStore();
const route = useRoute();

const productId = computed(() => route.params.id);
const product = ref(null);
const productLoading = ref(false);

const ratingsPerPage = ref(3);

//

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

const handleDataInputsChange = (data) => {
    for (let key of Object.keys(data)) {
        if (formData[key]) formData[key] = data[key];
    }
};

// const checkIfChanged = (key) => {
//     if (key === 'price' || key === 'discount_price') formData[key].value = formData[key].value.replace(/[^0-9.]/g, '');

//     return (formData[key].changed = formData[key].value !== product.value[key]);
// };

//
// const deletingReview = ref(false);

// const ratingUpdatedMessage = ref('');
// const ratingButtonLoadingStates = reactive({});

// const currentRatingsSlide = ref(0);

// const totalRatingsPages = computed(() => Math.floor(formData.product_ratings.value.length / ratingsPerPage.value));

// const isInRatingLoadingState = (id) => ratingButtonLoadingStates[id];

// const handleChangeRatingsPage = (val) => {
//     if (currentRatingsSlide.value === val - 1) return;
//     currentRatingsSlide.value = val - 1;
// };

// const handleColorChange = (e, key, index) => {
//     formData.meta_data.value[key].data[index].value = e.target.value;

//     if (!product.value.meta_data[key] || !product.value.meta_data[key].data[index]) {
//         formData.meta_data.changed = true;
//     } else {
//         formData.meta_data.changed = e.target.value !== product.value.meta_data[key].data[index].value;
//     }
// };
// const handleMetaNameChange = (e, key, index) => {
//     formData.meta_data.value[key].data[index].name = e.target.value;

//     if (!formData.meta_data.value[key].useColors) formData.meta_data.value[key].data[index].value = e.target.value;

//     if (!product.value.meta_data[key] || !product.value.meta_data[key].data[index]) {
//         formData.meta_data.changed = true;
//     } else {
//         formData.meta_data.changed = e.target.value !== product.value.meta_data[key].data[index].name;
//     }
// };
// const addNewMetaBlock = () => {
//     const isDuplicateKey = (keyName, count = 1) => {
//         const name = keyName + '-' + count;

//         const exists = formData.meta_data.value.some((item) => item.name === keyName + '-' + count);

//         if (exists) {
//             count++;
//             return isDuplicateKey(keyName, count);
//         }

//         return name;
//     };

//     const newKeyName = isDuplicateKey('new-meta');
//     // const valueKey = Object.keys(formData.meta_data.value).some((item) => item === 'new-value');
//     formData.meta_data.value.push({ name: newKeyName, data: [], useColors: false });
// };

// const formattedDate = (originalDate) => {
//     const date = new Date(originalDate);
//     return `${date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
// };

// const productMainImage = computed(() => {
//     if (formData.image.value === product.value.image) return useProductImage(product.value.id, product.value.image);
//     if (formData.image.value) {
//         return formData.image.value.indexOf('http')
//             ? { backgroundImage: `url('${formData.image.value}')` }
//             : useProductImage(product.value.id, product.value.image);
//     } else {
//         return useProductImage(product.value.id, product.value.image);
//     }
// });

//-- Image upload functionality

// const handleImageChange = (e, type) => {
//     const file = e.target.files[0];

//     if (!file) return resetImage(type);

//     const reader = new FileReader();
//     reader.onload = (e) => {
//         if (type === 'main') {
//             formData.image.value = e.target.result;
//             checkIfChanged('image');
//         } else {
//             formData.gallery_images.value = [...formData.gallery_images.value, e.target.result];
//             resetImage(type);
//             formData.gallery_images.changed = !arraysAreEqual(product.value.gallery_images, formData.gallery_images.value);
//         }
//     };
//     reader.readAsDataURL(file);
// };

// const resetImage = (type) => {
//     if (type === 'main') {
//         fileInput.value.value = '';
//         formData.image.value = product.value.image ? product.value.image : '';
//         checkIfChanged('image');
//     } else {
//         galleryFileInput.value.value = '';
//         formData.gallery_images.changed = !arraysAreEqual(product.value.gallery_images, formData.gallery_images.value);
//     }
// };

// const handleRemoveGalleryImage = (image) => {
//     if (!formData.gallery_images.value.length) return;

//     formData.gallery_images.value = formData.gallery_images.value.filter((item) => item !== image);

//     const newImages = formData.gallery_images.value.filter((item) => !product.value.gallery_images.includes(item)); //images to add
//     const originalImages = formData.gallery_images.value.filter((item) => product.value.gallery_images.includes(item));

//     const isTheSame = arraysAreEqual(originalImages, product.value.gallery_images); // use to upload changed existing images

//     formData.gallery_images.changed = !arraysAreEqual(product.value.gallery_images, formData.gallery_images.value);
// };

const handleRemoveCategory = (category) => {
    if (!formData.categories.value.length) return;

    formData.categories.value = formData.categories.value.filter((item) => item.id !== category.id);

    const newCategories = formData.categories.value.filter((item) => !product.value.expand.categories.includes(item)); //images to add
    const originalCategories = formData.categories.value.filter((item) => product.value.expand.categories.includes(item));

    const isTheSame = arraysAreEqual(originalCategories, product.value.expand.categories); // use to upload changed existing images

    formData.categories.changed = !arraysAreEqual(product.value.expand.categories, formData.categories.value);
};

// const handleRemoveRating = async (ratingId) => {
//     // SHOW ALERT
//     if (!formData.product_ratings.value.length) return;

//     if (window.confirm('Are you sure you want to delete this review?')) {
//         try {
//             deletingReview.value = true;
//             await store.dispatch('deleteReview', ratingId);

//             getProduct();
//         } catch (error) {
//             console.log(error);
//         } finally {
//             deletingReview.value = false;
//         }
//     }
// };

// const handleRatingUpdate = async (ratingId, data) => {
//     let newData = {};

//     const currentRating = product.value.expand['product_ratings(product_id)'].filter((rating) => rating.id === ratingId)[0];

//     for (let key in data) {
//         if (data[key] !== currentRating[key]) {
//             newData = { ...newData, [key]: data[key] };
//         }
//     }

//     if (!Object.keys(newData).length) return console.log('nothing changed'); // NOTHING CHANGED

//     if (!ratingButtonLoadingStates[ratingId]) {
//         ratingButtonLoadingStates[ratingId] = false;
//     }

//     try {
//         // loading.value = true;
//         ratingButtonLoadingStates[ratingId] = true;
//         await store.dispatch('updateReview', {
//             ratingId,
//             data: newData,
//         });

//         ratingUpdatedMessage.value = 'Updated Successfully';
//         setTimeout(() => {
//             ratingUpdatedMessage.value = '';
//         }, 3000);
//     } catch (error) {
//         console.log(error);
//         ratingUpdatedMessage.value = 'Failed to Update';
//         setTimeout(() => {
//             ratingUpdatedMessage.value = '';
//         }, 3000);
//     } finally {
//         ratingButtonLoadingStates[ratingId] = false;
//     }
// };

// const singleGalleryImage = (image) => {
//     const imageInDB = product.value.gallery_images.indexOf(image);

//     if (imageInDB === -1) {
//         return { backgroundImage: `url('${image}')` };
//     } else {
//         return useProductImage(product.value.id, image);
//     }
// };

const getProduct = async () => {
    try {
        productLoading.value = true;
        const response = await store.dispatch('getProduct', productId.value);

        product.value = response;

        console.log(response);

        const responseCopy = JSON.parse(JSON.stringify(response));

        for (let key in responseCopy) {
            if (responseCopy[key].categories || responseCopy[key]['product_ratings(product_id)']) {
                if (formData.categories) formData.categories.value = responseCopy[key].categories;
                if (formData.product_ratings) {
                    if (responseCopy[key]['product_ratings(product_id)'])
                        responseCopy[key]['product_ratings(product_id)'].sort((item1, item2) => new Date(item2.created) - new Date(item1.created));
                    formData.product_ratings.value = responseCopy[key]['product_ratings(product_id)'];
                }
            } else {
                if (formData.hasOwnProperty(key) && key !== 'categories') {
                    formData[key].value = responseCopy[key];
                }
            }
        }
        console.log(formData);
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
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.top {
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

/* Image */

/* Categories */
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

/* Ratings */
/* .product-ratings-slider {
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
} */

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

/*   */

.left-side {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.input-label {
    font-weight: 500;
    margin-bottom: 3px;
}

h4,
.section-heading {
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
</style>
