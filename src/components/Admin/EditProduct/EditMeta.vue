<template>
    <div class="product-meta-data" v-if="newMetaData.value">
        <div class="add-new-meta-wrap" @click.prevent="addMetaBlock">
            <i class="fa-solid fa-square-plus"></i>
            <span>Add New</span>
        </div>
        <div class="flex-column" v-for="(value, dataIndex) of newMetaData.value" :key="value.name + '-' + dataIndex">
            <i class="fa-solid fa-xmark remove-meta-block-icon" @click.prevent="removeMetaBlock(dataIndex)"></i>
            <div class="meta-heading-wrap">
                <div class="meta-name-input-wrap">
                    <input
                        type="text"
                        :value="newMetaData.value[dataIndex].name"
                        @change="handleMetaBlockNameChange($event, dataIndex)"
                        class="meta-name-input"
                    />
                    <p class="error-message" v-if="!newMetaData.value[dataIndex].name.trim()">Meta name can't be empty.</p>
                </div>
                <div class="checkbox-wrap">
                    <input
                        type="checkbox"
                        :id="'color-checkbox-' + dataIndex"
                        :checked="newMetaData.value[dataIndex].useColors"
                        @change="handleColorCheckboxChange($event, dataIndex)"
                    />
                    <label :for="'color-checkbox-' + dataIndex">Use colors?</label>
                </div>
            </div>

            <div class="meta-wrap-container">
                <div class="single-meta-wrap" v-for="(metaItem, index) of value.data" :key="metaItem.name + '-' + metaItem.value">
                    <div class="color-select-input-wrap">
                        <i class="fa-solid fa-xmark remove-meta-key-icon" @click.prevent="removeMetaItem(dataIndex, index)"></i>
                        <label v-if="value.useColors" :for="'color-select-' + metaItem.name + '-' + metaItem.value + '-' + index">
                            <div class="color-block" :style="{ backgroundColor: newMetaData.value[dataIndex].data[index].value }"></div>
                        </label>
                        <input
                            class="color-input"
                            type="color"
                            name="color-select"
                            :id="'color-select-' + metaItem.name + '-' + metaItem.value + '-' + index"
                            :value="newMetaData.value[dataIndex].data[index].value"
                            @change="handleMetaColorChange($event, dataIndex, index)"
                        />
                        <input
                            type="text"
                            :value="newMetaData.value[dataIndex].data[index].name"
                            @change="handleMetaNameChange($event, dataIndex, index)"
                        />

                        <p class="error-message" v-if="!newMetaData.value[dataIndex].data[index].name.trim()">Name can't be empty.</p>
                    </div>
                </div>

                <div class="add-new-meta-wrap" @click.prevent="addMetaItem(dataIndex)">
                    <i class="fa-solid fa-square-plus"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    meta: { default: null },
    product: { default: null },
});

const emit = defineEmits(['meta-change']);

const newMetaData = ref(JSON.parse(JSON.stringify(props.meta)));

const addMetaBlock = () => {
    const isDuplicateKey = (keyName, count = 1) => {
        const name = keyName + '_' + count;

        const exists = Object.keys(newMetaData.value.value).some((key) => {
            console.log(newMetaData.value.value[key].name);
            console.log(name);
            return newMetaData.value.value[key].name === name;
        });

        if (exists) {
            console.log('in exists');
            count++;
            return isDuplicateKey(keyName, count);
        }

        return name;
    };

    const newKeyName = isDuplicateKey('new_meta');

    newMetaData.value.value[newKeyName] = { name: newKeyName, data: [], useColors: false };

    emit('meta-change', newMetaData.value);
};

const removeMetaBlock = (key) => {
    delete newMetaData.value.value[key];
    emit('meta-change', newMetaData.value.value);
};

const handleMetaBlockNameChange = (e, index) => {
    newMetaData.value.value[index].name = e.target.value;
    emit('meta-change', newMetaData.value.value);
};

