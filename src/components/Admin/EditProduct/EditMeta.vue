<template>
    <div class="add-new-meta-wrap" @click.prevent="addNewMetaVisible = !addNewMetaVisible">
        <i class="fa-solid fa-square-plus"></i>
        <span>Add New</span>
    </div>

    <div v-if="addNewMetaVisible" class="add-new-meta-block-wrap">
        <div class="single-meta-input-wrap">
            <label for="add-new-meta-block-name">Meta</label>
            <select
                class="meta-select"
                name="add-new-meta-block-name"
                id="add-new-meta-block-name"
                @change="selectedMetaBlockToAdd = $event.target.value"
            >
                <option value="not-available" v-if="availableMetaBlocksSelections && !Object.keys(availableMetaBlocksSelections).length">
                    All available meta blocks added
                </option>
                <option
                    :value="optionKey"
                    v-for="(optionValue, optionKey, optionIndex) of availableMetaBlocksSelections"
                    :key="'meta-option-' + optionKey + '-' + optionIndex"
                >
                    {{ optionKey }}
                </option>
            </select>
        </div>

        <div class="single-meta-input-wrap" v-if="selectedMetaBlockToAdd">
            <label for="add-new-meta-name">Name</label>
            <select class="meta-select" name="add-new-meta-name" id="add-new-meta-name" v-model="selectedMetaName">
                <option
                    :value="metaNameValue"
                    v-for="metaNameValue of availableMetaBlocksSelections[selectedMetaBlockToAdd]?.data"
                    :key="'meta-name-option-' + metaNameValue.id"
                >
                    {{ metaNameValue.name }}
                </option>
            </select>
        </div>

        <button v-if="selectedMetaBlockToAdd" @click="handleAddNewMetaBlock(selectedMetaName)" class="add-new-meta-block-button button-main">
            Add
        </button>
    </div>

    <div v-if="!metaBlocksEmpty" class="meta-blocks-wrap">
        <div class="single-meta-block" v-for="(metaValue, metaKey, metaIndex) of availableMetaBlocks" :key="metaKey + metaIndex">
            <h4 class="meta-block-name">{{ metaKey }}</h4>
            <div class="meta-input-wrap">
                <input
                    type="text"
                    name="meta-input"
                    :id="'meta-input-' + metaKey + metaIndex"
                    placeholder="Add available meta.."
                    @focus="availableMetaVisible[metaKey] = true"
                    @focusout="closeAvailableMeta(metaKey)"
                    v-model="availableMetaFilterValues[metaKey]"
                />

                <ul v-if="availableMeta && availableMetaVisible[metaKey]" class="available-meta-selections">
                    <li
                        class="single-meta-selection"
                        v-for="metaSelection of availableSelectionData(metaKey)"
                        :key="'meta-selection-' + metaSelection.id"
                        @click="handleAddMeta(metaSelection)"
                    >
                        {{ metaSelection.name }}
                    </li>

                    <li
                        v-if="!availableSelectionData(metaKey)?.length"
                        class="single-meta-selection"
                        :key="'meta-selection-not-available-' + metaKey + '-' + metaIndex"
                    >
                        Not available
                    </li>
                </ul>
            </div>
            <div class="divider"></div>
            <div class="selected-meta-wrap">
                <div class="single-meta-wrap" v-for="meta of metaValue.data" :key="meta.id">
                    <div class="single-meta">
                        <div class="color-block-wrap" v-if="isValidHexCode(meta.value)">
                            <div class="color-block" :style="{ backgroundColor: meta.value }"></div>
                        </div>
                        <div class="meta-name-wrap" :style="{ paddingLeft: !isValidHexCode(meta.value) && '10px' }">
                            <p class="meta-name">{{ meta.name }}</p>
                        </div>
                        <i class="fa-solid fa-xmark meta-remove-icon" @click="handleRemoveMeta(meta)"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <p v-else>No meta data added.</p>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useStore } from 'vuex';
import isValidHexCode from '../../../helpers/isValidHexCode';

const props = defineProps({
    meta: { default: null },
    product: { default: null },
});

const emit = defineEmits(['meta-change']);

const store = useStore();

const addNewMetaVisible = ref(false);
const availableMeta = ref(null);
const availableMetaVisible = reactive({});
const availableMetaFilterValues = reactive({});
const metaBlocksEmpty = ref(false);

const newMetaItems = ref(Object.keys(props.meta).length ? JSON.parse(JSON.stringify(props.meta)) : {});

const availableMetaBlocks = computed(() => {
    const filteredAvailableMeta = {};

    for (let key of Object.keys(newMetaItems.value)) {
        if (newMetaItems.value[key].data.length) filteredAvailableMeta[key] = newMetaItems.value[key];
    }

    Object.keys(filteredAvailableMeta).length ? (metaBlocksEmpty.value = false) : (metaBlocksEmpty.value = true);

    return filteredAvailableMeta;
});

const handleAddNewMetaBlock = (metaItem) => {
    if (!Object.keys(availableMetaBlocksSelections.value).length) return;

    newMetaItems.value[metaItem.data_name] = { name: metaItem.data_name, data: [metaItem] };

    emit('meta-change', newMetaItems.value);
};

