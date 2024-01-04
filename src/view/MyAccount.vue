<template>
    <div class="my-account">
        <div class="bg-overlay" :style="{ backgroundImage: `url('${BG}')` }"></div>
        <router-view class="view"></router-view>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

import BG from '../assets/my-account-bg.jpg';

const store = useStore();

const user = computed(() => store.getters.currentUser);
</script>

<style scoped>
.my-account {
    min-height: 85vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.bg-overlay {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;

    opacity: 0.03;
}

.view {
    max-width: 1400px;
    z-index: 1;
    /* background-color: red; */
}
</style>
