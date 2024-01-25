<template>
    <ShopLikePage
        :loading="productsLoading"
        :products="products"
        :columns="productColumns"
        :productsAmount="productsAmount"
        :categoryName="categoryName"
        @filter-change="handleFilterChange"
    />
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import ShopLikePage from '../components/templates/ShopLikePage.vue';

const store = useStore();
const route = useRoute();

const categoryName = computed(() => route.params.categoryName);

const productsLoading = ref(false);

const productColumns = ref(3);

const productsAmount = ref(9);

const products = ref([]);

const getCategoryProducts = async (categoryName, filterData) => {
    try {
        productsLoading.value = true;
        const response = await store.dispatch('getProducts', {
            amount: productsAmount.value,
            filterData,
            getAvailableCategories: true,
            categoryName,
            returnData: true,
        });
        products.value = response.items;
    } catch (error) {
        console.log(error);
    } finally {
        productsLoading.value = false;
    }
};

const handleFilterChange = (filterData) => getCategoryProducts(categoryName.value, filterData);

watch(
    () => categoryName.value,
    () => getCategoryProducts(categoryName.value, {})
);

onMounted(async () => getCategoryProducts(categoryName.value, {}));
</script>
