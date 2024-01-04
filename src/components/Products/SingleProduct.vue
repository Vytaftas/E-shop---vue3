<template>
    <div v-if="Object.keys(product).length" class="single-product-wrap">
        <div class="product-content-wrap">
            <div class="product-image-gallery">
                <div class="product-gallery-main-image centered-background" :style="useProductImage(product.id, images[currentImage])"></div>
                <div v-if="product.gallery_images.length" class="product-gallery-images">
                    <div
                        class="product-gallery-image centered-background"
                        v-for="(galleryImage, index) of images"
                        :key="galleryImage"
                        :style="useProductImage(product.id, galleryImage)"
                        :class="{ selected: galleryImage === images[currentImage] }"
                        @click="currentImage = index"
                    ></div>
                </div>
            </div>

            <div class="product-info">
                <h2 class="product-name">{{ product.name }}</h2>

                <div class="single-product-rating">
                    <ProductRatingDecimal :rating="computedRating?.rating" />
                    <span
                        >{{ computedRating?.rating ? computedRating?.rating.toFixed(2) : 0 }} |
                        {{ computedRating?.ratingsAmount ? computedRating?.ratingsAmount : 0 }} reviews</span
                    >
                </div>

                <span class="meta-data">
                    {{ product.meta_data?.colors }}
                    {{ product.meta_data?.sizes }}
                </span>

                <p class="product-price-wrap" :class="{ discounted: product.discount_price }">
                    <span class="product-price">€{{ product.price }}</span>
                    <span class="product-price-discounted" v-if="product.discount_price">€{{ product.discount_price }}</span>
                </p>

                <p class="product-description" v-html="product.description"></p>

                <div class="divider"></div>

                <div class="product-data">
                    <div v-if="product.expand.categories.length" class="product-categories">
                        <p><strong>Category: </strong></p>
                        <div class="single-category" v-for="(category, index) of product.expand.categories" :key="category.id">
                            <router-link class="category-link" :to="'/shop/categories/' + category.link">{{ category.name }}</router-link>
                            <span v-if="index !== product.expand.categories.length - 1">,</span>
                        </div>
                    </div>

                    <p><strong>SKU: </strong>{{ product.SKU ? product.SKU : 'N/A' }}</p>
                </div>

                <div class="divider"></div>

                <div class="add-to-cart-wrap">
                    <QuantityButtons
                        :product="product"
                        :quantity="quantity"
                        @increased="handleQuantityChange('+')"
                        @decreased="handleQuantityChange('-')"
                    />

                    <AddToCartButton :product="product" :quantity="quantity" />
                </div>
            </div>
        </div>
        <div class="product-additional-info"></div>

        <RatingsAndReviews :resetReviewPage="resetReviewPage" @new-review="emit('new-review')" :product="product" :computedRating="computedRating" />

        <SimilarProducts class="similar-products" @product-change="handleProductChange" :product="SimilarProductsProduct" />
    </div>
</template>

<script setup>
import useProductImage from '../../hooks/useProductImage';
import QuantityButtons from './QuantityButtons.vue';
import AddToCartButton from './AddToCartButton.vue';
import SimilarProducts from './SimilarProducts.vue';
import RatingsAndReviews from './RatingsAndReviews.vue';
import ProductRatingDecimal from './ProductRatingDecimal.vue';
import { computed, onMounted, ref, watch } from 'vue';

const quantity = ref(1);

const props = defineProps({
    product: { default: {} },
    productLoading: { default: true },
    computedRating: { default: null },
});

const emit = defineEmits(['new-review']);

const images = computed(() => [props.product.image, ...props.product.gallery_images]);
const currentImage = ref(0);
const resetReviewPage = ref(false);

const SimilarProductsProduct = ref({});

watch(
    () => props.product,
    (val) => {
        SimilarProductsProduct.value = val;
    },
    { deep: true, immediate: true }
);

const handleQuantityChange = (val) => {
    if (val === '+') {
        quantity.value = quantity.value + 1;
    } else {
        if (quantity.value <= 1) return;
        quantity.value = quantity.value - 1;
    }
};

const handleProductChange = () => {
    currentImage.value = 0;
    resetReviewPage.value = !resetReviewPage.value;
    window.scrollTo(0, 0);
};

onMounted(async () => {});
</script>

<style scoped>
.product-content-wrap {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}
.product-price-wrap {
    color: black;
    font-weight: 600;
    display: flex;
    gap: 10px;
    align-items: center;
    font-size: 20px;
}

.product-price-wrap.discounted .product-price {
    color: gray;
    text-decoration: line-through;
    font-weight: 400;
}

.product-image-gallery {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.product-gallery-main-image {
    width: 100%;
    min-height: 450px;
}

.product-gallery-images {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 5px;
    padding-bottom: 1px;
}

.product-gallery-image {
    outline: 2px solid transparent;
    min-height: 160px;
    transition: 0.2s;
    cursor: pointer;
    opacity: 0.7;
}

.product-gallery-image:hover,
.product-gallery-image.selected {
    outline: 1px solid black;
    opacity: 1;
}

.product-info {
    padding: 0 25px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.product-name {
    font-size: 40px;
    font-weight: 600;
    line-height: 1em;
}

.add-to-cart-wrap {
    display: flex;
    gap: 20px;
    align-items: center;
}

.product-data {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.product-categories {
    display: flex;
    gap: 5px;
}

.single-category {
    /* color: gray; */
    transition: 0.2s;
    text-decoration: underline;
    text-decoration-color: transparent;
}

.single-category:hover {
    text-decoration-color: inherit;
}

.divider {
    height: 1px;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.096);
    margin: 10px 0;
}

.single-product-rating {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
}

.category-link {
    color: rgba(0, 0, 0, 0.658);
}

.similar-products {
    margin-top: 25px;
}
</style>
