<template>
    <div class="loading-overlay" :style="{ backgroundColor: background }">
        <div class="spinner" :style="{ width: size, height: size, borderColor: color + '15', borderTopColor: color }"></div>
    </div>
</template>

<script setup>
const props = defineProps({
    size: { default: '40px' },
    background: { default: 'rgba(0, 0, 0, 0.2)' },
    color: { default: 'white' },
});
</script>

<style scoped>
.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.2);
    z-index: 1000;
}

.spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top: 4px solid #ffffff;
    width: 40px;
    height: 40px;
    animation: spin 0.5s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
