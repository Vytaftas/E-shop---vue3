<template>
    <pre>
        {{ newMeta }}   
    </pre>
    <div class="manage-metas-wrapper">
        <LoadingOverlay v-if="metaLoading" background="transparent" color="black" />
        <div class="manage-metas">
            <h3 class="heading">Manage Products Metadata</h3>
            <div class="add-new-wrap" @click="addNewMeta">
                <i class="fa-solid fa-square-plus"></i>
                <span>Add New</span>
            </div>

            add new meta name - name - value

            <div class="metas-block">
                <div class="metas-data" v-for="(mainMetaValue, mainMetaKey, mainMetaIndex) of newMeta" :key="mainMetaIndex">
                    <h3 class="meta-block-name">{{ mainMetaValue.name }}</h3>

                    <div class="divider"></div>

                    <div class="metas-wrap">
                        <div class="meta-data-wrap">
                            <div class="single-meta-item" v-for="(value, index) of mainMetaValue.data" :key="value.id">
                                <!-- <div class="single-input-wrap">
                                    <label :for="mainMetaValue.name + index">Meta Name</label>
                                    <input
                                        type="text"
                                        :name="mainMetaValue.name + index"
                                        :id="mainMetaValue.name + index"
                                        v-model="mainMetaValue.name"
                                    />
                                </div> -->
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
                                        <div class="color-select-wrap">
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
                                    <p class="save-meta link-underline">Save</p>
                                    <p class="delete-meta link-underline">Delete</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { inject, onMounted, reactive, ref, watch } from 'vue';
import { useStore } from 'vuex';
import isValidHexCode from '../../helpers/isValidHexCode';
import LoadingOverlay from '../LoadingOverlay.vue';

const store = useStore();

const eventBus = inject('eventBus');

const meta = ref(null);
const paginationData = ref(null);

const newMeta = ref(null);

const metaLoading = ref(false);
const metaSaving = reactive({});
const metaDeleting = reactive({});

// eventBus.on('permissions-save', () => getAllMetaData());
// eventBus.on('new-permissions-save', (data) => {
//     newmetas.value[data.index].expand = { permissions_id: data.permissions };
// });

// const metaImage = (id, imageUrl) => {
//     if (!imageUrl) return { backgroundImage: `url('${NoImage}')` };

//     if (typeof imageUrl === 'object') {
//         const urlImg = URL.createObjectURL(imageUrl);
//         return { backgroundImage: `url('${urlImg}')` };
//     } else {
//         const url = `https://my-shop-app.pockethost.io/api/files/metas/${id}/${imageUrl}`;
//         return { backgroundImage: `url('${url}')` };
//     }
// };

watch(meta, (value) => {
    if (value) newMeta.value = JSON.parse(JSON.stringify(value));
});

// const handleImageChange = (e, index) => {
//     const file = e.target.files[0];

//     console.log(index);

//     if (!file) return (newmetas.value[index].avatar = ''); // set to no img

//     const reader = new FileReader();
//     reader.onload = () => {
//         newmetas.value[index].avatar = file;
//     };
//     reader.readAsDataURL(file);
// };

// const handleOpenModal = (data, index) => store.dispatch('openModal', { component: markRaw(EditPermissions), data: { permissions: data, index } });

// const addNewMeta = () => {
//     newmetas.value.unshift({
//         name: 'Name',
//         metaname: 'metaname',
//         cart_id: '',
//         expand: {
//             permissions_id: {
//                 add_categories: false,
//                 add_products: false,
//                 add_metas: false,
//                 delete_categories: false,
//                 delete_products: false,
//                 delete_metas: false,
//                 edit_categories: false,
//                 edit_products: false,
//                 edit_metas: false,
//                 isNew: true,
//             },
//         },
//         permissions_id: '',
//         email: 'email@email.com',
//         avatar: '',
//         new: true,
//     });
// };

// const savemeta = async (metaId, index) => {
//     const metaData = new FormData();

//     console.log(newmetas.value[0]);

//     const keysToUpdate = ['avatar', 'name', 'metaname', 'email'];
//     const ff = {};

//     Object.keys(newmetas.value[index]).forEach((key) => {
//         if (keysToUpdate.includes(key)) {
//             metaData.append(key, newmetas.value[index][key]);
//             ff[key] = newmetas.value[index][key];
//         }
//     });

//     console.log(ff);

//     try {
//         metasSaving[index] = true;
//         console.log(newmetas.value[index]);
//         if (newmetas.value[index].new) {
//             delete newmetas.value[index].expand.permissions_id.isNew;

//             const password = generatePassword(8);

//             metaData.append('emailVisibility', true);
//             metaData.append('password', password);
//             metaData.append('passwordConfirm', password);

//             await store.dispatch('addmeta', { metaData, newPermissions: newmetas.value[index].expand.permissions_id });
//             await getAllMetaData();
//         } else {
//             await store.dispatch('updatemeta', { metaId, metaData });
//         }
//     } catch (error) {
//         console.log(error);
//     } finally {
//         metasSaving[index] = false;
//     }
// };

// const deletemeta = async (meta, index) => {
//     if (newmetas.value[index].new) return newmetas.value.splice(index, 1);

//     const isConfirmed = window.confirm('Are you sure you want to delete this meta?');

//     if (!isConfirmed) return;

//     try {
//         metasDeleting[index] = true;

//         await store.dispatch('deletemeta', meta);
//         await getAllMetaData();
//     } catch (error) {
//         console.log(error);
//     } finally {
//         metasDeleting[index] = false;
//     }
// };

const getAllMetaData = async () => {
    try {
        metaLoading.value = true;
        const response = await store.dispatch('getAllMetaData');

        console.log(response);

        const data = {};

        for (let item of response) {
            if (!data[item.data_name]) data[item.data_name] = { name: item.data_name, data: [] };
            data[item.data_name].data.push(item);
        }

        meta.value = data;
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
}
.single-input-wrap {
    display: flex;
    flex-direction: column;
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

/*  */
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
    overflow: hidden;
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
    overflow: auto;
}

.single-meta {
    display: flex;
    align-items: center;
}

.meta-headings .meta-image-heading {
    padding: 10px 0px;
    min-height: initial;
    min-width: initial;
}

.meta-name {
    font-size: 18px;
    font-weight: 500;
}

.divider {
    background-color: rgba(0, 0, 0, 0.082);
    height: 1px;
    margin: 10px 0;
}

.link-underline {
    text-decoration: 1px underline transparent;
    transition: 0.2s;
}
.link-underline:hover {
    text-decoration-color: inherit;
}
.meta-headings {
    font-weight: 500;
}

.editable {
    border: none;
    outline: none;
    padding: 0;
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

/* img */

.meta-image-label {
    display: flex;
    flex-direction: column;

    max-width: 200px;

    cursor: pointer;
}

.meta-image-label:hover .meta-image-overlay {
    opacity: 1;
}

.meta-image-overlay {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: 0.3s;
    font-size: 36px;
    color: white;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.212);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
}

.hidden {
    display: none;
}

.meta-actions-wrap {
    display: flex;
    gap: 10px;
}

.button-main {
    padding: 3px 10px;
}

.save-button {
    background-color: #004ad3;
}
.save-button:hover {
    background-color: #0058fc;
}
.delete-button {
    background-color: rgb(214, 0, 0);
}
.delete-button:hover {
    background-color: rgb(255, 0, 0);
}

.edit-button {
    color: #004ad3;
    cursor: pointer;
}
</style>
