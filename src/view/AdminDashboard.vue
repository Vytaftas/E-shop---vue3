<template>
    <div v-if="currentUser?.expand?.permissions_id?.is_admin" class="dashboard">
        <div class="sidebar">
            <div class="top-wrap">
                <router-link to="/">
                    <img class="logo" :src="logo" alt="website logo" />
                </router-link>
                <nav>
                    <router-link class="sidebar-link" to="/dashboard">Dashboard</router-link>
                    <router-link class="sidebar-link" to="/dashboard/manage-products">Products</router-link>
                    <router-link class="sidebar-link" to="/dashboard/manage-metadata">Products Metadata</router-link>
                    <router-link class="sidebar-link" to="/dashboard/manage-categories">Categories</router-link>
                    <router-link class="sidebar-link" to="/dashboard/manage-users">Users</router-link>
                </nav>
            </div>
            <div class="logout-wrap">
                <i class="fa-solid fa-power-off logout-button" @click="handleLogout"></i>
            </div>
        </div>
        <div class="content">
            <router-view></router-view>
        </div>
    </div>
    <LoadingOverlay v-else background="transparent" color="black" />
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import LoadingOverlay from '../components/Misc/LoadingOverlay.vue';
import logo from '../assets/logo.svg';

const store = useStore();
const router = useRouter();

const handleLogout = async () => {
    try {
        await store.dispatch('logout');
        router.push('/');
    } catch (error) {
        console.log(error);
    }
};

const currentUser = computed(() => store.getters.currentUser);
const currentRoute = computed(() => router.currentRoute.value);

watch(
    () => currentRoute,
    (newRouteVal, oldRouteVal) => {
        if (!oldRouteVal?.value) return;

        const isInDashboard = oldRouteVal.value.fullPath.includes('dashboard');
        const newIsInDashboard = newRouteVal.value.fullPath.includes('dashboard');
        const isAdmin = currentUser.value.expand.permissions_id.is_admin;

        if (isInDashboard && newIsInDashboard && !isAdmin) router.push('/');
    },
    { deep: true, immediate: true }
);

watch(
    currentUser,
    (userInfo) => {
        if (!userInfo) return router.push('/my-account/login');
        if (!userInfo?.expand?.permissions_id?.is_admin) return router.push('/my-account/login');
    },
    { deep: true }
);
</script>

<style scoped>
.dashboard {
    position: relative;
}
.logo {
    padding: 20px 30px;
    display: flex;
}

.logout-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 30px;
}

.logout-button {
    font-size: 34px;
    color: rgba(255, 255, 255, 0.74);
    cursor: pointer;
    transition: 0.3s;
}
.logout-button:hover {
    color: white;
}

.dashboard {
    display: grid;
    grid-template-columns: 250px 1fr;
    height: 100vh;
}
.sidebar {
    background-color: #1f5fab;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.sidebar nav {
    display: flex;
    flex-direction: column;
    color: white;
}

.sidebar .sidebar-link {
    padding: 20px 30px;
    transition: 0.2s;
    cursor: pointer;
}
.sidebar .sidebar-link:hover,
.router-link-exact-active {
    background-color: #1b66c2;
}

.content {
    overflow: auto;
    display: grid;
}
</style>
