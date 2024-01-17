<template>
    <transition name="modal-transition">
        <div v-if="showModal" class="modal-backdrop" @click="handleClickOutside">
            <div class="modal-content">
                <component :data="modalData" :is="selectedComponent" v-if="selectedComponent"></component>
                <div @click.prevent="closeModal" class="close-icon">
                    <i class="fa-solid fa-xmark"></i>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
const store = useStore();

const selectedComponent = computed(() => store.getters.selectedComponent);
const showModal = computed(() => store.getters.showModal);
const modalData = computed(() => store.getters.modalData);

const handleClickOutside = (e) => {
    const isContent = e.target.closest('.modal-content');

    if (!isContent) store.dispatch('closeModal');
};

const closeModal = () => store.dispatch('closeModal');
</script>

<style scoped>
.modal-backdrop {
    background-color: rgba(0, 0, 0, 0.38);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    position: relative;
    background-color: white;
    box-shadow: 0 3px 9px 0 rgba(0, 0, 0, 0.171);
    max-width: 1500px;
    padding: 20px;
    border-radius: 10px;
}

.modal-content .close-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
}

.modal-transition-enter-active,
.modal-transition-leave-active {
    transition: opacity 0.3s;
}
.modal-transition-enter,
.modal-transition-leave-to {
    opacity: 0;
}
</style>
