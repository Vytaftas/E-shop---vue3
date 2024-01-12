<template>
    <div class="product-ratings-slider" v-if="reviews.value">
        <div class="product-ratings-wrap" :style="{ transform: `translateX(${currentRatingsSlide * -100}%)` }">
            <div
                class="single-rating"
                v-for="(rating, index) of newReviews.value"
                :key="rating"
                :style="{ transform: `translateX(${index * 100}%)`, width: `calc(100% / ${ratingsPerPage})` }"
            >
                <div class="product-rating-form-wrap">
                    <ProductRatingForm
                        :data="{
                            product_id: product.id,
                            rating: rating.star_rating,
                            title: rating.rating_heading,
                            content: rating.rating_text,
                        }"
                        :userData="{ name: rating.expand.user_id.name, date: formattedDate(rating.created) }"
                        :ratingUpdatedMessage="ratingUpdatedMessages[`${rating.id}`]"
                        @update-review="(data) => handleRatingUpdate(rating.id, data)"
                        @delete-review="handleRemoveRating(rating.id)"
                    />
                    <LoadingOverlay background="transparent" v-if="deletingReview || isInRatingLoadingState(rating.id)" color="black" />
                </div>
            </div>
        </div>
        <Pagination
            class="pagination"
            :paginationData="{ page: currentRatingsSlide + 1, totalPages: totalRatingsPages }"
            @page-change="handleChangeRatingsPage"
        />
    </div>
    <p v-else>No reviews found.</p>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { useStore } from 'vuex';
import ProductRatingForm from '../../Forms/ProductRatingForm.vue';
import Pagination from '../../Misc/Pagination.vue';
import LoadingOverlay from '../../LoadingOverlay.vue';

const props = defineProps({
    ratingsPerPage: { default: 4 },
    product: { default: null },
    reviews: { default: null },
});

const emit = defineEmits(['reviews-updated']);

const store = useStore();

const newReviews = ref(JSON.parse(JSON.stringify(props.reviews)));

watch(
    () => props.reviews,
    (val) => (newReviews.value = val),
    { deep: true, immediate: true }
);

const deletingReview = ref(false);

const currentRatingsSlide = ref(0);

const ratingUpdatedMessages = reactive({});

const ratingButtonLoadingStates = reactive({});

const totalRatingsPages = computed(() => Math.ceil(newReviews?.value?.value?.length / props.ratingsPerPage));

const isInRatingLoadingState = (id) => ratingButtonLoadingStates[id];

const handleChangeRatingsPage = (val) => {
    if (currentRatingsSlide.value === val - 1) return;
    currentRatingsSlide.value = val - 1;
};

const formattedDate = (originalDate) => {
    const date = new Date(originalDate);
    return `${date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
};

const calculateItemsOnCurrentPage = (totalItems, itemsPerPage, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;

    if (endIndex > totalItems) {
        return totalItems - startIndex;
    } else {
        return itemsPerPage;
    }
};

const handleRemoveRating = async (ratingId) => {
    if (!newReviews.value.value.length) return;

    if (window.confirm('Are you sure you want to delete this review?')) {
        try {
            deletingReview.value = true;

            await store.dispatch('deleteReview', ratingId);

            emit('reviews-updated');

            const currentPageItemsAmount = calculateItemsOnCurrentPage(
                newReviews.value.value.length,
                props.ratingsPerPage,
                currentRatingsSlide.value + 1
            );

            if (currentRatingsSlide.value !== 0 && currentPageItemsAmount <= 1) currentRatingsSlide.value = currentRatingsSlide.value - 1;
        } catch (error) {
            console.log(error);
        } finally {
            deletingReview.value = false;
        }
    }
};

const handleRatingUpdate = async (ratingId, data) => {
    let newData = {};

    const currentRating = props.product.expand['product_ratings(product_id)'].filter((rating) => rating.id === ratingId)[0];

    for (let key in data) {
        if (data[key] !== currentRating[key]) {
            newData = { ...newData, [key]: data[key] };
        }
    }

    if (!Object.keys(newData).length) return console.log('nothing changed'); // NOTHING CHANGED

    if (!ratingButtonLoadingStates[ratingId]) {
        ratingButtonLoadingStates[ratingId] = false;
    }

    try {
        ratingButtonLoadingStates[ratingId] = true;
        await store.dispatch('updateReview', {
            ratingId,
            data: newData,
        });

        emit('reviews-updated');

        ratingUpdatedMessages[ratingId] = 'Updated Successfully';
        setTimeout(() => {
            ratingUpdatedMessages[ratingId] = '';
        }, 3000);
    } catch (error) {
        console.log(error);
        ratingUpdatedMessages[ratingId] = 'Failed to Update';
        setTimeout(() => {
            ratingUpdatedMessages[ratingId] = '';
        }, 3000);
    } finally {
        ratingButtonLoadingStates[ratingId] = false;
    }
};
</script>

<style scoped>
.product-ratings-slider {
    overflow: hidden;
}
.product-ratings-wrap {
    display: flex;
    position: relative;
    min-height: 600px;
    transition: 0.5s;
}

.single-rating {
    position: absolute;
    left: 0;
    top: 0;
    width: calc(100% / 2);
    padding: 0 10px;
}

.single-rating:nth-child(odd) {
    padding-left: 5px;
    padding-right: 10px;
}

.single-rating:nth-child(even) {
    padding-left: 10px;
    padding-right: 5px;
}

form {
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.11);
}
</style>
