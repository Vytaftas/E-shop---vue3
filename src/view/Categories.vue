<template>
    <div class="categories-wrap">
        <Categories :categories="categories" />
        <LoadingOverlay v-if="categoriesLoading" background="transparent" color="black" />
        <div v-if="!categories.length && !categoriesLoading" class="message container">
            <p>No categories found.</p>
            <router-link to="/shop" class="link">Back to Shop</router-link>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import Categories from '../components/Categories.vue';
import LoadingOverlay from '../components/LoadingOverlay.vue';

const store = useStore();
const categories = ref([]);

const categoriesLoading = ref(false);

onMounted(async () => {
    try {
        categoriesLoading.value = true;
        const response = await store.dispatch('getAvailableCategories');
        console.log(response);
        categories.value = response;
    } catch (error) {
        console.log(error);
    } finally {
        categoriesLoading.value = false;
    }
});
</script>

<style scoped>
.categories-wrap {
    position: relative;
    display: flex;
    flex-direction: column;
}

.message {
    text-align: center;
    font-size: 18px;
    text-align: center;
    margin: auto;
}
</style>
