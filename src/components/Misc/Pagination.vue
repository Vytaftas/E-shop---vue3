<template>
    <div class="pagination" v-if="paginationData?.totalPages > 1">
        <span
            class="page-button"
            :class="{ selected: currentPage.value ? currentPage.value === page : currentPage === page }"
            :style="{ backgroundColor: currentPage.value ? currentPage.value === page : currentPage === page ? color : 'transparent' }"
            v-for="page of paginationData?.totalPages"
            :key="page"
            @click="handlePageChange(page)"
            >{{ page }}</span
        >
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
    paginationData: { default: undefined },
    color: { default: 'rgb(255, 123, 0)' },
});

const currentPage = computed(() => props.paginationData.page);

const emit = defineEmits(['page-change']);

const handlePageChange = (page) => {
    // if (page === currentPage.value) return;
    emit('page-change', page);
};
</script>

<style scoped>
.pagination {
    display: flex;
    gap: 5px;
}
.page-button {
    cursor: pointer;
    transition: 0.2s;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    text-decoration: underline;
    text-decoration-color: transparent;
}
.page-button.selected {
    background-color: rgb(255, 123, 0);
    color: white;
}

.page-button:not(.selected):hover {
    text-decoration-color: inherit;
}
</style>
