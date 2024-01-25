<template>
    <div class="meta-blocks-wrap">
        <div class="single-meta-block" v-for="(metaValue, metaKey, metaIndex) of productMeta" :key="'product-meta-' + metaKey + metaIndex">
            <h4 class="meta-block-name">{{ metaKey }}</h4>

            <div class="meta-options-wrap">
                <div
                    class="single-meta-block-option"
                    v-for="metaItem of metaValue.data"
                    :key="metaItem.id"
                    :class="{ selected: selectedMeta[metaItem.data_name].id === metaItem.id }"
                    @click="selectedMeta[metaItem.data_name] = metaItem"
                >
                    <div class="meta-block-option-color" v-if="isValidHexCode(metaItem.value)" :style="{ backgroundColor: metaItem.value }"></div>
                    <span class="meta-block-option-name">{{ metaItem.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import isValidHexCode from '../../helpers/isValidHexCode';

const props = defineProps({
    productMeta: { default: [] },
    selectedMeta: { default: {} },
});
</script>

<style scoped>
.meta-blocks-wrap {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.meta-options-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.meta-block-option-color {
    width: 18px;
    height: 18px;
    border-radius: 100%;
}

.single-meta-block-option {
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 2px 5px 0 rgb(0 0 0 / 10%);
    padding: 5px 10px;
    border-radius: 1em;
    transition: 0.2s;
    font-size: 14px;
}

.single-meta-block-option.selected,
.single-meta-block-option:hover {
    background-color: rgb(255, 123, 0);
    color: white;
    cursor: pointer;
}

.meta-block-name {
    font-weight: 500;
    display: block;
    margin-bottom: 5px;
}
</style>
