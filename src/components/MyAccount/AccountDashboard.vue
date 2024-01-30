<template>
    <div v-if="currentUser" class="dashboard">
        <p class="dashboard-heading">
            Hello <span class="user-name bold">{{ currentUser.username }}</span
            >! (Not <span class="user-name bold">{{ currentUser.username }}</span
            >? <span class="logout-link link">{{ 'Logout' }}</span
            >)
        </p>

        <p>
            Here you can <router-link class="link" to="/my-account/orders">view recent orders</router-link>,
            <router-link class="link" to="/my-account/user-information">edit user information</router-link>,
            <router-link class="link" to="/my-account/change-password">change your password</router-link> and other account data.
        </p>
    </div>
    <LoadingOverlay v-else background="transparent" color="black" />
</template>

<script setup>
import LoadingOverlay from '../Misc/LoadingOverlay.vue';

const props = defineProps({
    currentUser: { default: null },
});
</script>

<style scoped>
.dashboard-heading {
    font-size: 18px;
}
.dashboard {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.bold {
    font-weight: 600;
}
</style>
