<template>
    <div class="filter-wrap">
        <div class="filter">
            <div class="filter-inner-wrap" v-if="!filterLoading">
                <p class="filter-heading">Filter</p>
                <ul class="filters-container" v-if="productsMetaData">
                    <li v-for="(value, key) of productsMetaData" :key="key">
                        <div class="filter-name-wrap" @click="openedFilters[key] = !openedFilters[key]">
                            <span class="filter-name">{{ key.charAt(0).toUpperCase() + key.slice(1) }}</span>
                            <i class="fa-solid fa-angle-down"></i>
                        </div>
                        <div class="single-filter-block" :class="{ opened: openedFilters[key] }">
                            <div class="single-filter-block-content">
                                <CustomCheckbox
                                    :item="item"
                                    v-for="item of value"
                                    :key="item.id"
                                    class="single-filter"
                                    :class="{ selected: isSelectedFilter(item.id) }"
                                    @click.stop="handleFilterToggle(item.id)"
                                    :checked="isSelectedFilter(item.id)"
                                >
                                    <template v-slot:default="{ item }">
                                        <div class="filter-content">
                                            <div
                                                class="filter-color-icon"
                                                v-if="isValidHexCode(item.value)"
                                                :style="{ backgroundColor: item.value }"
                                            ></div>
                                            <span>{{ item.name }}</span>
                                        </div>
                                    </template>
                                </CustomCheckbox>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <LoadingOverlay v-else background="transparent" color="black" />
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useStore } from 'vuex';
import isValidHexCode from '../../helpers/isValidHexCode';
import CustomCheckbox from './CustomCheckbox.vue';
import LoadingOverlay from './LoadingOverlay.vue';

const props = defineProps({
    categoryName: { default: '' },
});

watch(
    () => props.categoryName,
    () => (filterData.value = [])
);

const products = ref([]);
const emit = defineEmits(['filter-change']);

const store = useStore();

const filterData = ref([]);

const isSelectedFilter = (id) => filterData.value.includes(id);

const productsMetaData = ref(null);

const filterLoading = ref(false);

const openedFilters = reactive({});

const handleFilterToggle = async (metaId) => {
    let filterString = '';

    const isSelected = isSelectedFilter(metaId);

    if (isSelected) {
        const index = filterData.value.indexOf(isSelected);
        filterData.value.splice(index, 1);
    } else {
        filterData.value.push(metaId);
    }

    filterData.value.forEach((id, index) => {
        filterString += `product_meta ~ '${id}'`;
        if (index !== filterData.value.length - 1) filterString += ' || ';
    });

    emit('filter-change', { filter: filterString });
};

watch(
    () => props.categoryName,
    (newCategoryName) => getProducts(newCategoryName)
);

const getProducts = async (categoryName) => {
    try {
        filterLoading.value = true;
        const response = await store.dispatch('getProducts', {
            amount: 500,
            returnData: true,
            getAvailableCategories: categoryName ? true : false,
            categoryName: categoryName,
        });
        const nonDuplicateMeta = response.items
            .filter((item) => item.product_meta.length)
            .reduce((acc, item) => {
                const reducedMeta = item.expand.product_meta.filter((meta) => !acc.some((accItem) => accItem.id === meta.id));
                return [...acc, ...reducedMeta];
            }, [])
            .reduce((acc, item) => {
                return acc[item.data_name] ? { ...acc, [item.data_name]: [...acc[item.data_name], item] } : { ...acc, [item.data_name]: [item] };
            }, {});

        Object.keys(nonDuplicateMeta).forEach((key) => nonDuplicateMeta[key].sort((a, b) => a.value - b.value));

        productsMetaData.value = nonDuplicateMeta;
        products.value = response.items;
    } catch (error) {
        console.log(error);
    } finally {
        filterLoading.value = false;
    }
};

onMounted(async () => getProducts(props.categoryName));
</script>

<style scoped>
.filter {
    position: relative;
    min-height: 300px;
}
.filter-heading {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
    border-radius: 5px 5px 0 0;
}

.filter-name-wrap {
    font-size: 18px;
    font-weight: 700;
    border-bottom: 1px solid rgba(0, 0, 0, 0.062);
    padding-bottom: 5px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
}

.filter-name-wrap span {
    text-decoration: 1px solid underline;
    text-decoration-color: transparent;
    transition: 0.3s;
}

.filter-name-wrap:hover span {
    text-decoration-color: black;
}

.filter-name-wrap i {
    font-size: 14px;
}

.filter-color-icon {
    height: 18px;
    width: 18px;
    border-radius: 100%;
}

.single-filter-block {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.filter-content {
    display: flex;
    align-items: center;
    width: 100%;
    padding-left: 25px;
    gap: 10px;
}
.single-filter {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    text-decoration: underline;
    text-decoration-color: transparent;
    transition: 0.2s;
    width: 100%;
    padding-left: 10px;
}

.single-filter:not(.selected):hover {
    text-decoration-color: inherit;
}

.single-filter.selected {
    font-weight: 600;
}

.filters-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    border-radius: 0 0 5px 5px;
}

.single-filter-block {
    display: grid;
    grid-template-rows: 0fr;
    transition: 0.4s;
}

.single-filter-block.opened {
    display: grid;
    grid-template-rows: 1fr;
}

.single-filter-block-content {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 5px;
}
</style>
