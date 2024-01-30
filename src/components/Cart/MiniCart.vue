<template>
    <div class="cart" @click="toggleSidebar(true)">
        <div class="cart-wrap">
            <i class="fa-solid fa-cart-shopping"></i>
            <span class="cart-items">{{ cartItems.length ? cartItems.length : 0 }}</span>
        </div>

        <LoadingOverlay v-if="cartLoading" size="20px" color="#000000" background="transparent" />
        <span class="cart-amount">€{{ cartTotals }}</span>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import LoadingOverlay from '../Misc/LoadingOverlay.vue';
import useCart from '../../hooks/useCart';

const store = useStore();
const router = useRouter();

const user = computed(() => store.getters.currentUser);

const { cartItems, cartTotals, cartLoading } = useCart();

const toggleSidebar = (value) => {
    if (!user.value) return router.push({ name: 'Login' });

    store.commit('SET_SIDEBAR_VISIBILITY', value);
};
</script>

<style scoped>
.cart {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    position: relative;
}

.cart-wrap {
    position: relative;
    transition: 0.2s;
    border-radius: 100%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.cart:hover .cart-wrap {
    background-color: rgb(255, 123, 0);
    color: white;
}

.cart-items {
    background-color: rgb(255, 123, 0);
    width: 16px;
    height: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 100%;
    color: white;
    position: absolute;
    right: 0;
    top: 0;
    font-size: 11px;
}

.cart-amount {
    font-size: 13px;
    font-weight: 500;
}
</style>
