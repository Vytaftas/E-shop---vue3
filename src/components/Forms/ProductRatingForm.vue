<template>
    <form @submit.prevent="handleRatingSubmit" :style="{ minWidth: data && 'initial' }">
        <h3 v-if="!data">Add Your Review</h3>
        <div class="single-input-wrapper">
            <label for="title">Rating</label>
            <StarRating :editing="true" :rating="data && data.rating" :resetStars="resetStars" @rating-changed="(val) => (rating = val)" />
            <span class="error-message" v-if="errors.rating">{{ errors.rating }}</span>
        </div>
        <div class="single-input-wrapper">
            <label for="title">Title</label>

            <input type="text" id="title" maxlength="60" placeholder="Enter review title.." v-model.trim="title" @input="errors.title = null" />
            <span class="error-message" v-if="errors.title">{{ errors.title }}</span>
        </div>
        <div class="single-input-wrapper">
            <label for="content">{{ data ? 'Review' : 'Your Review' }}</label>
            <textarea
                name="content"
                id="content"
                cols="30"
                rows="10"
                placeholder="Enter your review here.."
                v-model.trim="content"
                @input="errors.content = null"
            ></textarea>
            <span class="error-message" v-if="errors.content">{{ errors.content }}</span>
        </div>

        <span class="error-message" v-if="errors.global">{{ errors.global }}</span>

        <button type="submit" class="button-main submit-button">
            <LoadingOverlay background="transparent" v-if="loading" size="20px" />
            <span v-if="ratingUpdatedMessage">{{ ratingUpdatedMessage }}</span>
            <span v-else>{{ loading ? 'Please wait..' : buttonText }}</span>
        </button>

        <button v-if="data" class="delete-rating-button button-main" @click.prevent="emit('delete-review')">
            <span>Delete Review</span>
        </button>

        <span v-if="data" class="rating-date">{{ userData.name }}, {{ userData.date }}</span>
    </form>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import StarRating from '../Products/StarRating.vue';
import LoadingOverlay from '../Misc/LoadingOverlay.vue';

const props = defineProps({
    product: { default: null },
    data: { default: null },
    userData: { default: null },
    ratingUpdatedMessage: { default: '' },
});
const emit = defineEmits(['new-review', 'update-review', 'delete-review']);

const store = useStore();

const currentUser = computed(() => store.getters.currentUser);

const loading = ref(false);

const rating = ref(props.data ? props.data.rating : null);
const title = ref(props.data ? props.data.title : '');
const content = ref(props.data ? props.data.content : '');

const buttonText = computed(() => (props.data ? 'Update' : 'Add Review'));

const resetStars = ref(false);

const errors = reactive({
    rating: null,
    title: null,
    content: null,
});

const resetForm = () => {
    resetStars.value = !resetStars.value;
    rating.value = null;
    title.value = '';
    content.value = '';
    errors.rating = null;
    errors.title = null;
    errors.content = null;
};

const handleRatingSubmit = async () => {
    if (loading.value) return;

    const isError = !rating.value || !title.value || !content.value;

    if (isError) {
        if (!rating.value) errors.rating = 'Please select a rating';
        if (!title.value) errors.title = 'Please enter a title';
        if (!content.value) errors.content = 'Please enter your review';
        return;
    }

    if (props.data) {
        emit('update-review', { star_rating: rating.value, rating_heading: title.value, rating_text: content.value });
    } else {
        try {
            loading.value = true;

            await store.dispatch('addReview', {
                star_rating: rating.value,
                rating_heading: title.value,
                rating_text: content.value,
                product_id: props.product.id,
                user_id: currentUser.value.id,
            });

            emit('new-review');

            resetForm();
        } catch (error) {
            console.log(error);
        } finally {
            loading.value = false;
        }
    }
};
</script>

<style scoped>
form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 25px;
    box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.11);
    border-radius: 5px;
    min-width: 400px;
    background-color: white;
    position: relative;
}

h3 {
    font-weight: 700;
    font-size: 30px;
}

.single-input-wrapper {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.error-message {
    color: #dd0000;
    font-size: 13px;
}

.single-input-wrapper input,
.single-input-wrapper textarea {
    padding: 10px 20px;
    outline: none;
    border: none;
    border-radius: 4px;
    font-weight: 400;
    background-color: rgba(255, 102, 0, 0.144);
    width: 100%;
}

.single-input-wrapper input::placeholder,
.single-input-wrapper textarea::placeholder {
    font-size: 14px;
}

p {
    text-align: center;
    font-size: 20px;
    font-weight: 500;
    padding: 10px 0;
}

.submit-button {
    position: relative;
}

.delete-rating-button {
    position: absolute;
    right: 25px;
    top: 25px;
    cursor: pointer;
    background-color: rgb(216, 56, 56);
}
.delete-rating-button:hover {
    background-color: rgb(255, 0, 0);
}

.rating-date {
    color: gray;
    font-size: 12px;
}
</style>
