<template>
    <div class="my-account">
        <div class="bg-overlay" :style="{ backgroundImage: `url('${BG}')` }"></div>
        <div class="account-wrap">
            <nav class="navigation">
                <ul class="my-account-menu">
                    <li>
                        <router-link to="/my-account">Dashboard</router-link>
                    </li>
                    <li>
                        <router-link to="/my-account/user-information">User Information</router-link>
                    </li>
                    <li>
                        <router-link to="/my-account/orders">Orders</router-link>
                    </li>
                    <li>
                        <router-link to="/my-account/communication">Communication</router-link>
                    </li>
                    <li>
                        <router-link to="/my-account/change-password">Change Password</router-link>
                    </li>
                    <li>
                        <span @click="console.log('logout')">Log Out</span>
                    </li>
                </ul>
            </nav>

            <div class="content">
                <router-view :currentUser="currentUser"> </router-view>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';

import BG from '../assets/my-account-bg.jpg';

const store = useStore();

const user = ref(null);

const currentUser = computed(() => store.getters.currentUser);

watch(currentUser, (newUserValue) => (user.value = newUserValue));
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    opacity: 0;
    transform: translate(-30%);
}
.my-account {
    min-height: 85vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.bg-overlay {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    opacity: 0.03;
}

.account-wrap {
    width: 100%;
    z-index: 1;
    background-color: white;
    display: flex;
    max-width: 1000px;
    box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.11);
    border-radius: 10px;
}

.my-account-menu li {
    overflow: hidden;
}
.my-account-menu li:first-child {
    border-top-left-radius: 10px;
}

.my-account-menu li a,
.my-account-menu li span {
    padding: 20px;
    background-color: rgb(255, 123, 0);
    display: flex;
    cursor: pointer;
    color: white;
    transition: 0.2s;
}

nav {
    min-width: fit-content;
    min-height: 500px;
    background-color: rgb(255, 123, 0);
    border-radius: 10px 0 0 10px;
}

.content {
    padding: 20px;
    width: 100%;
    max-height: 500px;
    overflow-y: auto;
    position: relative;
}

.my-account-menu li a.router-link-exact-active,
.my-account-menu li a:hover,
.my-account-menu li span:hover {
    background-color: rgb(255, 147, 45);
}
</style>
