<template>
    <!-- {
  "avatar": "",
  "cart_id": "kovm68nyp2lyui4",
  "collectionId": "_pb_users_auth_",
  "collectionName": "users",
  "created": "2023-12-21 13:31:34.581Z",
  "email": "gaga@gaga.lt",
  "emailVisibility": true,
  "id": "52x2jenzw1p5fyu",
  "name": "",
  "permissions_id": "mrr8sov51preqaa",
  "updated": "2024-01-03 14:32:49.087Z",
  "username": "gaga",
  "verified": false
} -->

    <!-- avatar, name, username, created, updated  -->
    <!-- cart_id, permissions_id,  -->
    <pre>
        <div v-if="newUsers?.length">
            {{ newUsers[0] }}
        </div>
        
    </pre>
    <div class="manage-users-wrapper">
        <LoadingOverlay v-if="usersLoading" background="transparent" color="black" />
        <div class="manage-users">
            <h3 class="heading">Manage Users</h3>
            <div class="add-new-wrap" @click="addNewUser">
                <i class="fa-solid fa-square-plus"></i>
                <span>Add New</span>
            </div>

            <div class="users-data">
                <div class="single-user user-headings">
                    <div class="user-image-heading">Image</div>
                    <div>Name</div>
                    <div>Username</div>
                    <div>Email</div>
                    <div>Permissions</div>
                    <div class="users-delete-heading">Actions</div>
                </div>

                <div class="divider"></div>

                <div class="users-wrap">
                    <div class="single-user" v-for="(user, index) of newUsers" :key="user.id">
                        <div class="user-image-block">
                            <label :for="'user-image' + index" class="user-image-label">
                                <div class="user-image centered-background" :style="userImage(user.id, user.avatar)">
                                    <div class="user-image-overlay">
                                        <i class="fa-solid fa-folder-plus user-image-icon"></i>
                                    </div>
                                </div>
                            </label>
                            <input
                                ref="fileInput"
                                type="file"
                                :name="'user-image' + index"
                                accept="image/gif, image/jpeg, image/png, image/webp"
                                :id="'user-image' + index"
                                class="hidden"
                                @change="handleImageChange($event, index)"
                            />
                        </div>

                        <div class="user-name-wrap">
                            <input class="user-name editable" type="text" v-model="user.name" />
                        </div>

                        <div class="user-name-wrap">
                            <input class="user-username editable" type="text" v-model="user.username" />
                        </div>

                        <div class="user-name-wrap">
                            <input class="user-email editable" type="text" v-model="user.email" />
                        </div>

                        <div class="user-permissions-wrap">
                            <span @click="handleOpenModal(user.expand.permissions_id)">Edit</span>
                        </div>

                        <div class="user-actions-wrap">
                            <button class="button-main save-button" @click="saveuser(user.id, index)">
                                {{ usersSaving[index] ? 'Saving..' : 'Save' }}
                            </button>
                            <button class="button-main delete-button" @click="deleteuser(user.id, index)">
                                {{ usersDeleting[index] ? 'Deleting..' : 'Delete' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import NoImage from '../../assets/no-image.png';
import { markRaw, onMounted, reactive, ref, watch } from 'vue';
import { useStore } from 'vuex';
import LoadingOverlay from '../LoadingOverlay.vue';
import EditPermissions from '../Forms/EditPermissions.vue';
import ToggleSwitch from '../Misc/ToggleSwitch.vue';

const store = useStore();

const users = ref(null);
const paginationData = ref(null);

const newUsers = ref(null);

const usersLoading = ref(false);
const usersSaving = reactive({});
const usersDeleting = reactive({});

const userImage = (id, imageUrl) => {
    if (!imageUrl) return { backgroundImage: `url('${NoImage}')` };

    if (typeof imageUrl === 'object') {
        const urlImg = URL.createObjectURL(imageUrl);
        return { backgroundImage: `url('${urlImg}')` };
    } else {
        const url = `https://my-shop-app.pockethost.io/api/files/users/${id}/${imageUrl}`;
        return { backgroundImage: `url('${url}')` };
    }
};

watch(users, (value) => {
    console.log(value);
    if (value) newUsers.value = JSON.parse(JSON.stringify(value));
});

const handleImageChange = (e, index) => {
    const file = e.target.files[0];

    console.log(index);

    if (!file) return (newUsers.value[index].avatar = ''); // set to no img

    const reader = new FileReader();
    reader.onload = () => {
        newUsers.value[index].avatar = file;
    };
    reader.readAsDataURL(file);
};

const handleOpenModal = (data) => store.dispatch('openModal', { component: markRaw(EditPermissions), data });

// const addNewuser = () => {
//     newUsers.value.unshift({ name: 'New user', link: 'user-link', image: '', new: true });
// };

// const saveuser = async (userId, index) => {
//     const data = new FormData();

//     Object.keys(newUsers.value[index]).forEach((key) => {
//         if (key === 'image' || key === 'name' || key === 'link') data.append(key, newUsers.value[index][key]);
//     });

//     try {
//         usersSaving[index] = true;
//         if (newUsers.value[index].new) {
//             await store.dispatch('adduser', data);
//             delete newUsers.value[index].new;
//         } else {
//             await store.dispatch('updateuser', { userId, data });
//         }
//     } catch (error) {
//         console.log(error);
//     } finally {
//         usersSaving[index] = false;
//     }
// };

// const deleteuser = async (userId, index) => {
//     const isConfirmed = window.confirm('Are you sure you want to delete this user?');

//     if (!isConfirmed) return;

//     try {
//         usersDeleting[index] = true;

//         await store.dispatch('deleteuser', userId);
//         getAvailableusers();
//     } catch (error) {
//         console.log(error);
//     } finally {
//         usersDeleting[index] = false;
//     }
// };

const getAllUsers = async () => {
    try {
        usersLoading.value = true;
        const response = await store.dispatch('getAllUsers', {});
        users.value = response.items;
        paginationData.value = response.paginationData;
    } catch (error) {
        console.log(error);
    } finally {
        usersLoading.value = false;
    }
};

onMounted(() => {
    getAllUsers();
});
</script>

<style scoped>
.manage-users-wrapper {
    position: relative;
    height: 100%;
    background-color: #f6faff;
}

.manage-users {
    padding: 25px;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.users-wrap {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.heading {
    font-size: 30px;
    font-weight: 600;
}

.users-data {
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 3px 5px #0000000f;
    padding: 25px;
    overflow: auto;
}

.user-image {
    min-height: 75px;
    min-width: 75px;
    position: relative;
}

.single-user {
    display: grid;
    grid-template-columns: 75px 200px 200px 200px 200px 200px;
    align-items: center;
}

.single-user > div:not(.user-image-heading, .user-image-block) {
    padding: 10px 30px;
}

.user-headings .user-image-heading {
    padding: 10px 0px;
    min-height: initial;
    min-width: initial;
}

.user-name {
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
.user-headings {
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

.user-image-label {
    display: flex;
    flex-direction: column;

    max-width: 200px;

    cursor: pointer;
}

.user-image-label:hover .user-image-overlay {
    opacity: 1;
}

.user-image-overlay {
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

.user-actions-wrap {
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
</style>
