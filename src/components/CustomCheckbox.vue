<template>
    <label class="custom-checkbox">
        <input type="checkbox" :checked="checked" :class="{ checked: checked }" @click.stop />
        <span class="checkmark"></span>
        <slot :item="item"></slot>
    </label>
</template>

<script setup>
const props = defineProps({
    item: { default: null },
    checked: { default: false },
});
</script>

<style scoped>
.custom-checkbox {
    display: block;
    position: relative;
    cursor: pointer;
    user-select: none;
    width: 100%;
}

.custom-checkbox input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
}

.custom-checkbox .checkmark {
    position: absolute;
    top: 2px;
    left: 0;
    height: 20px;
    width: 20px;
    background-color: #0000000c;
    border: 1px solid black;
    border-radius: 3px;
}

.custom-checkbox input.checked ~ .checkmark {
    background-color: rgb(255, 123, 0);
    border-color: rgb(255, 123, 0);
}

.custom-checkbox .checkmark:after {
    content: '';
    position: absolute;
    display: none;
}

.custom-checkbox input.checked ~ .checkmark:after {
    display: block;
}

.custom-checkbox .checkmark:after {
    left: 6px;
    top: 3px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
}
</style>
