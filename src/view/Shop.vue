<template>
    <ShopLikePage
        :loading="productsLoading"
        :products="products"
        :columns="productColumns"
        :productsAmount="productsAmount"
        @filter-change="handleFilterChange"
    />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import ShopLikePage from '../components/templates/ShopLikePage.vue';

const store = useStore();

const productsLoading = ref(false);

const productColumns = ref(3);

const productsAmount = ref(9);

const products = ref([]);

const getProducts = async (filterData) => {
    try {
        productsLoading.value = true;
        const response = await store.dispatch('getProducts', {
            amount: productsAmount.value,
            filterData,
            returnData: true,
        });
        products.value = response.items;
    } catch (error) {
        console.log(error);
    } finally {
        productsLoading.value = false;
    }
};

const handleFilterChange = (filterData) => getProducts(filterData);

onMounted(async () => getProducts({}));
</script>
