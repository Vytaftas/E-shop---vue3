<template>
    <Header />
    <router-view></router-view>
    <CartSidebar />
    <Footer />
</template>

<script setup>
import CartSidebar from '../components/Cart/CartSidebar.vue';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
</script>
