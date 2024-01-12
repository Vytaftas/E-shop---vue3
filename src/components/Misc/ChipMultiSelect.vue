<template>
    <div class="chip-multi-select">
        <div class="available-items-block">
            <span class="input-label">Categories</span>
            <input class="available-items-input" type="text" :placeholder="placeholder" @focus="listVisible = true" @focusout="closeList" />

            <ul class="available-items-list" v-if="listVisible">
                <li
                    class="single-available-item"
                    v-for="availableItem of availableItemsWithoutSelectedItems"
                    :key="availableItem.id"
                    @click="addSelectedItem(availableItem)"
                >
                    {{ availableItem.name }}
                </li>
            </ul>
        </div>

        <div class="selected-items-wrap">
            <div class="single-item" v-for="item of newSelectedItems" :key="item">
                <div class="item-button">
                    <span class="category-name">{{ item.name }}</span>
                    <i class="fa-solid fa-xmark item-remove-icon" @click.prevent="handleRemoveCategory(item)"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const emit = defineEmits(['items-change']);

const props = defineProps({
    availableItems: { default: null },
    selectedItems: { default: null },
    placeholder: { default: 'Select item' },
    label: { default: 'Your items' },
});

const listVisible = ref(false);

const newSelectedItems = ref(JSON.parse(JSON.stringify(props.selectedItems)));

const availableItemsWithoutSelectedItems = computed(() =>
    props?.availableItems?.filter((item) => !newSelectedItems.value.some((selectedItem) => selectedItem.id === item.id))
);

const addSelectedItem = (item) => {
    newSelectedItems.value = [...newSelectedItems.value, item];
    emit('items-change', newSelectedItems.value);
};

const handleRemoveCategory = (currentItem) => {
    if (!newSelectedItems.value.length) return;

    newSelectedItems.value = newSelectedItems.value.filter((item) => item.id !== currentItem.id);

    emit('items-change', newSelectedItems.value);

    // const newSelectedItems = newSelectedItems.value.value.filter((item) => !props.product.expand.categories.includes(item)); //images to add
    // const originalCategories = newSelectedItems.value.value.filter((item) => props.product.expand.categories.includes(item));

    // const isTheSame = arraysAreEqual(originalCategories, props.product.expand.categories); // use to upload changed existing images

    // newSelectedItems.value.changed = !arraysAreEqual(props.product.expand.categories, newSelectedItems.value.value);
};

const closeList = () => {
    setTimeout(() => {
        listVisible.value = false;
    }, 100);
};
</script>

<style scoped>
.chip-multi-select {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.available-items-block {
    position: relative;
    width: fit-content;
}

.available-items-input {
    padding: 5px 10px;
    border: none;
    outline: none;
    border: 1px solid rgb(156, 156, 156);
    transition: 0.2s;
    border-radius: 3px;
}

.available-items-input:focus-visible {
    border-color: black;
}

.available-items-input::placeholder {
    font-size: 14px;
}

.available-items-list {
    position: absolute;
    bottom: 0;
    left: 0;
    transform: translateY(100%);
    background-color: white;
    width: 100%;
    transition: 0.2s;
    z-index: 5;
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.048);
}

.single-available-item {
    padding: 5px 10px;
    font-size: 14px;
    cursor: pointer;
    color: rgb(100, 100, 100);
}

.single-available-item:hover {
    color: black;
    background-color: rgb(230, 230, 230);
}

.selected-items-wrap {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
}

.single-item {
    background-color: #0071ff;
    color: white;
    display: flex;
    justify-content: center;
    width: fit-content;
    padding: 3px 10px;
    padding-right: 24px;
    position: relative;
    border-radius: 10px;
    font-size: 14px;
}

.item-button {
    display: flex;
    justify-content: center;
    align-items: center;
}

.item-remove-icon {
    cursor: pointer;
    position: absolute;
    right: 8px;
    font-size: 12px;
    top: calc(50% + 0.5px);
    transform: translateY(-50%);
}

.input-label {
    font-weight: 500;
    margin-bottom: 3px;
    display: block;
}
</style>