const selectedMetaBlockToAdd = ref('');

watch(selectedMetaBlockToAdd, (val) => {
    if (availableMetaBlocksSelections.value[val]?.data) selectedMetaName.value = availableMetaBlocksSelections.value[val].data[0];
});

const selectedMetaName = ref('');

const availableMetaBlocksSelections = computed(() => {
    if (!availableMeta.value) return;

    const available = {};

    for (let key of Object.keys(availableMeta.value)) {
        if (availableMetaBlocks.value[key]) continue;
        available[key] = availableMeta.value[key];
    }

    selectedMetaBlockToAdd.value = Object.keys(available)[0];

    return available;
});

const availableSelectionData = computed(() => {
    return (dataBlockKey) => {
        const filteredItems = availableMeta.value[dataBlockKey].data.filter((item) =>
            newMetaItems.value[dataBlockKey].data.every((dataItem) => dataItem.id !== item.id)
        );

        return filteredItems.filter((item) => {
            if (!availableMetaFilterValues[dataBlockKey]) return true;

            return item.name.toLowerCase().includes(availableMetaFilterValues[dataBlockKey].toLowerCase());
        });
    };
});

const closeAvailableMeta = (metaKey) => {
    setTimeout(() => {
        availableMetaVisible[metaKey] = false;
    }, 100);
};

const handleAddMeta = (meta) => {
    newMetaItems.value[meta.data_name].data.push(meta);
    emit('meta-change', newMetaItems.value);
};
const handleRemoveMeta = (meta) => {
    newMetaItems.value[meta.data_name].data = newMetaItems.value[meta.data_name].data.filter((item) => item.id !== meta.id);
    emit('meta-change', newMetaItems.value);
};

onMounted(async () => {
    try {
        const response = await store.dispatch('getAllMetaData');

        const responseCopy = JSON.parse(JSON.stringify(response));

        const availableMetaData = {};

        for (let item of responseCopy) {
            if (!availableMetaData[item.data_name]) availableMetaData[item.data_name] = { name: item.data_name, data: [] };
            availableMetaData[item.data_name].data.push(item);
        }

        availableMeta.value = availableMetaData;
    } catch (error) {
        console.log(error);
    }
});
</script>

<style scoped>
.single-meta-wrap {
    width: fit-content;
}

.meta-blocks-wrap {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.single-meta-block {
    background-color: rgba(0, 140, 255, 0.11);
    padding: 20px;
    border-radius: 10px;
}
.meta-block-name {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 10px;
}
.single-meta {
    height: 32px;
    display: flex;
    align-items: center;
    border-radius: 25px;
    position: relative;
    background-color: white;
    box-shadow: 0 3px 3px 0 #00000014;
}

.color-block-wrap {
    padding: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
.color-block {
    width: 16px;
    height: 16px;
    border-radius: 100%;
}

.meta-name-wrap {
    display: flex;
    align-items: center;
    height: 100%;
    transition: 0.2s;
}

.meta-name {
    padding: 0 30px;
    padding-left: 0;
}

.meta-remove-icon {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    font-size: 13px;
    cursor: pointer;
    transition: 0.2s;
}

.meta-remove-icon:hover {
    color: rgb(189, 0, 0);
}

.meta-input-wrap {
    display: flex;
    flex-direction: column;
    position: relative;
    width: fit-content;
}

.meta-input-wrap input::placeholder {
    font-size: 14px;
    font-style: italic;
}

.available-meta-selections {
    position: absolute;
    bottom: 0;
    left: 0;
    transform: translateY(100%);
    background-color: white;
    width: 100%;
    z-index: 9;
    box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.329);
}

.single-meta-selection {
    padding: 5px;
    transition: 0.2s;
}
.single-meta-selection:hover {
    background-color: #0000000f;
    cursor: pointer;
}

.selected-meta-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.add-new-meta-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    width: fit-content;
    cursor: pointer;
    margin: 15px 0;
}

.add-new-meta-wrap:hover i {
    color: #0059ff;
}

.add-new-meta-wrap i {
    font-size: 30px;
    color: #0050e6;
    transition: 0.2s;
}

.add-new-meta-block-wrap {
    display: flex;
    gap: 20px;
    align-items: end;
    margin-bottom: 25px;
}

.add-new-meta-block-wrap label {
    font-weight: 500;
}

.single-meta-input-wrap {
    display: flex;
    flex-direction: column;
    min-width: 150px;
}

.add-new-meta-block-button {
    height: fit-content;
}

.meta-select {
    padding: 5px;
    outline: none;
}

.button-main {
    padding: 5px 15px;
}

.meta-input-wrap input {
    padding: 5px;
    border-radius: 3px;
    border: 1px solid lightgray;
    outline: none;
    transition: 0.2s;
}
.meta-input-wrap input:focus-visible {
    border: 1px solid gray;
}

.divider {
    background-color: rgba(0, 0, 0, 0.082);
    height: 1px;
    margin: 20px 0;
}
</style>
