<template>
    <div class="manage-users-wrapper">
        <LoadingOverlay v-if="usersLoading" background="transparent" color="black" />
        <div class="manage-users">
            <h3 class="heading">Manage Users</h3>
            <div
                class="add-new-wrap"
                @click="currentUser.expand.permissions_id.add_users ? addNewUser() : addNotification('Permission denied', 'error')"
            >
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
                    <div class="single-user" v-for="(user, index) of newUsers" :key="index">
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
                            <span
                                @click="checkPermissions(() => handleOpenModal(user?.expand?.permissions_id, index), 'edit_permissions')"
                                class="link-underline edit-button"
                                >Edit</span
                            >
                        </div>

                        <div class="user-actions-wrap">
                            <button class="button-main save-button" @click="checkPermissions(() => saveUser(user.id, index), 'edit_users')">
                                {{ usersSaving[index] ? 'Saving..' : 'Save' }}
                            </button>
                            <button class="button-main delete-button" @click="checkPermissions(() => deleteUser(user, index), 'delete_users')">
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
import { computed, inject, markRaw, onMounted, reactive, ref, watch } from 'vue';
import { useStore } from 'vuex';
import NoImage from '../../assets/no-image.png';
import LoadingOverlay from '../Misc/LoadingOverlay.vue';
import EditPermissions from '../Forms/EditPermissions.vue';
import generatePassword from '../../helpers/generatePassword';
import addNotification from '../../helpers/addNotification';

const store = useStore();

const currentUser = computed(() => store.getters.currentUser);

const checkPermissions = (func, permission) => {
    if (currentUser.value?.expand?.permissions_id[permission]) return func();

    addNotification('Permission denied', 'error');
};

const eventBus = inject('eventBus');

const users = ref(null);
const paginationData = ref(null);

const newUsers = ref(null);

const usersLoading = ref(false);
const usersSaving = reactive({});
const usersDeleting = reactive({});

eventBus.on('permissions-save', async (savedPermissionsId) => {
    const currentPermissionsId = currentUser.value.expand.permissions_id.id;
    if (savedPermissionsId === currentPermissionsId) {
        try {
            await store.dispatch('renewPermissions', currentPermissionsId);
        } catch (error) {
            console.log(error);
        }
    }
    getAllUsers();
});
eventBus.on('new-permissions-save', (data) => {
    newUsers.value[data.index].expand = { permissions_id: data.permissions };
});

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
    if (value) newUsers.value = JSON.parse(JSON.stringify(value));
});

const handleImageChange = (e, index) => {
    const file = e.target.files[0];

    if (!file) return (newUsers.value[index].avatar = '');

    const reader = new FileReader();
    reader.onload = () => {
        newUsers.value[index].avatar = file;
    };
    reader.readAsDataURL(file);
};

const handleOpenModal = (data, index) => store.dispatch('openModal', { component: markRaw(EditPermissions), data: { permissions: data, index } });

const addNewUser = () => {
    newUsers.value.unshift({
        name: 'Name',
        username: 'Username',
        cart_id: '',
        expand: {
            permissions_id: {
                add_categories: false,
                add_products: false,
                add_users: false,
                delete_categories: false,
                delete_products: false,
                delete_users: false,
                edit_categories: false,
                edit_products: false,
                edit_users: false,
                isNew: true,
            },
        },
        permissions_id: '',
        email: 'email@email.com',
        avatar: '',
        new: true,
    });
};

const saveUser = async (userId, index) => {
    const userData = new FormData();

    const keysToUpdate = ['avatar', 'name', 'username', 'email'];

    Object.keys(newUsers.value[index]).forEach((key) => {
        if (keysToUpdate.includes(key)) {
            userData.append(key, newUsers.value[index][key]);
        }
    });

    try {
        usersSaving[index] = true;
        if (newUsers.value[index].new) {
            delete newUsers.value[index].expand.permissions_id.isNew;

            const password = generatePassword(8);

            userData.append('emailVisibility', true);
            userData.append('password', password);
            userData.append('passwordConfirm', password);

            await store.dispatch('addUser', { userData, newPermissions: newUsers.value[index].expand.permissions_id });
            await getAllUsers();
        } else {
            await store.dispatch('updateUser', { userId, userData });
        }
    } catch (error) {
        console.log(error);
    } finally {
        usersSaving[index] = false;
    }
};

const deleteUser = async (user, index) => {
    if (newUsers.value[index].new) return newUsers.value.splice(index, 1);

    const isConfirmed = window.confirm('Are you sure you want to delete this user?');

    if (!isConfirmed) return;

    try {
        usersDeleting[index] = true;

        await store.dispatch('deleteUser', user);
        await getAllUsers();
    } catch (error) {
        console.log(error);
    } finally {
        usersDeleting[index] = false;
    }
};

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
    border-radius: 5px;
}

.single-user {
    display: grid;
    grid-template-columns: 75px 200px 200px 200px 150px 200px;
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

.edit-button {
    color: #004ad3;
    cursor: pointer;
}
</style>
