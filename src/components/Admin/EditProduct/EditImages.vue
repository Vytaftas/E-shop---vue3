<template>
    <div class="images-wrap">
        <div class="main-image-block">
            <span class="input-label">Product Image</span>
            <label for="product-image" class="product-image-label">
                <div class="product-image centered-background" :style="productMainImage">
                    <div class="product-image-overlay" :class="{ 'no-image': !newImage.value }">
                        <i class="fa-solid fa-folder-plus product-image-icon"></i>
                    </div>
                </div>
            </label>
            <input
                ref="fileInput"
                type="file"
                name="product-image"
                accept="image/gif, image/jpeg, image/png, image/webp"
                id="product-image"
                class="hidden"
                @change="(e) => handleImageChange(e, 'main')"
            />
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
                    accept="image/gif, image/jpeg, image/png, image/webp"
                    id="additional-gallery-image"
                    class="hidden"
                    @change="(e) => handleImageChange(e, 'notmain')"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import useProductImage from '../../../hooks/useProductImage';

const emit = defineEmits(['image-change', 'gallery-change']);

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
    if (!newImage.value.value) return;
    if (newImage.value.value === props?.product?.image) return useProductImage(props.product.id, props.product.image);
    if (newImage.value.value) {
        if (typeof newImage.value.value === 'object') {
            return { backgroundImage: `url('${URL.createObjectURL(newImage.value.value)}')` };
        }
        if (newImage.value.value.indexOf('http')) {
            return { backgroundImage: `url('${newImage.value.value}')` };
        }

        return useProductImage(props.product.id, props.product.image);
    } else {
        return useProductImage(props.product.id, props.product.image);
    }
});

const singleGalleryImage = (image) => {
    if (typeof image === 'object') {
        return { backgroundImage: `url('${URL.createObjectURL(image)}')` };
    }

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
            newImage.value.value = file;
            emit('image-change', newImage.value.value);
        } else {
            newGallery.value.value = [...newGallery.value.value, file];
            resetImage(type);
            emit('gallery-change', newGallery.value.value);
        }
    };
    reader.readAsDataURL(file);
};

const resetImage = (type) => {
    if (type === 'main') {
        fileInput.value.value = '';

        newImage.value.value = props?.product?.image ? props.product.image : '';
        emit('image-change', newImage.value.value);
    } else {
        galleryFileInput.value.value = '';
        emit('gallery-change', newGallery.value.value);
    }
};

const handleRemoveGalleryImage = (image) => {
    if (!newGallery.value.value.length) return;

    newGallery.value.value = newGallery.value.value.filter((item) => item !== image);

    emit('gallery-change', newGallery.value.value);
};
</script>

<style scoped>
.images-wrap {
    display: flex;
    flex-direction: column;
    gap: 25px;
}
.product-image {
    height: calc(400px - 40px);
    width: calc(400px - 40px);
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

.product-image-overlay.no-image {
    opacity: 0.7;
}

.reset-image-button {
    margin-top: 10px;
    padding: 5px 20px;
    background-color: #0071ff;
    color: white;
    transition: 0.2s;
    border-radius: 3px;
    width: 100%;
}

.reset-image-button:hover {
    background-color: #0059ff;
}

.input-label {
    font-weight: 500;
    margin-bottom: 3px;
    display: block;
}

/* Gallery */

.gallery-images-wrap {
    display: grid;
    grid-template-columns: repeat(4, calc(100px - 40px / 3));
    gap: 5px;
}
.single-gallery-image {
    position: relative;
    height: 86.66px;
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
    height: 86.66px;
    border-radius: 5px;
}
.additional-gallery-image:hover {
    background-color: rgba(0, 0, 0, 0.212);
}

.hidden {
    display: none;
}
</style>
