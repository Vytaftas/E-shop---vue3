<template>
    <button
        v-if="(product && !product.product_meta.length) || isSingleProductPage"
        class="button-main"
        :disabled="isAnyLoading"
        @click="addToCart(product, quantity, meta)"
    >
        <LoadingOverlay background="#0000001a" v-if="loadingStates[product.id]" size="20px" />
        <span>Add To Cart</span>
    </button>

    <router-link v-else :to="'/shop/product/' + product.id" class="button-main">Select Options</router-link>
</template>

<script setup>
import useAddToCart from '../../hooks/useAddToCart';
import LoadingOverlay from '../Misc/LoadingOverlay.vue';

const props = defineProps({
    product: { default: {} },
    quantity: { default: 1 },
    meta: { default: [] },
    isSingleProductPage: { default: false },
});

const { loadingStates, isAnyLoading, addToCart } = useAddToCart();
</script>
