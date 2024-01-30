<template>
    <transition name="fade" @click="toggleSidebar(false)">
        <div class="sidebar-overlay" v-if="sidebarVisible"></div>
    </transition>
    <transition name="slide">
        <div class="sidebar-content" v-if="sidebarVisible">
            <h3 class="cart-heading">Cart</h3>

            <div class="cart-items">
                <ProductsList
                    :products="cartItems"
                    viewType="list"
                    :showRemoveButton="true"
                    :isCart="true"
                    :showDescription="false"
                    :showAddToCart="false"
                    :showRatings="false"
                    :expandData="['expand', 'product_id']"
                    @loading="(val) => (cartLoading = val)"
                    @push-single-product-page="store.commit('SET_SIDEBAR_VISIBILITY', false)"
                />
            </div>

            <div class="cart-footer">
                <div class="cart-totals">
                    <span><span class="total">Total:</span> €{{ cartTotals }}</span>
                </div>

                <div class="cart-action-buttons">
                    <button class="checkout">Checkout</button>
                </div>
            </div>

            <i class="fa-solid fa-xmark close" @click="toggleSidebar(false)"></i>
            <LoadingOverlay v-if="cartLoading" />
        </div>
    </transition>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import ProductsList from '../Products/ProductsList.vue';
import LoadingOverlay from '../Misc/LoadingOverlay.vue';
import useCart from '../../hooks/useCart';

const store = useStore();

const { cartItems, cartTotals } = useCart();

const sidebarVisible = computed(() => store.getters.sidebarVisible);

const cartLoading = ref(false);

const toggleSidebar = (value) => store.commit('SET_SIDEBAR_VISIBILITY', value);
</script>

<style scoped>
.sidebar-overlay {
    background-color: rgba(0, 0, 0, 0.144);
    position: fixed;
    width: 100%;
    height: 100vh;
    left: 0;
    top: 0;
    z-index: 98;
}
.sidebar-content {
    display: grid;
    grid-template-rows: auto 1fr;
    background-color: white;
    position: fixed;
    top: 0;
    right: 0;
    width: 500px;
    height: 100%;
    z-index: 99;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.178);
    padding: 25px;
}

.cart-items {
    overflow: auto;
    padding: 0 20px;
}

.close {
    cursor: pointer;
    position: absolute;
    right: 25px;
    top: 25px;
}

.cart-heading {
    margin-bottom: 25px;
    padding-bottom: 25px;
    font-weight: 600;
    font-size: 24px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.096);
}

.cart-totals {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    padding: 25px 0;
    margin: 50px 0;
    border: 1px solid rgba(0, 0, 0, 0.096);
    border-left: 0;
    border-right: 0;
}
.total {
    font-weight: 600;
}

.checkout {
    padding: 10px 20px;
    width: 100%;
    background-color: black;
    color: white;
    transition: 0.2s;
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.192);
    font-weight: 500;
}

.checkout:hover {
    background-color: rgb(255, 123, 0);
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(100%);
}

.slide-enter-to,
.slide-leave-from {
    transform: translateX(0);
}

.fade-enter-active,
.fade-leave-active {
    transition: 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}
</style>
