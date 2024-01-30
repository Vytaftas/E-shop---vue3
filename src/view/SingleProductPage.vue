<template>
    <div class="single-product-page-wrap">
        <div class="single-product-page container">
            <PathLinks :productName="product.name" />
            <div class="divider"></div>
            <SingleProduct
                @new-review="renewProduct(productId)"
                :product="product"
                :productLoading="productLoading"
                :computedRating="computedRating"
            />
        </div>
        <LoadingOverlay background="transparent" color="#000000" v-if="productLoading" />
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import SingleProduct from '../components/Products/SingleProduct.vue';
import getProductRating from '../helpers/getProductRating';
import LoadingOverlay from '../components/Misc/LoadingOverlay.vue';
import PathLinks from '../components/Misc/PathLinks.vue';

const store = useStore();

const route = useRoute();

const productId = computed(() => route.params.id);

const product = ref({});
const productLoading = ref(true);

const computedRating = computed(() => getProductRating(product.value));

const renewProduct = async (id) => {
    try {
        productLoading.value = true;
        product.value = await store.dispatch('getProduct', id);
    } catch (error) {
        console.log(error);
    } finally {
        productLoading.value = false;
    }
};

onMounted(async () => await renewProduct(productId.value));

watch(
    () => productId.value,
    async (newId) => renewProduct(newId)
);
</script>

<style scoped>
.single-product-page-wrap {
    position: relative;
    min-height: 95vh;
}
.divider {
    height: 1px;
    background-color: rgba(0, 0, 0, 0.062);
    margin: 20px 0;
}
</style>
