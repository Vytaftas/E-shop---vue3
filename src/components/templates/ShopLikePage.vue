<template>
    <div class="categories-wrap container">
        <PathLinks class="path-links" />
        <div class="divider"></div>
        <div class="categories-wrap-content">
            <Filter :products="products" @filter-change="(val) => emit('filter-change', val)" />
            <div class="categories-content">
                <ProductsList v-if="!loading" :products="products" :columns="columns" />
                <ProductsListSkeleton v-else :skeletonAmount="productsAmount" :columns="columns" />
            </div>
        </div>
        <div v-if="!products.length && !loading" class="message container">
            <p>No products found.</p>
            <router-link to="/shop" class="link">Back to Shop</router-link>
        </div>
    </div>
</template>

<script setup>
import ProductsList from '../Products/ProductsList.vue';
import ProductsListSkeleton from '../Skeletons/ProductsListSkeleton.vue';
import Filter from '../Filter.vue';
import PathLinks from '../PathLinks.vue';

const props = defineProps({
    products: { default: [] },
    columns: { default: 3 },
    productsAmount: { default: 9 },
    loading: { default: false },
});

const emit = defineEmits(['filter-change']);
</script>

<style scoped>
.categories-wrap {
    position: relative;
    min-height: 70vh;
}
.categories-wrap-content {
    display: grid;
    grid-template-columns: 300px 1fr;
}

.categories-content {
    border-left: 1px solid rgba(0, 0, 0, 0.062);
    padding-left: 20px;
    margin-left: 20px;
}

.divider {
    height: 1px;
    background-color: rgba(0, 0, 0, 0.062);
    margin: 20px 0;
}
</style>
