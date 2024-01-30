<template>
    <div class="image-slider" v-if="data.length">
        <div
            class="slider-wrapper"
            :style="{ transform: `translateX(${currentImage * -100}%)`, transition: `${transitionSpeed}ms`, minHeight: sliderHeight }"
        >
            <div
                class="single-slide"
                v-for="(item, index) of data"
                :key="item"
                :style="{ transform: `translateX(${index * 100}%)`, backgroundImage: `url('${item.backgroundImage}')` }"
            >
                <div class="background-overlay"></div>
                <div class="slide-content">
                    <h3 class="heading">{{ item.text }}</h3>
                    <p class="additional-text">{{ item.additionalText }}</p>
                    <router-link v-if="item.button" :to="item.button.link">
                        <button class="slide-link-button">{{ item.button.text }}</button>
                    </router-link>
                </div>
            </div>
        </div>
        <div v-if="!auto" class="slider-button prev" @click="handleImageChange('prev')">
            <i class="fa-solid fa-chevron-left"></i>
        </div>
        <div v-if="!auto" class="slider-button next" @click="handleImageChange('next')">
            <i class="fa-solid fa-chevron-right"></i>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    data: { default: [] },
    sliderHeight: { default: '700px' },
    transitionSpeed: { default: 400 },
    auto: { default: false },
    autoInterval: { default: 5000 },
});

const currentImage = ref(0);

if (props.auto) {
    const dataLength = props.data.length - 1;
    setInterval(() => {
        currentImage.value >= dataLength ? (currentImage.value = 0) : (currentImage.value = currentImage.value + 1);
    }, props.autoInterval);
}

const handleImageChange = (action) => {
    const dataLength = props.data.length - 1;

    if (action === 'prev') {
        currentImage.value <= 0 ? (currentImage.value = dataLength) : (currentImage.value = currentImage.value - 1);
    } else {
        currentImage.value >= dataLength ? (currentImage.value = 0) : (currentImage.value = currentImage.value + 1);
    }
};
</script>

<style scoped>
.image-slider {
    overflow: hidden;
    position: relative;
}
.slider-wrapper {
    display: flex;
    position: relative;
    transform: translateX(0);
}
.single-slide {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
}

.background-overlay {
    z-index: 2;
    background-color: rgba(0, 0, 0, 0.233);
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
.slide-content {
    color: white;
    text-align: center;
    z-index: 3;
}

.slide-content .heading {
    font-size: 50px;
    font-weight: 900;
}

.slide-content .additional-text {
    font-size: 20px;
}

.slide-link-button {
    margin-top: 25px;
    padding: 7px 24px;
    color: white;
    background-color: rgb(255, 123, 0);
    box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.123);
    transition: 0.2s;
}

.slide-link-button:hover {
    background-color: rgb(255, 102, 0);
}

.slider-button {
    z-index: 0;
    cursor: pointer;
    transition: 0.2s;
    background-color: rgba(0, 0, 0, 0.25);
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 100%;
    font-size: 18px;
    color: rgba(255, 255, 255, 0.65);
}

.slider-button:hover {
    background-color: black;
    color: white;
}

.slider-button.prev {
    left: 5%;
}

.slider-button.next {
    right: 5%;
}
</style>
