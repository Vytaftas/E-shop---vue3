<template>
    <div class="product-data-inputs">
        <div class="single-input-wrap">
            <label class="input-label" for="name">Name</label>
            <input type="text" id="name" v-model="newProductData.name.value" @change="checkIfChanged('name')" />
            <span class="error-message" v-if="newProductData.name.error">{{ newProductData.name.error }}</span>
        </div>

        <div class="flex-row">
            <div class="single-input-wrap">
                <label class="input-label" for="price">Price</label>
                <input
                    type="text"
                    id="price"
                    v-model="newProductData.price.value"
                    @input="checkOnlyNumbers('price')"
                    @change="checkIfChanged('price')"
                />

                <span class="error-message" v-if="newProductData.price.error">{{ newProductData.price.error }}</span>
            </div>
            <div class="single-input-wrap">
                <label class="input-label" for="discount-price">Discount Price</label>
                <input
                    type="text"
                    id="discount-price"
                    v-model="newProductData.discount_price.value"
                    @input="checkOnlyNumbers('discount_price')"
                    @change="checkIfChanged('discount_price')"
                />
                <span class="error-message" v-if="newProductData.discount_price.error">{{ newProductData.discount_price.error }}</span>
            </div>
        </div>
        <div class="flex-row">
            <div class="single-input-wrap">
                <label class="input-label" for="sku">SKU</label>
                <input type="text" id="sku" v-model="newProductData.SKU.value" @change="checkIfChanged('SKU')" />
            </div>
        </div>

        <div class="single-input-wrap">
            <label class="input-label" for="description">Description</label>
            <Editor
                id="description"
                api-key="qdcud7bnxxiz7gzo7ceg2uvac0blnhua2pr3ibi1tb4gkym2"
                :init="{
                    toolbar_mode: 'sliding',
                    menubar: 'edit insert view format table tools',
                    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                    toolbar:
                        'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                    setup(editor) {
                        editor.on('change', () => checkIfChanged('description'));
                    },
                }"
                v-model="newProductData.description.value"
            />
        </div>
        <div class="single-input-wrap">
            <label class="input-label" for="long_description">Additional Info</label>
            <Editor
                id="long_description"
                api-key="qdcud7bnxxiz7gzo7ceg2uvac0blnhua2pr3ibi1tb4gkym2"
                :init="{
                    toolbar_mode: 'sliding',
                    menubar: 'edit insert view format table tools',
                    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                    toolbar:
                        'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                    setup(editor) {
                        editor.on('change', () => checkIfChanged('long_description'));
                    },
                }"
                v-model="newProductData.long_description.value"
            />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Editor from '@tinymce/tinymce-vue';

const props = defineProps({
    productData: { default: null },
    product: { default: null },
});

const emit = defineEmits(['data-change']);

const newProductData = ref(props.productData ? JSON.parse(JSON.stringify(props.productData)) : {});

const checkOnlyNumbers = (key) => (newProductData.value[key].value = newProductData.value[key].value.replace(/[^0-9.]/g, ''));

const checkIfChanged = (key) => {
    if (newProductData.value[key]?.changed) newProductData.value[key].changed = newProductData.value[key].value != props.product[key];

    emit('data-change', newProductData.value);
};
</script>

<style scoped>
.single-input-wrap {
    position: relative;
}

input {
    padding: 10px;
    font-size: 14px;
    outline: none;
    border: none;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    font-weight: 400;
    width: 100%;
    transition: 0.2s;
    background-color: #f6faff;
}

input:focus-visible {
    border: 1px solid black;
}

.product-data-inputs {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.flex-row {
    display: flex;
    gap: 20px;
}

.input-label {
    display: inline-block;
    font-weight: 500;
    margin-bottom: 3px;
}

.error-message {
    position: absolute;
    left: 0px;
    bottom: 0;
    transform: translateY(calc(100% + 1px));
}
</style>
