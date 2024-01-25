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
                    <li class="is-parent">
                        <span>CATEGORIES</span>
                        <i class="fa-solid fa-angle-down"></i>
                        <div class="children-wrap">
                            <router-link
                                :to="'/shop/categories/' + category.link"
                                class="single-child nav-link"
                                v-for="category of categories"
                                :key="category.id"
                            >
                                {{ category.name }}
                            </router-link>
                        </div>
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
import SearchInput from './Misc/SearchInput.vue';
import logo from '../assets/logo.svg';
import { useStore } from 'vuex';
import { onMounted, ref } from 'vue';

const store = useStore();

const categories = ref(null);

onMounted(async () => {
    try {
        const response = await store.dispatch('getAvailableCategories');
        categories.value = response;
    } catch (error) {
        console.log(error);
    }
});
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

.is-parent {
    display: flex;
    align-items: center;
    gap: 5px;
    position: relative;
    cursor: pointer;
}

.is-parent i {
    font-size: 14px;
    transition: 0.3s;
}

.is-parent:hover .children-wrap {
    opacity: 1;
    visibility: visible;
}

.is-parent:hover i {
    transform: rotate(180deg);
}

nav ul {
    display: flex;
    align-items: center;
    gap: 50px;
    padding-right: 50px;
}

.children-wrap .single-child:hover {
    background-color: rgba(0, 0, 0, 0.055);
}

.children-wrap {
    position: absolute;
    left: 0;
    bottom: 0;
    transform: translateY(100%);
    display: flex;
    flex-direction: column;
    z-index: 9;
    background-color: white;
    transition: 0.3s;
    opacity: 0;
    visibility: hidden;
    box-shadow: 0 3px 3px 0 #00000012;
}

.children-wrap .single-child {
    padding: 10px 20px;
    transition: 0.3s;
}
</style>
