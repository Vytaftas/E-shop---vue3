<template>
    <div class="filter-wrap">
        <div class="filter">
            <p class="filter-heading">Filter</p>
            <ul class="filters-container" v-if="productsMetaData">
                <li v-for="(value, key) of productsMetaData" :key="key">
                    <div class="single-filter-block">
                        <span class="filter-name">{{ key.charAt(0).toUpperCase() + key.slice(1) }}</span>

                        <CustomCheckbox
                            :item="item"
                            v-for="item of value"
                            :key="item"
                            class="single-filter"
                            :class="{ selected: isSelectedFilter(key, item.name) }"
                            @click.stop="handleFilterToggle(key, item.name)"
                            :checked="isSelectedFilter(key, item.name)"
                        >
                            <template v-slot:default="{ item }">
                                <div class="filter-content">
                                    <div class="filter-color-icon" v-if="isValidHexCode(item.value)" :style="{ backgroundColor: item.value }"></div>
                                    <span>{{ item.name }}</span>
                                </div>
                            </template>
                        </CustomCheckbox>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import isValidHexCode from '../helpers/isValidHexCode';
import CustomCheckbox from './CustomCheckbox.vue';

const props = defineProps({ products: { default: [] } });
const emit = defineEmits(['filter-change']);

const filterData = ref([]);

const isSelectedFilter = (val1, val2) => filterData.value.find((item) => item[0] === val1 && item[1] === val2);

const productsMetaData = computed(() => {
    const metaData = props.products.filter((product) => product.meta_data);

    const data = {};

    metaData.forEach((item) => {
        const keys = Object.keys(item.meta_data);

        keys.forEach((key) => {
            if (!data[key]) data[key] = [];
            data[key].push(item.meta_data[key]);
        });
    });

    let result = {};

    Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key]) && data[key].every(Array.isArray)) {
            const flattened = data[key].flat();

            if (flattened.every((item) => typeof item === 'object' && item !== null)) {
                const uniqueItemsMap = new Map(flattened.map((item) => [item.name, item]));
                result[key] = Array.from(uniqueItemsMap.values());
            }
        }
    });

    return result;
});

const handleFilterToggle = async (filterName, value) => {
    let filterString = '';

    console.log(filterName, value);

    const isSelected = isSelectedFilter(filterName, value);

    if (isSelected) {
        const index = filterData.value.indexOf(isSelected);
        filterData.value.splice(index, 1);
    } else {
        filterData.value.push([filterName, value]);
    }

    filterData.value.forEach(([name, value], index) => {
        filterString += `meta_data.${name} ~ '${value}'`;
        if (index !== filterData.value.length - 1) filterString += ' || ';
    });

    emit('filter-change', { filter: filterString });
};
</script>

<style scoped>
.filter-heading {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
    border-radius: 5px 5px 0 0;
    display: none;
}

.filter-name {
    font-size: 18px;
    font-weight: 700;
    border-bottom: 1px solid rgba(0, 0, 0, 0.062);
    padding-bottom: 5px;
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
</style>
