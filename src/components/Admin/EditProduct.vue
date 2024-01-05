<template>
    <div v-if="product" class="product-wrap">
        <p class="id">{{ product.id }}</p>
        <pre>
            {{ formData }}

        </pre>

        {{ product.gallery_images }}

        <form>
            <div class="single-input-wrap">
                <span>Product Image</span>
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
                <button @click.prevent="resetImage('main')">reset image</button>
            </div>

            <div class="single-input-wrap">
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
                    <!--  -->
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
                <div class="categories-wrap">
                    <div class="single-category" v-for="category of formData.categories.value" :key="category">
                        <div class="category-button">
                            <span class="category-name">{{ category.name }}</span>
                            <i class="fa-solid fa-xmark category-remove-icon" @click.prevent="handleRemoveCategory(category)"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Remove by passing category to formdata -->
            <div class="single-input-wrap">
                <div class="product-ratings-wrap">
                    <div class="single-rating" v-for="rating of formData.product_ratings.value" :key="rating">
                        <div class="rating-button">
                            <span class="rating-heading">{{ rating.rating_heading }}</span>
                            <i class="fa-solid fa-xmark rating-remove-icon" @click.prevent="handleRemoveRating(rating)"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="single-input-wrap">
                <label for="name">Product Name</label>
                <input type="text" id="name" v-model="formData.name.value" @input="checkIfChanged('name')" />
            </div>
            <div class="single-input-wrap">
                <label for="sku">SKU</label>
                <input type="text" id="sku" v-model="formData.SKU.value" @input="checkIfChanged('SKU')" />
            </div>
            <div class="single-input-wrap">
                <label for="price">Price</label>
                <input type="number" id="price" v-model="formData.price.value" @input="checkIfChanged('price')" />
            </div>
            <div class="single-input-wrap">
                <label for="discount-price">Discount Price</label>
                <input type="number" id="discount-price" v-model="formData.discount_price.value" @input="checkIfChanged('discount_price')" />
            </div>
            <div class="single-input-wrap">
                <label for="description">Product Description</label>
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
        </form>
        <!-- <p class="sku">{{ product.SKU }}</p>
        <p class="name">{{ product.name }}</p> -->
        <!-- <p class="categories">{{ product.expand.categories }}</p> -->
        <p class="product-ratings">{{ product.expand['product_ratings(product_id)'] }}</p>
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

const store = useStore();
const route = useRoute();
const productId = computed(() => route.params.id);

const product = ref(null);
const productLoading = ref(false);

const fileInput = ref(null);
const galleryFileInput = ref(null);

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
});

const checkIfChanged = (key) => (formData[key].changed = formData[key].value !== product.value[key]);

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

const handleRemoveRating = (rating) => {
    if (!formData.product_ratings.value.length) return;

    formData.product_ratings.value = formData.product_ratings.value.filter((item) => item.id !== rating.id);

    const newCategories = formData.product_ratings.value.filter((item) => !product.value.expand['product_ratings(product_id)'].includes(item)); //images to add
    const originalCategories = formData.product_ratings.value.filter((item) => product.value.expand['product_ratings(product_id)'].includes(item));

    const isTheSame = arraysAreEqual(originalCategories, product.value.expand['product_ratings(product_id)']); // use to upload changed existing images

    formData.categories.changed = !arraysAreEqual(product.value.expand['product_ratings(product_id)'], formData.product_ratings.value);
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

onMounted(async () => {
    try {
        productLoading.value = true;
        const response = await store.dispatch('getProduct', productId.value);
        product.value = response;

        for (let key in response) {
            console.log(response[key]['product_ratings(product_id)']);
            if (response[key].categories || response[key]['product_ratings(product_id)']) {
                if (formData.categories) formData.categories.value = response[key].categories;
                if (formData.product_ratings) formData.product_ratings.value = response[key]['product_ratings(product_id)'];
            } else {
                if (formData.hasOwnProperty(key) && key !== 'categories') {
                    formData[key].value = response[key];
                }
            }
        }
    } catch (error) {
        console.log(error);
    } finally {
        productLoading.value = false;
    }
});
</script>

<style scoped>
.product-wrap {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.single-input-wrap {
    display: flex;
    flex-direction: column;
}

.product-image {
    height: 300px;
    width: 300px;
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
</style>
<!-- <div class="single-input-wrap">
    <div class="categories-wrap">
        <div class="single-category" v-for="category of product.expand.categories" :key="category">
        <div class="category-button">
            <span class="category-name">{{ category.name }}</span>
            <i class="fa-solid fa-xmark category-remove-icon"></i>
        </div>
        </div>
    </div>
</div> -->
