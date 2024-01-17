<template>
    <pre>
        {{ newData }}
    </pre>
    <div class="permissions-wrap">
        <h3>Edit Permissions</h3>

        <form @submit.prevent="handlePermissionsSave(newData.id)" class="permissions">
            <div class="single-permission" v-for="(value, key, index) of permissionsData(newData)" :key="key">
                <ToggleSwitch :defaultValue="value" :text="toggleSwitchText(key)" @value-changed="newData[key] = $event" />
            </div>

            <button type="submit" class="button-main">Save</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import ToggleSwitch from '../Misc/ToggleSwitch.vue';

const store = useStore();

const props = defineProps({
    data: { default: null },
});

const newData = ref(JSON.parse(JSON.stringify(props.data)));

const handlePermissionsSave = async (permissionsId) => {
    try {
        await store.dispatch('updatePermissions', { permissionsId, data: newData.value });
    } catch (error) {
        console.log(error);
    } finally {
        //not saving
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
}
</style>
