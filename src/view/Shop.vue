<template>
    <ShopLikePage
        :loading="productsLoading"
        :products="products"
        :columns="productColumns"
        :productsAmount="productsAmount"
        :paginationData="paginationData"
        @filter-change="handleFilterChange"
        @page-change="getProducts(currentFilters, $event)"
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
const paginationData = ref(null);

const currentFilters = ref('');
const currentPage = ref(1);

const getProducts = async (filterData, page = currentPage.value) => {
    console.log(filterData);
    try {
        productsLoading.value = true;
        const response = await store.dispatch('getProducts', {
            amount: productsAmount.value,
            filterData,
            page,
            returnData: true,
        });
        products.value = response.items;
        paginationData.value = response.paginationData;
    } catch (error) {
        console.log(error);
    } finally {
        productsLoading.value = false;
    }
};

const handleFilterChange = (filterData) => {
    currentFilters.value = filterData;
    getProducts(filterData, 1);
};

onMounted(async () => getProducts({}));
</script>
