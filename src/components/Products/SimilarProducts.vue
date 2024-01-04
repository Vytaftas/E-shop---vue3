<template #default>
    <div class="similar-products" v-if="product.expand.categories.length">
        <h3 v-if="showHeading">Similar Products</h3>
        <ProductsList @push-single-product-page="emit('product-change')" v-if="!similarProductsLoading" :products="similarProducts" />
        <ProductsListSkeleton v-else />
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import ProductsList from './ProductsList.vue';
import ProductsListSkeleton from '../Skeletons/ProductsListSkeleton.vue';

const store = useStore();

const props = defineProps({
    product: { default: {} },
    showHeading: { default: true },
});

const emit = defineEmits(['product-change']);

const similarProductsLoading = ref(false);

const similarProducts = ref([]);

const getSimilarProducts = async (product) => {
    const currentProduct = product ? product : props.product;

    try {
        similarProductsLoading.value = true;
        const products = await store.dispatch('getProducts', {
            amount: 4,
            filterData: { filter: `categories ~ '${currentProduct.expand.categories[0].id}' && id != '${currentProduct.id}'`, sort: '@random' },
            returnData: true,
        });

        similarProducts.value = products.items;
    } catch (error) {
        console.log(error);
    } finally {
        similarProductsLoading.value = false;
    }
};

watch(
    () => props.product,
    async (newProduct) => {
        emit('product-change');
        await getSimilarProducts(newProduct);
    }
);

onMounted(async () => {
    await getSimilarProducts(props.product);
});
</script>

<style scoped>
.similar-products {
    position: relative;
    min-height: 400px;
}

h3 {
    font-size: 40px;
    font-weight: 700;
    margin-bottom: 20px;
}
</style>
