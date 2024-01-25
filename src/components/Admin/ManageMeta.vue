<template>
    <div class="manage-metas-wrapper">
        <LoadingOverlay v-if="metaLoading" background="transparent" color="black" />
        <div class="manage-metas">
            <h3 class="heading">Manage Products Metadata</h3>
            <div class="add-new-wrap" @click="showAddMeta = !showAddMeta">
                <i class="fa-solid fa-square-plus"></i>
                <span>Add New</span>
            </div>
            <div class="add-meta-wrap" :class="{ expanded: showAddMeta }">
                <form @submit.prevent="handleAddNewMeta" class="add-meta-content">
                    <div class="add-meta-content-heading">
                        <h3 class="meta-block-name">Add New</h3>
                    </div>

                    <div class="meta-inputs-wrap">
                        <div class="add-meta-single-input-wrap">
                            <label for="add-new-meta-name">Meta Block</label>
                            <input
                                type="text"
                                name="add-new-meta-name"
                                id="add-new-meta-name"
                                placeholder="Color, Size, etc.."
                                v-model.trim="addNewMetaDataValues.data_name.value"
                                @change="addNewMetaDataValues.data_name.error = false"
                            />
                            <div class="error-message" v-if="addNewMetaDataValues.data_name.error">Field can't be empty</div>
                        </div>

                        <div class="add-meta-single-input-wrap">
                            <label for="add-new-name">Name</label>
                            <input
                                type="text"
                                name="add-new-name"
                                id="add-new-name"
                                v-model.trim="addNewMetaDataValues.name.value"
                                @change="addNewMetaDataValues.name.error = false"
                            />
                            <div class="error-message" v-if="addNewMetaDataValues.name.error">Field can't be empty</div>
                        </div>
                        <div class="add-meta-single-input-wrap">
                            <label for="add-new-value">Value</label>
                            <input
                                type="text"
                                name="add-new-value"
                                id="add-new-value"
                                v-model.trim="addNewMetaDataValues.value.value"
                                @change="addNewMetaDataValues.value.error = false"
                            />
                            <div class="error-message" v-if="addNewMetaDataValues.value.error">Field can't be empty</div>
                        </div>
                    </div>

                    <button type="submit" class="button-main add-new-button">Add New</button>
                </form>
            </div>

            <div class="metas-block">
                <div class="metas-data" v-for="(mainMetaValue, mainMetaKey, mainMetaIndex) of newMeta" :key="mainMetaIndex">
                    <h3 class="meta-block-name">{{ mainMetaValue.name }}</h3>

                    <div class="divider"></div>

                    <div class="metas-wrap">
                        <div class="meta-data-wrap">
                            <div class="single-meta-item" v-for="(value, index) of mainMetaValue.data" :key="value.id">
                                <div class="single-input-wrap">
                                    <label :for="value.name + index">Name</label>
                                    <input type="text" :name="value.name + index" :id="value.name + index" v-model="value.name" />
                                </div>
                                <div class="single-input-wrap">
                                    <label :for="value.value + index">Value</label>
                                    <div class="value-wrap">
                                        <input
                                            type="text"
                                            class="value-input"
                                            :name="value.value + index"
                                            :id="value.value + index"
                                            v-model="value.value"
                                        />
                                        <div class="color-select-wrap" v-if="isValidHexCode(value.value)">
                                            <label :for="'color-select' + value.value + index" class="color-select-label">
                                                <div class="color-block" :style="{ backgroundColor: value.value }"></div>
                                            </label>

                                            <input
                                                type="color"
                                                class="color-select-input"
                                                :name="'color-select' + value.value + index"
                                                :id="'color-select' + value.value + index"
                                                @change="value.value = $event.target.value"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div class="meta-actions-wrap">
                                    <p class="save-meta link-underline" @click="saveMeta(value.id, mainMetaKey, index)">
                                        {{ metaSaving[mainMetaKey][index] ? 'Saving..' : 'Save' }}
                                    </p>
                                    <p class="delete-meta link-underline" @click="deleteMeta(value.id, mainMetaKey, index)">
                                        {{ metaDeleting[mainMetaKey][index] ? 'Deleting..' : 'Delete' }}
                                    </p>
                                </div>
                                <LoadingOverlay
                                    background="transparent"
                                    color="black"
                                    v-if="metaSaving[mainMetaKey][index] || metaDeleting[mainMetaKey][index]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useStore } from 'vuex';
import isValidHexCode from '../../helpers/isValidHexCode';
import LoadingOverlay from '../LoadingOverlay.vue';

const store = useStore();

const meta = ref(null);

const newMeta = ref(null);

const metaLoading = ref(false);
const metaSaving = reactive({});
const metaDeleting = reactive({});

const showAddMeta = ref(false);
const addNewMetaDataValues = reactive({
    data_name: { value: '', error: false },
    name: { value: '', error: false },
    value: { value: '', error: false },
});

const resetNewMetaValues = () => Object.keys(addNewMetaDataValues).forEach((key) => (addNewMetaDataValues[key].value = ''));

watch(meta, (value) => {
    if (value) newMeta.value = JSON.parse(JSON.stringify(value));
});

