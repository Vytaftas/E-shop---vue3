<template>
    <div class="available-categories container">
        <router-link
            :to="`/shop/categories/${category.link}`"
            class="single-category centered-background"
            :class="category.link"
            v-for="category of categories"
            :key="category.id"
            :style="{ backgroundImage: `url('https://my-shop-app.pockethost.io/api/files/available_categories/${category.id}/${category.image}')` }"
        >
            <div class="category-overlay">
                <span class="category-name">{{ category.name }}</span>
            </div>
        </router-link>
    </div>
</template>

<script setup>
const props = defineProps({ categories: { default: [] } });
</script>

<style scoped>
.available-categories {
    display: grid;
    min-height: 70vh;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px; /* Adjust the gap as per your design */
}

.single-category {
    height: 400px;
    position: relative;
    border-radius: 5px;
}

.single-category.men,
.single-category.women,
.single-category.kids {
    background-position: top;
}

.single-category:first-child {
    grid-row: span 2;
    height: calc(800px + 10px);
}

.single-category:nth-child(8) {
    grid-row: span 2;
    height: calc(800px + 10px);
}

.single-category:hover .category-name {
    color: white;
    transform: translateY(-20px);
}

.single-category:hover .category-overlay {
    background-color: rgba(0, 0, 0, 0.2);
}

.category-overlay {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.055);
    display: flex;
    flex-direction: column;
    justify-content: end;
    align-items: center;
    transition: 0.2s;
    border-radius: 5px;
}

.category-overlay .category-name {
    font-weight: 700;
    font-size: 60px;
    text-transform: uppercase;
    margin: 0;
    color: rgba(255, 255, 255, 0.6);
    transition: transform 0.2s, color 0.5s;
}
</style>

<!-- {
    "collectionId": "8ncziq52e66ih1d",
    "collectionName": "available_categories",
    "created": "2023-12-27 10:23:53.425Z",
    "id": "qbmllnjty9l44wv",
    "image": "11_1_kazuP5yxTg.jpg",
    "link": "sneakers",
    "name": "Sneakers",
    "updated": "2023-12-27 10:45:49.259Z"
}, -->
