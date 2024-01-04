<template>
    <header>
        <div class="header-wrap">
            <div class="logo">
                <router-link to="/">
                    <img :src="logo" alt="" />
                </router-link>
            </div>
            <nav>
                <ul>
                    <li>
                        <router-link class="nav-link" to="/">HOME</router-link>
                    </li>
                    <li>
                        <router-link class="nav-link" to="/shop">SHOP</router-link>
                    </li>
                    <li>
                        <router-link class="nav-link" to="/about-us">ABOUT US</router-link>
                    </li>
                </ul>
            </nav>
            <div class="user-content">
                <SearchInput />

                <UserMenu />

                <MiniCart />
            </div>
        </div>
    </header>
</template>

<script setup>
import MiniCart from './Cart/MiniCart.vue';
import UserMenu from './UserMenu.vue';
import SearchInput from './SearchInput.vue';
import logo from '../assets/logo.svg';
import { useStore } from 'vuex';
import { computed } from 'vue';

const store = useStore();
</script>

<style scoped>
header {
    padding: 20px 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, 0.13);
}

.header-wrap {
    max-width: 1300px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.user-content {
    display: flex;
    align-items: center;
    gap: 3px;
}

.nav-link {
    text-decoration: underline;
    text-decoration-color: transparent;
    transition: 0.2s;
}

.nav-link:hover {
    text-decoration-color: inherit;
}

nav ul {
    display: flex;
    align-items: center;
    gap: 50px;
    padding-right: 50px;
}
</style>
