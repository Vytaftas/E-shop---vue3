<template>
    <div class="main-image-block">
        <span class="input-label">Product Image</span>
        <label for="product-image" class="product-image-label">
            <div class="product-image centered-background" :style="productMainImage">
                <div class="product-image-overlay">
                    <i class="fa-solid fa-folder-plus product-image-icon"></i>
                </div>
            </div>
        </label>
        <input ref="fileInput" type="file" name="product-image" id="product-image" class="hidden" @change="(e) => handleImageChange(e, 'main')" />
        <button class="reset-image-button" @click.prevent="resetImage('main')">Reset Image</button>
    </div>

    <div class="gallery-block">
        <span class="input-label">Gallery Images</span>
        <div class="gallery-images-wrap" v-if="newGallery.value">
            <div
                class="single-gallery-image centered-background"
                @click.prevent="handleRemoveGalleryImage(image)"
                v-for="image of newGallery.value"
                :key="image"
                :style="singleGalleryImage(image)"
            >
                <div class="single-gallery-image-overlay">
                    <i class="fa-solid fa-circle-xmark single-gallery-image-icon"></i>
                </div>
            </div>
            <label for="additional-gallery-image" class="product-image-label">
                <div class="additional-gallery-image">
                    <i class="fa-solid fa-folder-plus additional-gallery-image-icon"></i>
                </div>
            </label>
            <input
                ref="galleryFileInput"
                type="file"
                name="additional-gallery-image"
                id="additional-gallery-image"
                class="hidden"
                @change="(e) => handleImageChange(e, 'notmain')"
            />
        </div>
    </div>
</template>

<!-- /// Check if everything is working when pocketbase is up again -->

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
    image: { default: '' },
    gallery: { default: [] },
    product: { default: null },
});

const fileInput = ref(null);
const galleryFileInput = ref(null);

const newImage = ref(JSON.parse(JSON.stringify(props.image)));
const newGallery = ref(JSON.parse(JSON.stringify(props.gallery)));

const productMainImage = computed(() => {
    if (newImage.value.value === props.product.image) return useProductImage(props.product.id, props.product.image);
    if (newImage.value.value) {
        return newImage.value.value.indexOf('http')
            ? { backgroundImage: `url('${newImage.value.value}')` }
            : useProductImage(props.product.id, props.product.image);
    } else {
        return useProductImage(props.product.id, props.product.image);
    }
});

const checkIfChanged = (key) => {
    if (key === 'image') newImage.value.changed = newImage.value.value !== props.product[key];
    // return (formData[key].changed = formData[key].value !== props.product[key]);
};

const singleGalleryImage = (image) => {
    const imageInDB = props.product.gallery_images.indexOf(image);

    if (imageInDB === -1) {
        return { backgroundImage: `url('${image}')` };
    } else {
        return useProductImage(props.product.id, image);
    }
};

const handleImageChange = (e, type) => {
    const file = e.target.files[0];

    if (!file) return resetImage(type);

    const reader = new FileReader();
    reader.onload = (e) => {
        if (type === 'main') {
            newImage.value.value = e.target.result;
            checkIfChanged('image');
        } else {
            newGallery.value.value = [...newGallery.value.value, e.target.result];
            resetImage(type);
            newGallery.value.changed = !arraysAreEqual(props.product.gallery_images, newGallery.value.value);
        }
    };
    reader.readAsDataURL(file);
};

const resetImage = (type) => {
    if (type === 'main') {
        fileInput.value.value = '';
        newImage.value.value = props.product.image ? props.product.image : '';
        checkIfChanged('image');
    } else {
        galleryFileInput.value.value = '';
        newGallery.value.changed = !arraysAreEqual(props.product.gallery_images, newGallery.value.value);
    }
};

const handleRemoveGalleryImage = (image) => {
    if (!newGallery.value.value.length) return;

    newGallery.value.value = newGallery.value.value.filter((item) => item !== image);

    const newImages = newGallery.value.value.filter((item) => !props.product.gallery_images.includes(item)); //images to add
    const originalImages = newGallery.value.value.filter((item) => props.product.gallery_images.includes(item));

    const isTheSame = arraysAreEqual(originalImages, props.product.gallery_images); // use to upload changed existing images

    newGallery.value.changed = !arraysAreEqual(props.product.gallery_images, newGallery.value.value);
};
</script>

<style scoped>
.product-image {
    height: 400px;
    width: 400px;
    border-radius: 5px;
    position: relative;
}

.product-image-label {
    display: flex;
    flex-direction: column;

    max-width: 200px;

    cursor: pointer;
}

.product-image-label:hover .product-image-overlay {
    opacity: 1;
}

.product-image-overlay {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: 0.3s;
    font-size: 50px;
    color: white;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.212);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
}

/* Gallery */

.gallery-images-wrap {
    display: grid;
    grid-template-columns: repeat(3, calc(100px - 10px / 3));
    gap: 5px;
}
.single-gallery-image {
    position: relative;
    height: 96.65px;
    cursor: pointer;
    border-radius: 5px;
}

.single-gallery-image:hover .single-gallery-image-overlay {
    opacity: 1;
}

.single-gallery-image-overlay {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: 0.3s;
    font-size: 30px;
    color: white;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.212);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
}

.additional-gallery-image {
    transition: 0.3s;
    font-size: 30px;
    color: white;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.112);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 96.65px;
    border-radius: 5px;
}
.additional-gallery-image:hover {
    background-color: rgba(0, 0, 0, 0.212);
}

.hidden {
    display: none;
}
</style>
