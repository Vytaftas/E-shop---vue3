<template>
    <h4 class="my-account-page-heading">Orders</h4>

    <div class="orders-wrap">
        <div class="single-order">Single order 1</div>
        <div class="single-order">Single order 2</div>
        <div class="single-order">Single order 3</div>
    </div>
</template>

<script setup>
const props = defineProps({
    currentUser: { default: null },
});
</script>

<style scoped>
.my-account-page-heading {
    font-size: 20px;
    font-weight: 500;
}

.orders-wrap {
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
    margin-top: 10px;
}
</style>
