<template>
    <div class="dashboard">
        <div class="sidebar">
            <div class="top-wrap">
                <img class="logo" :src="logo" alt="website logo" />
                <nav>
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
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
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
</script>

<style scoped>
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
}
</style>
