<template>
    <div class="search-wrap">
        <input class="search-input" :class="{ visible: searchVisible }" placeholder="Search our website.." type="text" v-model.trim="searchInput" />
        <i class="fa-solid fa-magnifying-glass search-icon" @click="searchVisible = !searchVisible"></i>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const maxResults = ref(8);

const searchInput = ref('');
const searchTimeoutId = ref(null);

watch(searchInput, (value) => {
    if (!value) return;

    clearTimeout(searchTimeoutId.value);

    searchTimeoutId.value = setTimeout(() => {
        console.log(value);
        console.log('searching');
    }, 1000);
});

const searchVisible = ref(false);
</script>

<style scoped>
.search-icon {
    cursor: pointer;
    transition: 0.2s;
    border-radius: 100%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.search-icon:hover {
    background-color: rgb(255, 123, 0);
    color: white;
}

.search-wrap {
    position: relative;
}

.search-input {
    border: none;
    outline: none;
    border-bottom: 1px solid transparent;
    padding: 10px;
    width: 0px;
    transition: 0.3s;
    visibility: hidden;
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translate(-100%, -50%);
}

.search-input.visible {
    width: 300px;
    border-color: inherit;
    visibility: visible;
}
</style>
