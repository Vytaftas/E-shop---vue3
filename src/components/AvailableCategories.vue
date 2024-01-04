<template>
    <div class="available-categories">
        <router-link v-for="category of availableCategories" :to="'/category/' + category.link" :key="category.id">
            <div
                class="single-category"
                :style="{
                    backgroundImage: `url('https://my-shop-app.pockethost.io/api/files/available_categories/${category.id}/${category.image}')`,
                }"
            >
                <div class="category-name">
                    <span>{{ category.name }}</span>
                </div>
            </div>
        </router-link>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const props = defineProps({
    hide: { default: false },
});

const availableCategories = computed(() => {
    const categories = store.getters.availableCategories;
    console.log(categories);

    if (props.hide) {
        return categories.filter((cat) => !props.hide.some((hiddenCategory) => cat.name.toLowerCase() === hiddenCategory.toLowerCase()));
    } else {
        return categories;
    }
});

onMounted(async () => {
    try {
        await store.dispatch('getAvailableCategories');
    } catch (error) {
        console.log(error);
    }
});
</script>

<style scoped>
.available-categories {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
}

.single-category {
    min-height: 400px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
}

.category-name {
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: rgba(255, 123, 0, 0.75);
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 10px 0;
    color: white;
    font-size: 30px;
    font-weight: 500;
}
</style>
