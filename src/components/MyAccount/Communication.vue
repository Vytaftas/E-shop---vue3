<template>
    <div class="communication-wrap">
        <h4 class="my-account-page-heading">Communication</h4>
        <form>Nothing to see here..</form>
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

form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
    margin-top: 10px;
}
</style>
