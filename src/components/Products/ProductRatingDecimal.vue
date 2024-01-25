<template>
    <div class="product-rating-decimal" :style="{ fontSize: size }">
        <span class="star" v-for="star in 5" :key="star" :style="getStarStyle(star)">
            <span v-if="star <= rating">&#9733;</span>
            <span v-else>&#9734;</span>
        </span>
    </div>
</template>

<script setup>
const props = defineProps({ rating: { default: null }, size: { default: '30px' } });

const getStarStyle = (starIndex) => {
    if (starIndex <= Math.floor(props.rating)) {
        return { color: '#ff9b00' };
    } else if (starIndex - 1 < props.rating) {
        const decimalPart = props.rating % 1;
        const percentage = decimalPart * 100;
        return {
            background: `linear-gradient(to right, #ff9b00 ${percentage}%, #6b6b6b ${percentage}%)`,
            '-webkit-background-clip': 'text',
            'background-clip': 'text',
            color: 'transparent',
        };
    }
    return { color: '#6b6b6b' };
};
</script>

<style scoped>
.product-rating-decimal {
    font-size: 30px;
    display: flex;
    line-height: 1em;
}

.product-rating-decimal span {
    display: flex;
    line-height: 1em;
}
</style>
