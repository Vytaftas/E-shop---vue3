<template>
    <div v-if="product || addNew" class="product-wrap">
        <div class="heading-wrap">
            <h3 class="heading">
                Manage Product <span v-if="!addNew" class="product-id">(ID: {{ product.id }})</span>
            </h3>
            <button class="product-update-button button-main" @click="handleProductUpdate">Update</button>
        </div>
        <div class="main-product-form">
            <div class="top">
                <div class="left-side">
                    <div class="section-wrap product-data-wrap">
                        <EditDataInputs
                            :productData="{
                                name: productData.name,
                                price: productData.price,
                                discount_price: productData.discount_price,
                                SKU: productData.SKU,
                                description: productData.description,
                            }"
                            :product="product"
                            @data-change="handleDataInputsChange"
                        />
                    </div>

                    <div class="section-wrap product-meta-wrap">
                        <h4 class="section-heading">Product Meta</h4>
                        <EditMeta :meta="productData.product_meta.value" :product="product" @meta-change="productData.product_meta.value = $event" />
                    </div>
                </div>
                <div class="right-side">
                    <div class="section-wrap product-images-wrap">
                        <EditImages
                            :image="productData.image"
                            :gallery="productData.gallery_images"
                            :product="product"
                            @image-change="productData.image['value'] = $event"
                            @gallery-change="productData.gallery_images['value'] = $event"
                        />
                    </div>

                    <div class="section-wrap product-categories-wrap">
                        <ChipMultiSelect
                            :availableItems="availableCategories"
                            :selectedItems="productData.categories.value"
                            label="Categories"
                            placeholder="Add category.."
                            @items-change="productData.categories['value'] = $event"
                        />
                    </div>
                </div>
            </div>
            <div class="bottom">
                <div class="section-wrap product-reviews-wrap">
                    <h4 class="section-heading">Product Reviews</h4>
                    <EditReviews
                        :reviews="productData.product_ratings"
                        :product="product"
                        :ratingsPerPage="ratingsPerPage"
                        @reviews-updated="getProduct"
                    />
                </div>
            </div>
        </div>
    </div>
    <LoadingOverlay class="overlay" v-if="productLoading" />
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import EditMeta from './EditMeta.vue';
import EditDataInputs from './EditDataInputs.vue';
import EditReviews from './EditReviews.vue';
import EditImages from './EditImages.vue';
import ChipMultiSelect from '../../Misc/ChipMultiSelect.vue';
import LoadingOverlay from '../../LoadingOverlay.vue';

const props = defineProps({
    addNew: { default: false },
});

const store = useStore();
const route = useRoute();
const router = useRouter();

const productId = computed(() => route.params.id);
const product = ref(null);
const productLoading = ref(false);

const ratingsPerPage = ref(3);

const availableCategories = ref(null);

const productData = reactive({
    name: { value: '', error: false },
    SKU: { value: '', changed: false },
    description: { value: '', changed: false },
    price: { value: '', error: false },
    discount_price: { value: '', error: false },
    image: { value: '', changed: false },
    gallery_images: { value: [], changed: false },
    categories: { value: [], changed: false },
    product_ratings: { value: [], changed: false },
    meta_data: { value: [], error: false },
    product_meta: { value: [], error: false },
});