const handleAddNewMeta = async () => {
    for (let key of Object.keys(addNewMetaDataValues)) {
        if (!addNewMetaDataValues[key].value) addNewMetaDataValues[key].error = true;
    }

    const isError = Object.keys(addNewMetaDataValues).some((key) => addNewMetaDataValues[key].error);

    if (isError) return;

    const data = {
        data_name: addNewMetaDataValues.data_name.value,
        name: addNewMetaDataValues.name.value,
        value: addNewMetaDataValues.value.value,
    };

    try {
        metaLoading.value = true;
        await store.dispatch('addMetaData', data);
        resetNewMetaValues();
        await getAllMetaData();
    } catch (error) {
        console.log(error);
    }
};

const saveMeta = async (metaId, mainMetaKey, index) => {
    const metaData = new FormData();

    const keysToUpdate = ['name', 'value'];

    Object.keys(newMeta.value[mainMetaKey].data[index]).forEach((key) => {
        if (keysToUpdate.includes(key)) {
            metaData.append(key, newMeta.value[mainMetaKey].data[index][key]);
        }
    });

    try {
        metaSaving[mainMetaKey][index] = true;
        await store.dispatch('updateMetaData', { metaId, metaData });
    } catch (error) {
        console.log(error);
    } finally {
        metaSaving[mainMetaKey][index] = false;
    }
};

const deleteMeta = async (metaId, mainMetaKey, index) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this meta?');

    if (!isConfirmed) return;

    try {
        metaDeleting[mainMetaKey][index] = true;

        await store.dispatch('deleteMetaData', metaId);
        getAllMetaData();
    } catch (error) {
        console.log(error);
    } finally {
        metaDeleting[mainMetaKey][index] = false;
    }
};

const getAllMetaData = async () => {
    try {
        metaLoading.value = true;
        const response = await store.dispatch('getAllMetaData');

        const newData = {};

        for (let item of response) {
            if (!newData[item.data_name]) newData[item.data_name] = { name: item.data_name, data: [] };
            newData[item.data_name].data.push(item);
        }

        for (let key of Object.keys(newData)) {
            metaSaving[key] = {};
            metaDeleting[key] = {};
            newData[key].data.forEach((item, index) => {
                metaSaving[key][index] = false;
                metaDeleting[key][index] = false;
            });
        }
        meta.value = newData;
    } catch (error) {
        console.log(error);
    } finally {
        metaLoading.value = false;
    }
};

onMounted(() => {
    getAllMetaData();
});
</script>

<style scoped>
.metas-block {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.meta-block-name {
    font-size: 24px;
    font-weight: 600;
    line-height: 1em;
}

.meta-data-wrap {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}
.single-meta-item {
    display: flex;
    width: fit-content;
    padding: 20px;
    padding-bottom: 45px;
    background-color: #005bff1c;
    gap: 10px;
    position: relative;
    border-radius: 5px;
}
.single-input-wrap {
    display: flex;
    flex-direction: column;
}

.add-meta-wrap {
    display: grid;
    grid-template-rows: 0fr;
    /* overflow: hidden; */
    transition: 0.3s;
}

.add-meta-content {
    min-height: 0;
    transition: 0.3s;
    visibility: hidden;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0px;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 3px 5px #0000000f;
    overflow: hidden;
}

.meta-inputs-wrap {
    display: flex;
    gap: 10px;
}

.add-meta-single-input-wrap {
    display: flex;
    flex-direction: column;
}

.add-meta-wrap.expanded {
    grid-template-rows: 1fr;
}
.add-meta-wrap.expanded .add-meta-content {
    visibility: visible;
    padding: 25px;
    margin-bottom: 20px;
}

.meta-actions-wrap {
    position: absolute;
    left: 20px;
    bottom: 10px;
}

.delete-meta {
    cursor: pointer;
    color: rgb(199, 0, 0);
    transition: 0.2s;
}

.save-meta {
    cursor: pointer;
    color: #004ad4;
    transition: 0.2s;
}

.value-input {
    position: relative;
}

.color-select-wrap {
    position: absolute;
    top: calc(50% - 1px);
    right: 21px;
    height: 16px;
    transform: translateY(-50%);
}
.color-select-label {
    width: 16px;
    height: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.color-block {
    height: 16px;
    width: 16px;
    border-radius: 100%;
}

.color-select-input {
    opacity: 0;
    visibility: hidden;
    width: 20px;
    height: 20px;
    transform: translateY(-100%);
}

.manage-metas-wrapper {
    position: relative;
    height: 100%;
    background-color: #f6faff;
}

.manage-metas {
    padding: 25px;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: auto;
}

.metas-wrap {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.heading {
    font-size: 30px;
    font-weight: 600;
}

.metas-data {
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 3px 5px #0000000f;
    padding: 25px;
}

.divider {
    background-color: rgba(0, 0, 0, 0.082);
    height: 1px;
    margin: 20px 0;
}

.link-underline {
    text-decoration: 1px underline transparent;
    transition: 0.2s;
}
.link-underline:hover {
    text-decoration-color: inherit;
}

.add-new-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    width: fit-content;
    cursor: pointer;
    margin: 15px 0 25px 0;
}

.add-new-wrap:hover i {
    color: #0059ff;
}

.add-new-wrap i {
    font-size: 30px;
    color: #0050e6;
    transition: 0.2s;
}

.meta-actions-wrap {
    display: flex;
    gap: 10px;
}

.add-meta-single-input-wrap input {
    padding: 5px;
}
.add-meta-single-input-wrap input::placeholder {
    font-size: 14px;
    font-style: italic;
}

.add-new-button {
    margin-top: 10px;
    padding: 5px 20px;
    background-color: #004ad4;
}

.add-new-button:hover {
    background-color: #0059ff;
}
</style>
