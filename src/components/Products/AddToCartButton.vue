<template>
    <button v-if="product" class="button-main" :disabled="isAnyLoading" @click="addToCart(product, quantity)">
        <LoadingOverlay background="#0000001a" v-if="loadingStates[product.id]" size="20px" />
        <span>Add To Cart</span>
    </button>
</template>

<script setup>
import useAddToCart from '../../hooks/useAddToCart';
import LoadingOverlay from '../LoadingOverlay.vue';

const props = defineProps({
    product: { default: {} },
    quantity: { default: 1 },
});

const { loadingStates, isAnyLoading, addToCart } = useAddToCart();
</script>
