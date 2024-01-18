<template>
    <div class="permissions-wrap">
        <h3>Edit Permissions</h3>

        <form @submit.prevent="handlePermissionsSave(newData.permissions.id)" class="permissions">
            <div class="single-permission" v-for="(value, key, index) of permissionsData(newData.permissions)" :key="key">
                <ToggleSwitch :defaultValue="value" :text="toggleSwitchText(key)" @value-changed="newData.permissions[key] = $event" />
            </div>

            <button type="submit" class="button-main">{{ permissionsSaving ? 'Saving..' : 'Save' }}</button>
        </form>
    </div>
</template>

<script setup>
import { inject, ref } from 'vue';
import { useStore } from 'vuex';
import ToggleSwitch from '../Misc/ToggleSwitch.vue';

const eventBus = inject('eventBus');

const store = useStore();

const props = defineProps({
    data: { default: null },
});

const newData = ref(JSON.parse(JSON.stringify(props.data)));

const permissionsSaving = ref(false);

const handlePermissionsSave = async (permissionsId) => {
    if (newData.value.permissions.isNew) {
        eventBus.emit('new-permissions-save', newData.value);
        return store.dispatch('closeModal');
    }

    try {
        permissionsSaving.value = true;
        await store.dispatch('updatePermissions', { permissionsId, data: newData.value.permissions });
        eventBus.emit('permissions-save');
        store.dispatch('closeModal');
    } catch (error) {
        console.log(error);
    } finally {
        permissionsSaving.value = false;
    }
};

const permissionsData = (permissions) => {
    const fields = [
        'add_categories',
        'edit_categories',
        'delete_categories',
        'add_products',
        'edit_products',
        'delete_products',
        'add_users',
        'edit_users',
        'delete_users',
    ];
    return Object.fromEntries(Object.entries(permissions).filter(([key]) => fields.includes(key)));
};

const toggleSwitchText = (keyName) => keyName.split('_').join(' ').charAt(0).toUpperCase() + keyName.split('_').join(' ').slice(1);
</script>

<style scoped>
.permissions-wrap {
    min-width: 300px;
}

.permissions {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

h3 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
}

.button-main {
    margin-top: 10px;
    background-color: #004ad3;
}

.button-main:hover {
    background-color: #0059ff;
}
</style>
