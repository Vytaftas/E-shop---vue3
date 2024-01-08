<template>
    <div class="star-rating" :style="{ fontSize: size }">
        <span
            v-for="star in 5"
            :key="star"
            class="star"
            :class="{ filled: star <= currentRating, 'has-rating': rating && !editing }"
            @click="rating && !editing ? null : setRating(star)"
            @mouseover="rating && !editing ? null : hover(star)"
            @mouseleave="stopHover"
        >
            <span v-if="star <= currentRating">&#9733;</span>
            <span v-else>&#9734;</span>
        </span>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
    rating: { default: null },
    editing: { default: false },
    resetStars: { default: false },
    size: { default: '24px' },
});

const emit = defineEmits(['rating-changed']);

const defaultRating = ref(props.rating ? props.rating : 0);
const hoverIndex = ref(0);
const hovering = ref(false);

const setRating = (newRating) => {
    defaultRating.value = newRating;
    emit('rating-changed', newRating);
};

const hover = (star) => {
    hovering.value = true;
    hoverIndex.value = star;
};

const stopHover = () => {
    hovering.value = false;
};

watch(
    () => props.resetStars,
    () => (defaultRating.value = 0)
);

const currentRating = computed(() => (hovering.value ? hoverIndex.value : defaultRating.value));
</script>

<style scoped>
.star-rating {
    /* font-size: 24px; */
    line-height: 1em;
}

.star {
    cursor: pointer;
    color: #6b6b6b;
    display: inline-flex;
}
.star.has-rating {
    cursor: auto;
}

.star.filled {
    color: #ff9b00;
}
</style>
