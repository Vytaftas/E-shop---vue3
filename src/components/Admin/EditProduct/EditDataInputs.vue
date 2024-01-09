<template>
    <div class="product-data-inputs">
        <div class="single-input-wrap">
            <label class="input-label" for="name">Name</label>
            <input type="text" id="name" v-model="newProductData.name.value" @change="checkIfChanged('name')" />
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
                    plugins:
                        'mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents  powerpaste a11ychecker typography inlinecss',
                    toolbar:
                        'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                    // onchange_callback: checkIfChanged,
                    setup(editor) {
                        editor.on('change', () => checkIfChanged('description'));
                    },
                }"
                v-model="newProductData.description.value"
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

const newProductData = ref(JSON.parse(JSON.stringify(props.productData)));

const checkOnlyNumbers = (key) => (newProductData.value[key].value = newProductData.value[key].value.replace(/[^0-9.]/g, ''));

const checkIfChanged = (key) => {
    newProductData.value[key].changed = newProductData.value[key].value != props.product[key];

    emit('data-change', newProductData.value);
    // Finished with this?
};
</script>

<style scoped></style>
