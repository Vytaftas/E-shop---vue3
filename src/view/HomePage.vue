<template>
    <div class="home">
        <ImageSlider :data="sliderData" />

        <div class="main-categories-block container">
            <router-link
                to="/shop/categories/jackets"
                class="left-side centered-background category-block"
                :style="{ backgroundImage: `url('${JacketsBackground}')` }"
            >
                <div class="category-overlay">
                    <span class="category-name">Jackets</span>
                </div>
            </router-link>
            <div class="right-side">
                <router-link
                    to="/shop/categories/sneakers"
                    :style="{ backgroundImage: `url('${SneakersBackground}')` }"
                    class="top centered-background category-block"
                >
                    <div class="category-overlay">
                        <span class="category-name">Sneakers</span>
                    </div>
                </router-link>
                <router-link
                    to="/shop/categories/accessories"
                    :style="{ backgroundImage: `url('${AccessoriesBackground}')` }"
                    class="bottom centered-background category-block"
                >
                    <div class="category-overlay">
                        <span class="category-name">Accessories</span>
                    </div>
                </router-link>
            </div>
        </div>

        <div class="new-products container">
            <div class="section-info">
                <h3 class="products-heading">New Products</h3>
                <span class="products-additional-info">Lorem ipsum dolor sit amet</span>
                <div class="section-divider"></div>
            </div>
            <ProductsList v-if="!productsLoading" :viewType="view" :products="newProducts" :showDescription="showDescription" />
            <ProductsListSkeleton v-else :skeletonAmount="8" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import ProductsList from '../components/Products/ProductsList.vue';
import ImageSlider from '../components/Misc/ImageSlider.vue';
import bg1 from '../assets/hero/sneakers1.png';
import bg2 from '../assets/hero/sneakers2.png';
import bg3 from '../assets/hero/sneakers3.png';
import JacketsBackground from '../assets/jackets.webp';
import SneakersBackground from '../assets/sneakers.webp';
import AccessoriesBackground from '../assets/accessories.webp';
import ProductsListSkeleton from '../components/Skeletons/ProductsListSkeleton.vue';

const store = useStore();

const view = ref('cards');
const showDescription = computed(() => (view.value === 'cards' ? false : true));

const newProducts = ref([]);
const productsLoading = ref(false);

const sliderData = [
    { text: 'Desino Alma', additionalText: 'Hello how are you?', backgroundImage: bg3 },
    { text: 'Hello', additionalText: 'Lorem ipsum dolor.', backgroundImage: bg1, button: { text: 'Shop Now', link: '/shop' } },
    { text: 'Lorem Ipsum', additionalText: 'Lorem ipsum dolor sit amet.', backgroundImage: bg2 },
];

onMounted(async () => {
    try {
        productsLoading.value = true;
        const products = await store.dispatch('getProducts', { amount: 8, filterData: { sort: '-created' }, returnData: true });
        newProducts.value = products.items;
    } catch (error) {
        console.log(error);
    } finally {
        productsLoading.value = false;
    }
});
</script>

<style scoped>
.section-info {
    text-align: center;
    margin: 25px auto 35px auto;
}

.products-heading {
    font-size: 50px;
    font-weight: 600;
}

.products-additional-info {
    font-size: 20px;
}

.section-divider {
    background-color: rgb(255, 123, 0);
    height: 1px;
    width: 100px;
    margin: auto;
    margin-top: 25px;
}

.main-categories-block {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-top: 25px;
}

.main-categories-block .left-side {
    height: 800px;
}
.main-categories-block .right-side {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.main-categories-block .right-side .top {
    height: 50%;
}
.main-categories-block .right-side .bottom {
    height: 50%;
}

.category-block {
    position: relative;
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
}

.category-overlay .category-name {
    font-weight: 700;
    font-size: 60px;
    text-transform: uppercase;
    margin: 0;
    color: rgba(255, 255, 255, 0.6);
    transition: transform 0.2s, color 0.5s;
}

.category-block:hover .category-name {
    color: white;
    transform: translateY(-20px);
}

.category-block:hover .category-overlay {
    background-color: rgba(0, 0, 0, 0.2);
}
</style>
