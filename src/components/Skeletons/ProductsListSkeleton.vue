<template>
    <div class="skeleton-wrapper" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }">
        <div class="product-card" v-for="item in skeletonAmount" :key="item">
            <div class="product-image"></div>

            <div class="product-content">
                <div class="product-categories"></div>
                <span class="product-name"></span>
                <div class="product-rating"></div>
                <p class="product-price-wrap"></p>
                <div class="add-to-cart-button button-main"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    skeletonAmount: { default: 4 },
    columns: { default: 3 },
});
</script>

<style scoped>
.skeleton-wrapper {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px 20px;
}

.product-card {
    display: flex;
    flex-direction: column;
    position: relative;
}

.product-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px 0;
}

.product-card::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
    animation: shimmer 1.8s infinite;
}

.product-image {
    display: flex;
    min-height: 300px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    background-color: rgba(0, 0, 0, 0.082);
    border-radius: 5px;
}

.product-categories {
    height: 18px;
    width: 40%;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.082);
}

.product-name {
    border-radius: 5px;
    height: 27px;
    background-color: rgba(0, 0, 0, 0.274);
}

.product-rating {
    height: 24px;
    background-color: #ff9b00;
    opacity: 0.5;

    border-radius: 5px;
}

.product-price-wrap {
    height: 24px;

    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.274);
}

.add-to-cart-button {
    height: 33px;
    width: 95px;
    opacity: 0.5;
    background-color: #ff9b00;
}

@keyframes shimmer {
    100% {
        transform: translateX(100%);
    }
}
</style>
