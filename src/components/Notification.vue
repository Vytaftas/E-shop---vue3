<template>
    <div v-if="notificationMessages.length" class="notifications-container">
        <transition-group name="notification-transition" tag="ul">
            <ul key="notifications-wrap">
                <li :key="notification.id" v-for="notification of notificationMessages" :class="'notification ' + notification.type">
                    <i v-if="notification.type === 'success'" class="fa-solid fa-circle-check"></i>
                    <i v-else class="fa-solid fa-circle-exclamation"></i>
                    <span>{{ notification.message }}</span>
                </li>
            </ul>
        </transition-group>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
const store = useStore();

const notificationMessages = computed(() => store.getters.notificationMessages);
</script>

<style scoped>
.notifications-container {
    position: fixed;
    right: 20px;
    bottom: 20px;
    z-index: 999;
}

.notification {
    transition: 0.3s;
    border-radius: 50px;
    padding: 10px 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: white;
    min-width: 100px;
    font-weight: 400;
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.171);
}
.notification.success {
    background-color: rgb(0, 150, 92);
}
.notification.error {
    background-color: rgb(180, 39, 39);
}

ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.notification-transition-enter-active,
.notification-transition-leave-active {
    transition: opacity 0.5s;
}
.notification-transition-enter,
.notification-transition-leave-to {
    opacity: 0;
}
</style>