const addMetaItem = (index) => {
    const itemValue = newMetaData.value.value[index].useColors ? '#FFFFFF' : '';
    newMetaData.value.value[index].data.push({ name: '', value: itemValue });
    emit('meta-change', newMetaData.value.value);
};
const removeMetaItem = (dataIndex, index) => {
    console.log(newMetaData.value.value);
    newMetaData.value.value[dataIndex].data.splice(index, 1);
    emit('meta-change', newMetaData.value.value);
};

const handleColorCheckboxChange = (e, index) => {
    newMetaData.value.value[index].useColors = e.target.checked;
    emit('meta-change', newMetaData.value.value);
};

const handleMetaColorChange = (e, key, index) => {
    newMetaData.value.value[key].data[index].value = e.target.value;
    emit('meta-change', newMetaData.value.value);
};

const handleMetaNameChange = (e, key, index) => {
    newMetaData.value.value[key].data[index].name = e.target.value;
    if (!newMetaData.value.value[key].useColors) newMetaData.value.value[key].data[index].value = e.target.value;
    emit('meta-change', newMetaData.value.value);
};
</script>

<style scoped>
.flex-column {
    display: flex;
    flex-direction: column;
    position: relative;
}

.product-meta-data {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.meta-wrap-container {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.color-select-input-wrap {
    display: flex;
    align-items: center;
    background-color: white;
    max-width: 200px;
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.068);
    border-radius: 3px;
    position: relative;
    height: 36px;
}

.color-select-input-wrap label {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: rgba(0, 140, 255, 0.11);
    border-radius: 3px 0 0 3px;
    cursor: pointer;
}

.color-select-input-wrap input {
    padding: 0;
    background-color: transparent;
    border: none;
    border-radius: 0;
    outline: none;
    padding: 5px 10px;
    font-size: 14px;
    padding-right: 24px;
    height: 100%;
}

.color-select-input-wrap input:focus-visible {
    border: none;
    outline: none;
}

.color-block {
    width: 18px;
    height: 18px;
    margin: 5px 10px;
    border-radius: 100%;
}

.color-select-input-wrap .color-input {
    opacity: 0;
    visibility: hidden;
    position: absolute;
    left: 0;
    top: 0;
}

.meta-heading-wrap {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-direction: column;
}

.meta-name-input-wrap {
    position: relative;
    margin-bottom: 10px;
}

.error-message {
    position: absolute;
    left: 0px;
    bottom: 0;
    transform: translateY(calc(100% + 1px));
}

.meta-heading-wrap input {
    width: fit-content;
}

.meta-heading-wrap .checkbox-wrap {
    display: flex;
    gap: 5px;
}

.product-meta-data .flex-column {
    background-color: #005bff1c;
    padding: 20px;
    border-radius: 5px;
    position: relative;
}

.remove-meta-block-icon {
    color: rgba(0, 0, 0, 0.493);
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
    transition: 0.2s;
}
.remove-meta-block-icon:hover {
    color: rgb(216, 0, 0);
}

.remove-meta-key-icon {
    color: rgba(0, 0, 0, 0.493);
    position: absolute;
    right: 8px;
    top: 50%;
    cursor: pointer;
    transform: translateY(-50%);
    transition: 0.2s;
    font-size: 14px;
}

.remove-meta-key-icon:hover {
    color: rgb(216, 0, 0);
}

.add-new-meta-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    width: fit-content;
    cursor: pointer;
}
.add-new-meta-wrap:hover i {
    color: #0059ff;
}

.add-new-meta-wrap i {
    font-size: 24px;
    color: #0050e6;
    transition: 0.2s;
}

.meta-heading-wrap .meta-name-input {
    background-color: transparent;
    border: none;
    border-bottom: 1px solid transparent;
    outline: none;
    padding: 0;
    border-radius: 0;
    transition: 0.2s;
    font-weight: 600;
    font-size: 18px;
    max-width: 100px;
}

.meta-heading-wrap .meta-name-input:focus-visible {
    border-color: black;
}
</style>
