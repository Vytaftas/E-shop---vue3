<template>
    <div class="user-menu-wrap">
        <div class="user-menu-toggle" @click="user ? (userMenuVisible = !userMenuVisible) : router.push({ name: 'Login' })">
            <i class="fa-solid fa-user"></i>
        </div>
        <div v-if="userMenuVisible && user" class="user-menu">
            <span class="username">{{ user.username }}</span>
            <div class="divider"></div>
            <ul>
                <li>
                    <router-link to="/my-account/" @click="userMenuVisible = false" class="user-menu-button">My Account</router-link>
                </li>
                <li>
                    <span class="user-menu-button" @click="handleLogout">Logout</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter();

const user = computed(() => store.getters.currentUser);

const handleLogout = async () => {
    try {
        await store.dispatch('logout');
        userMenuVisible.value = false;

        if (router.currentRoute.value.fullPath !== '/') router.push('/');
    } catch (error) {
        console.log(error);
    }
};

const userMenuVisible = ref(false);
</script>

<style scoped>
.user-menu-wrap {
    position: relative;
}

.user-menu {
    position: absolute;
    bottom: 0;
    right: 0;
    transform: translateY(100%);
    padding: 20px;
    min-width: 200px;
    background-color: white;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.178);
    z-index: 97;
}

.username {
    font-weight: 600;
    display: block;
}

.divider {
    width: 100%;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.082);
    margin: 10px 0;
}

.user-menu ul {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.user-menu ul li {
    width: fit-content;
}

.user-menu-toggle {
    cursor: pointer;
    transition: 0.2s;
    border-radius: 100%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.user-menu-toggle:hover {
    background-color: rgb(255, 123, 0);
    color: white;
}

.user-menu-button {
    text-decoration: underline;
    text-decoration-color: transparent;
    cursor: pointer;
    transition: 0.2s;
}

.user-menu-button:hover {
    text-decoration-color: inherit;
}
</style>
