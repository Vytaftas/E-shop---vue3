<template>
    <div
        class="products-wrapper"
        :class="{ list: viewType === 'list' }"
        :style="{ gridTemplateColumns: viewType === 'list' ? 'repeat(1, 1fr)' : `repeat(${columns}, 1fr)` }"
        v-if="products.length"
    >
        <div class="product-card" v-for="product of products" :key="productKey(product).id">
            <div class="product-image" :style="useProductImage(productKey(product).id, productKey(product).image)"></div>

            <div class="product-content">
                <div v-if="showCategories" class="product-categories">
                    <div v-if="!productKey(product).expand?.categories" class="single-category" :style="{ visibility: 'hidden', opacity: 0 }">
                        <span>-</span>
                    </div>
                    <div v-else class="single-category" v-for="(category, index) of productKey(product).expand.categories" :key="category.id">
                        <router-link :to="`/shop/categories/${category.link}`">
                            <span>{{ category.name }}</span></router-link
                        >
                        <span v-if="index !== productKey(product).expand.categories.length - 1">,</span>
                    </div>
                </div>

                <router-link class="product-name" :to="`/shop/product/${productKey(product).id}`" @click="emit('push-single-product-page')">{{
                    productKey(product).name
                }}</router-link>

                <ProductRatingDecimal v-if="showRatings" :rating="getProductRating(productKey(product))?.rating" size="24px" />

                <span v-if="showDescription" class="product-description">{{ productKey(product).description }}</span>

                <p class="product-price-wrap" :class="{ discounted: productKey(product).discount_price }">
                    <span class="product-price">€{{ productKey(product).price }}</span>
                    <span class="product-price-discounted" v-if="productKey(product).discount_price">€{{ productKey(product).discount_price }}</span>
                </p>

                <QuantityButtons v-if="isCart" @loading="(val) => emit('loading', val)" :product="product" :instant="true" />

                <AddToCartButton v-if="showAddToCart" :product="productKey(product)" />
            </div>
            <i v-if="showRemoveButton" class="fa-solid fa-trash remove-item" @click="handleRemoveFromCart(product)"></i>
        </div>
    </div>
    <p v-if="!products.length && !isCart" :style="{ textAlign: 'center' }">No products found.</p>
    <p v-if="!products.length && isCart">Cart is empty.</p>
</template>

<script setup>
import { useStore } from 'vuex';
import useProductImage from '../../hooks/useProductImage';
import QuantityButtons from './QuantityButtons.vue';
import AddToCartButton from './AddToCartButton.vue';
import ProductRatingDecimal from './ProductRatingDecimal.vue';
import getProductRating from '../../helpers/getProductRating';

const props = defineProps({
    showDescription: { default: false },
    showCategories: { default: true },
    viewType: { default: 'cards' },
    columns: { default: 4 },
    showRatings: { default: true },
    showAddToCart: { default: true },
    showRemoveButton: { default: false },
    products: { default: [] },
    expandData: { default: false },
    isCart: { default: false },
});

const emit = defineEmits(['loading', 'push-single-product-page']);

const store = useStore();

const productKey = (product) => (props.expandData ? props.expandData.reduce((item, key) => item[key], product) : product);

const handleRemoveFromCart = async (item) => {
    try {
        emit('loading', true);
        await store.dispatch('removeFromCart', item.id);
        await store.dispatch('getCartItems', item.cart_id);
    } catch (error) {
        console.log(error);
    } finally {
        emit('loading', false);
    }
};
</script>

<style scoped>
.products-wrapper {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px 20px;
}

.products-wrapper.list {
    grid-template-columns: 1fr;
    gap: 0;
}
.product-card {
    display: flex;
    flex-direction: column;
    position: relative;
}

.products-wrapper.list .product-card {
    flex-direction: row;
    align-items: center;
    gap: 20px;
    transition: 0.2s;
    border-bottom: 1px solid #00000014;
    padding: 20px 0;
}

.products-wrapper.list .product-card:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.products-wrapper.list .product-image {
    min-width: 140px;
    min-height: 140px;
}

.product-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px 0;
}

.product-description {
    max-width: 600px;
}

.product-image {
    display: flex;
    min-height: 300px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 5px;
}

.product-name {
    font-size: 18px;
    font-weight: 500;
    transition: 0.2s;
    text-decoration: underline;
    text-decoration-color: transparent;
    width: fit-content;
}

.product-name:hover {
    text-decoration-color: inherit;
}

.product-categories {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

.single-category {
    font-size: 12px;
    color: gray;
    transition: 0.2s;
    text-decoration: underline;
    text-decoration-color: transparent;
}

.single-category:hover {
    text-decoration-color: inherit;
}

.product-price-wrap {
    color: black;
    font-weight: 600;
    display: flex;
    gap: 10px;
    align-items: center;
}

.product-price-wrap.discounted .product-price {
    color: gray;
    text-decoration: line-through;
    font-weight: 400;
}

.remove-item {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    transition: 0.2s;
    color: gray;
    color: rgba(0, 0, 0, 0.356);
    cursor: pointer;
}

.remove-item:hover {
    color: black;
    color: rgba(212, 0, 0, 0.856);
}
</style>
