<template>
    <div v-if="product" class="product-wrap">
        <p class="id">{{ product.id }}</p>

        <form>
            <span>Product Image</span>
            <label for="product-image" class="product-image-label">
                <div class="product-image centered-background" :style="useProductImage(product.id, product.image)">
                    <div class="product-image-overlay">
                        <i class="fa-solid fa-folder-plus product-image-icon"></i>
                    </div>
                </div>
            </label>
            <input type="file" name="product-image" id="product-image" class="hidden" />

            <div class="single-input-wrap">
                <label for="name">Product Name</label>
                <input type="text" id="name" v-model="formData.name" />
            </div>
            <div class="single-input-wrap">
                <label for="sku">SKU</label>
                <input type="text" id="sku" v-model="formData.SKU" />
            </div>
            <div class="single-input-wrap">
                <label for="price">Price</label>
                <input type="number" id="price" v-model="formData.price" />
            </div>
            <div class="single-input-wrap">
                <label for="discount-price">Discount Price</label>
                <input type="number" id="discount-price" v-model="formData.discount_price" />
            </div>
            <div class="single-input-wrap">
                <label for="description">Product Description</label>
                <Editor
                    id="description"
                    api-key="qdcud7bnxxiz7gzo7ceg2uvac0blnhua2pr3ibi1tb4gkym2"
                    :init="{
                        toolbar_mode: 'sliding',
                        menubar: 'edit insert view format table tools',
                        plugins:
                            'mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents  powerpaste a11ychecker typography inlinecss',
                        toolbar:
                            'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                    }"
                    v-model="formData.description"
                />
            </div>
        </form>
        {{ formData }}
        <!-- <p class="sku">{{ product.SKU }}</p>
        <p class="name">{{ product.name }}</p> -->
        <p class="categories">{{ product.expand.categories }}</p>
        <p class="product-ratings">{{ product.expand['product_ratings(product_id)'] }}</p>
        <!-- <p class="description">{{ product.description }}</p> -->
        <!-- <p class="discount-price">{{ product.discount_price }}</p> -->
        <!-- <p class="price">{{ product.price }}</p> -->
        <p class="image">{{ product.image }}</p>
        <p class="meta-data">{{ product.meta_data }}</p>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import Editor from '@tinymce/tinymce-vue';
import useProductImage from '../../hooks/useProductImage';

const store = useStore();
const route = useRoute();
const productId = computed(() => route.params.id);

const product = ref(null);
const productLoading = ref(false);

const formData = reactive({
    name: '',
    SKU: '',
    description: '',
    price: '',
    discount_price: '',
});

onMounted(async () => {
    try {
        productLoading.value = true;
        const response = await store.dispatch('getProduct', productId.value);
        product.value = response;
        console.log(response);
        console.log(formData);

        for (let key in response) {
            if (formData.hasOwnProperty(key)) {
                formData[key] = response[key];
            }
        }
    } catch (error) {
        console.log(error);
    } finally {
        productLoading.value = false;
    }
});
</script>

<style scoped>
.product-wrap {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.single-input-wrap {
    display: flex;
    flex-direction: column;
}

.product-image {
    height: 200px;
    width: 200px;
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
}

.product-image-icon {
    /* box-shadow: 0 0 10px 5 blrgba(0, 0, 0, 0.295); */
}

.hidden {
    /* display: none; */
}
</style>
