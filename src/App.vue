<template>
    <router-view></router-view>
    <Notification />
    <Modal />
</template>

<script setup>
import Notification from './components/Misc/Notification.vue';
import Modal from './components/Misc/Modal.vue';
</script>