const handleProductUpdate = async () => {
    Object.keys(productData).forEach((key) => (productData[key].error = false));

    if (!productData.name.value.trim()) productData.name.error = "Name can't be empty";

    if (!productData.price.value || productData.price.value <= 0) productData.price.error = 'Enter product price';

    if (parseFloat(productData.discount_price.value) > parseFloat(productData.price.value))
        productData.discount_price.error = "Discount price can't be higher than regular price";

    const isMetaError = Object.keys(productData.meta_data.value).some((key) => !productData.meta_data.value[key].name.trim());
    const isMetaKeyError = Object.keys(productData.meta_data.value).some((key) =>
        productData.meta_data.value[key].data.some((keyItem) => {
            return !keyItem.name.trim();
        })
    );

    const isError = Object.keys(productData).some((key) => productData[key].error);

    if (isError || isMetaError || isMetaKeyError) return;

    const data = new FormData();

    for (const key of Object.keys(productData)) {
        if (key === 'product_ratings') continue;

        if (key === 'categories') {
            for (let cat of productData[key].value) {
                data.append(key, cat.id);
            }
            continue;
        }

        if (key === 'gallery_images') {
            for (let img of productData[key].value) {
                data.append(key, img);
            }
            continue;
        }

        if (key === 'meta_data') {
            const mData = JSON.stringify(productData[key].value);
            data.append(key, mData);
            continue;
        }

        if (key === 'product_meta') {
            for (let metaKey of Object.keys(productData[key].value)) {
                productData[key].value[metaKey].data.forEach((item) => data.append(key, item.id));
            }
            continue;
        }

        data.append(key, productData[key].value);
    }

    try {
        productLoading.value = true;
        if (props.addNew) {
            await store.dispatch('addProduct', data);
            router.push('/dashboard/manage-products');
        } else {
            await store.dispatch('updateProduct', { productId: product.value.id, formData: data });
            await getProduct();
        }
    } catch (error) {
        console.log(error);
    } finally {
        productLoading.value = false;
    }
};

const handleDataInputsChange = (data) => {
    for (let key of Object.keys(data)) {
        if (productData[key]) productData[key] = data[key];
    }
};

const getProduct = async () => {
    try {
        productLoading.value = true;
        const response = await store.dispatch('getProduct', productId.value);

        product.value = response;

        const responseCopy = JSON.parse(JSON.stringify(response));

        for (let key in responseCopy) {
            if (responseCopy[key].categories || responseCopy[key]['product_ratings(product_id)'] || responseCopy[key].product_meta) {
                if (productData.categories) productData.categories.value = responseCopy[key].categories;
                if (productData.product_ratings) {
                    if (responseCopy[key]['product_ratings(product_id)'])
                        responseCopy[key]['product_ratings(product_id)'].sort((item1, item2) => new Date(item2.created) - new Date(item1.created));
                    productData.product_ratings.value = responseCopy[key]['product_ratings(product_id)'];
                }
                if (responseCopy[key].product_meta) {
                    const metaObj = {};

                    for (let item of responseCopy[key].product_meta) {
                        if (!metaObj[item.data_name]) metaObj[item.data_name] = { name: item.data_name, data: [] };
                        metaObj[item.data_name].data.push(item);
                    }

                    productData.product_meta.value = metaObj;
                }
            } else {
                if (productData.hasOwnProperty(key) && key !== 'categories' && key !== 'product_meta') {
                    productData[key].value = responseCopy[key];
                }
            }
        }
    } catch (error) {
        console.log(error);
    } finally {
        productLoading.value = false;
    }
};

onMounted(async () => {
    if (!props.addNew) await getProduct();
    try {
        const response = await store.dispatch('getAvailableCategories');
        availableCategories.value = response;
    } catch (error) {
        console.log(error);
    }
});
</script>

<style scoped>
.product-wrap {
    background-color: #f6faff;
    padding: 25px;
    position: relative;
}

.section-wrap {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 3px 5px #0000000f;
}
.main-product-form {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.top {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 25px;
}

.heading-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 35px;
}
.heading {
    font-size: 30px;
    font-weight: 600;
    line-height: 1em;
    position: relative;
}

.product-id {
    color: gray;
    font-size: 14px;
    line-height: 1em;
    position: absolute;
    left: 0;
    bottom: -10px;
    transform: translateY(100%);
    font-weight: 400;
}

.left-side {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.section-heading {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 10px;
}

.right-side {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.overlay {
    width: calc(100% - 250px);
    right: 0;
    left: unset;
}
</style>
