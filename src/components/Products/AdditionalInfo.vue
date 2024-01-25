<template>
    <div class="additional-info-block">
        <h3>Additional Info</h3>
        <p v-html="product.long_description"></p>
    </div>
</template>

<script setup>
import { useStore } from 'vuex';

const props = defineProps({
    product: { default: null },
});
</script>

<style scoped>
.additional-info-block {
    padding: 50px 0;
    padding-top: 100px;
}

h3 {
    font-size: 40px;
    font-weight: 700;
    margin-bottom: 30px;
}
</style>
