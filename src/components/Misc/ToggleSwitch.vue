<template>
    <div class="switch-wrapper">
        <label class="switch">
            <input type="checkbox" v-model="checkboxValue" />
            <span class="slider" :class="{ round: round }"></span>
        </label>
        <span v-if="text">{{ text }}</span>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['value-changed']);

const props = defineProps({
    round: { default: true },
    defaultValue: { default: false },
    text: { default: '' },
});

const checkboxValue = ref(props.defaultValue);

watch(checkboxValue, (val) => emit('value-changed', val));
</script>

<style scoped>
.switch-wrapper {
    display: flex;
    gap: 10px;
}
.switch {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 24px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #c6cdd7;
    -webkit-transition: 0.2s;
    transition: 0.2s;
}

.slider:before {
    position: absolute;
    content: '';
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.2s;
    transition: 0.2s;
}

input:checked + .slider {
    background-color: #0059ff;
}

input:focus + .slider {
    box-shadow: 0 0 1px #0059ff;
}

input:checked + .slider:before {
    -webkit-transform: translateX(16px);
    -ms-transform: translateX(16px);
    transform: translateX(16px);
}

.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}
</style>
