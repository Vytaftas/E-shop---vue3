<template>
    <div class="ratings-block">
        <h3>Ratings and Reviews</h3>

        <div v-if="product.expand['product_ratings(product_id)']" class="ratings-wrapper">
            <div class="single-rating" v-for="rating of reviews" :key="rating.id">
                <StarRating :rating="rating.star_rating" />
                <p class="rating-heading">{{ rating.rating_heading }}</p>
                <p class="rating-text">{{ rating.rating_text }}</p>
                <span class="rating-date">{{ rating.expand.user_id.name }}, {{ formattedDate(rating.created) }}</span>
            </div>

            <Pagination :paginationData="paginationData()" @page-change="(page) => (currentPage = page)" />
        </div>

        <div class="message">
            <span v-if="!product.expand['product_ratings(product_id)']">No reviews found. </span>
            <span v-if="!currentUser"> <router-link class="link" to="/my-account/login">Login</router-link> to review this product. </span>
        </div>

        <ProductRatingForm @new-review="emit('new-review')" v-if="currentUser" :product="product" />
    </div>
</template>

<script setup>
import StarRating from './StarRating.vue';
import ProductRatingForm from '../Forms/ProductRatingForm.vue';
import { useStore } from 'vuex';
import { computed, ref, watch } from 'vue';
import Pagination from '../Pagination.vue';

const store = useStore();

const currentUser = computed(() => store.getters.currentUser);

const props = defineProps({
    productId: { default: null },
    product: { default: null },
    computedRating: { default: null },
    resetReviewPage: { default: false },
});

const currentPage = ref(1);

const paginationData = (perPage = 5) => {
    if (!props.product.expand['product_ratings(product_id)']) return false;

    const totalPages = Math.ceil(props.product.expand['product_ratings(product_id)'].length / perPage);
    const pages = Math.floor(props.product.expand['product_ratings(product_id)'].length);

    return { totalPages, perPage, page: currentPage };
};

const reviews = computed(() => {
    if (!props.product.expand['product_ratings(product_id)']) return [];

    const { perPage } = paginationData();

    const startIndex = (currentPage.value - 1) * perPage;

    const endIndex = startIndex + perPage;

    const reviews = props.product.expand['product_ratings(product_id)'].slice(startIndex, endIndex);

    return reviews;
});

watch(
    () => props.resetReviewPage,
    () => (currentPage.value = 1)
);

const emit = defineEmits(['new-review']);

const formattedDate = (originalDate) => {
    const date = new Date(originalDate);
    return `${date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
};
</script>

<style scoped>
.ratings-block {
    padding: 50px 0;
}

h3 {
    font-size: 40px;
    font-weight: 700;
    margin-bottom: 30px;
}

.ratings-wrapper {
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
}

.single-rating {
    display: flex;
    flex-direction: column;
    gap: 20px;
    /* border-bottom: 1px solid rgba(0, 0, 0, 0.089); */
    padding: 30px 0;
}

.message {
    margin-bottom: 30px;
}

.single-rating:first-child {
    border-top: 1px solid rgba(0, 0, 0, 0.089);
}

.rating-heading {
    font-size: 20px;
    font-weight: 500;
}

.rating-text {
    color: rgba(0, 0, 0, 0.795);
}
.rating-date {
    color: gray;
    font-size: 12px;
}
</style>
