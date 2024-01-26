<template>
    <div class="manage-products-wrapper">
        <LoadingOverlay v-if="productsLoading" background="transparent" color="black" />
        <div class="manage-products">
            <h3 class="heading">Manage Products</h3>

            <div class="options-wrap">
                <router-link to="/dashboard/manage-products/add-new" class="add-new-wrap" v-if="currentUser?.expand?.permissions_id?.add_products">
                    <i class="fa-solid fa-square-plus"></i>
                    <span>Add New</span>
                </router-link>

                <p v-else class="add-new-wrap" @click="addNotification('Permission denied', 'error')">
                    <i class="fa-solid fa-square-plus"></i>
                    <span>Add New</span>
                </p>

                <div class="products-per-page">
                    <span class="products-per-page-text">Products per page: </span>

                    <select name="products-select" id="products-select" @change="productsPerPage = $event.target.value">
                        <option value="5">5</option>
                        <option value="8" selected>8</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
            </div>

            <div class="products-data">
                <div class="single-product product-headings">
                    <div class="product-image">Image</div>
                    <div>Product Name</div>
                    <div>SKU</div>
                    <div>Price</div>
                    <div>Categories</div>
                    <div>Created</div>
                    <div class="product-delete-heading">Actions</div>
                </div>

                <div class="divider"></div>

                <div class="products-wrap">
                    <div class="single-product" v-for="product of products" :key="product.id">
                        <div class="product-image centered-background" :style="useProductImage(product.id, product.image)"></div>
                        <div class="product-name-wrap">
                            <p class="product-name">{{ product.name }}</p>
                            <div class="product-options">
                                <router-link
                                    :to="`/shop/product/${product.id}`"
                                    target="_blank"
                                    class="product-option-button link-underline product-view"
                                    >View</router-link
                                >
                                <router-link
                                    v-if="currentUser?.expand?.permissions_id?.edit_products"
                                    :to="`/dashboard/manage-products/${product.id}`"
                                    class="product-option-button link-underline product-edit"
                                    >Edit</router-link
                                >
                                <p
                                    class="product-option-button link-underline product-edit"
                                    @click="addNotification('Permission denied', 'error')"
                                    v-else
                                >
                                    Edit
                                </p>

                                <span
                                    class="product-option-button link-underline product-copy"
                                    @click="checkPermissions(() => handleDuplicateProduct(product), 'add_products')"
                                    >Duplicate</span
                                >
                            </div>
                        </div>
                        <div class="product-sku">
                            <span>{{ product.SKU ? product.SKU : '-' }}</span>
                        </div>
                        <div class="product-price-wrap">
                            <span v-if="product.discount_price" class="product-discount-price">{{ product.discount_price }}</span>
                            <span class="product-price">{{ product.price }}</span>
                        </div>
                        <div class="product-categories-wrap">
                            <p v-if="!product.expand?.categories">-</p>
                            <div v-else class="single-category-wrap" v-for="(category, index) of product.expand.categories" :key="category.id">
                                <router-link :to="`/shop/categories/${category.link}`" target="_blank" class="single-category link-underline">{{
                                    category.name
                                }}</router-link>
                                <span v-if="index !== product.expand.categories.length - 1">, </span>
                            </div>
                        </div>
                        <div class="product-created-wrap">
                            <p>{{ productCreatedTime(product.created) }}</p>
                        </div>
                        <div class="product-delete-wrap">
                            <i
                                @click="checkPermissions(() => handleProductDelete(product.id), 'delete_products')"
                                class="fa-solid fa-trash product-delete"
                            ></i>
                        </div>
                    </div>
                </div>
                <Pagination
                    class="pagination"
                    v-if="paginationData"
                    :paginationData="paginationData"
                    color="rgb(22, 88, 212)"
                    @page-change="handlePageChange"
                />
                <p v-if="!products.length && !productsLoading" :style="{ margin: 'auto', marginTop: '10px' }">No products found.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import useProductImage from '../../hooks/useProductImage';
import LoadingOverlay from '../LoadingOverlay.vue';
import Pagination from '../Misc/Pagination.vue';
import addNotification from '../../helpers/addNotification';

const store = useStore();

const currentUser = computed(() => store.getters.currentUser);

const products = ref([]);
const paginationData = ref(null);
const productsLoading = ref(false);
const productsPerPage = ref(8);

const productCreatedTime = (timeData) => {
    const data = timeData.split(' ');
    const [date, time] = data;

    const index = time.lastIndexOf(':');
    const formattedTime = time.slice(0, index);

    return `${date} ${formattedTime}`;
};

watch(productsPerPage, (amount) => getProducts({ amount }));

const getProducts = async ({ page = 1, amount = productsPerPage.value }) => {
    try {
        productsLoading.value = true;
        const response = await store.dispatch('getProducts', { page, amount, returnData: true });
        products.value = response.items;
        paginationData.value = response.paginationData;
    } catch (error) {
        console.log(error);
    } finally {
        productsLoading.value = false;
    }
};

const checkPermissions = (func, permission) => {
    if (currentUser.value?.expand?.permissions_id[permission] === true) return func();

    addNotification('Permission denied', 'error');
};

const handleProductDelete = async (id) => {
    console.log('delete');
    if (window.confirm('Are you sure you want to delete this product?')) {
        try {
            await store.dispatch('deleteProduct', id);
            const { page, perPage, totalItems } = paginationData.value;

            let pageToSend = page;

            if (page !== 1 && perPage === totalItems - 1) pageToSend = page - 1;

            getProducts({ page: pageToSend });
        } catch (error) {
            console.log(error);
        }
    }
};

const handleDuplicateProduct = async (product) => {
    const { categories, description, discount_price, meta_data, name, price, gallery_images, image, long_description, product_meta } = product;

    const productData = {
        categories,
        description,
        long_description,
        discount_price,
        product_meta,
        name: `${name} - Copy`,
        price,
        gallery_images,
        image,
    };

    const data = new FormData();

    for (const key of Object.keys(productData)) {
        if (key === 'categories') {
            for (let cat of productData[key]) {
                data.append(key, cat);
            }
            continue;
        }

        if (key === 'image') {
            try {
                productsLoading.value = true;
                const response = await fetch(`https://my-shop-app.pockethost.io/api/files/products/${product.id}/${product.image}`);
                const imgBlob = await response.blob();
                data.append(key, imgBlob);
            } catch (error) {
                console.log(error);
                productsLoading.value = false;
                continue;
            }

            continue;
        }
        if (key === 'gallery_images') {
            for (let img of productData[key]) {
                try {
                    productsLoading.value = true;
                    const image = await fetch(`https://my-shop-app.pockethost.io/api/files/products/${product.id}/${img}`);
                    const imgBlob = await image.blob();
                    data.append(key, imgBlob);
                } catch (error) {
                    productsLoading.value = false;
                    console.log(error);
                    continue;
                }
            }
            continue;
        }

        if (key === 'product_meta') {
            for (let meta of productData[key]) {
                data.append(key, meta);
            }
            continue;
        }

        data.append(key, productData[key]);
    }

    try {
        productsLoading.value = true;
        await store.dispatch('addProduct', data);
        getProducts({ page: paginationData.value.page });
    } catch (error) {
        console.log(error);
    } finally {
        productsLoading.value = false;
    }
};

const handlePageChange = (page) => {
    getProducts({ page });
};

onMounted(async () => {
    getProducts({});
});
</script>

<style scoped>
.pagination {
    margin-top: 25px;
}

.manage-products-wrapper {
    position: relative;
    height: 100%;
    background-color: #f6faff;
}
.manage-products {
    padding: 25px;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.products-data {
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 3px 5px #0000000f;
    padding: 25px;
    overflow: auto;
}

.heading {
    font-size: 30px;
    font-weight: 600;
}

.products-wrap {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.single-product {
    display: grid;
    grid-template-columns: 75px 300px 100px 100px 170px 175px 150px;
    align-items: center;
}
.product-image {
    min-height: 75px;
    min-width: 75px;
}

.single-product > div:not(.product-image) {
    padding: 10px 30px;
}

.product-name {
    font-size: 18px;
    font-weight: 500;
}

.product-options {
    display: flex;
    align-items: center;
    gap: 10px;
}

.product-option-button {
    cursor: pointer;
    color: rgb(22, 88, 212);
}

.product-delete-wrap,
.product-delete-heading {
    text-align: center;
}

.product-delete {
    cursor: pointer;
    color: rgb(212, 0, 0);
    transition: 0.2s;
}
.product-delete:hover {
    color: rgb(255, 0, 0);
}

.link-underline {
    text-decoration: 1px underline transparent;
    transition: 0.2s;
}
.link-underline:hover {
    text-decoration-color: inherit;
}

.product-price-wrap {
    font-size: 14px;
    display: flex;
    flex-direction: column;
    text-align: center;
}

.product-discount-price {
    color: gray;
    text-decoration: line-through;
}

.product-categories-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

.single-category-wrap {
    font-size: 13px;
    color: gray;
}

.product-created-wrap {
    font-size: 14px;
}

/* Headings */
.product-headings {
    font-weight: 500;
}

.product-headings > div:not(.product-image) {
    padding: 0 30px;
}

.product-headings .product-image {
    min-height: initial;
    min-width: initial;
}

.divider {
    background-color: rgba(0, 0, 0, 0.082);
    height: 1px;
    margin: 10px 0;
}

.add-new-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    width: fit-content;
    cursor: pointer;
    margin: 15px 0 25px 0;
}

.add-new-wrap:hover i {
    color: #0059ff;
}

.add-new-wrap i {
    font-size: 30px;
    color: #0050e6;
    transition: 0.2s;
}

#products-select {
    background-color: transparent;
    border: none;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    padding: 3px 5px;
    cursor: pointer;
    border-bottom: 1px solid rgba(0, 0, 0, 0.11);
}

#products-select:not(option) {
    text-align: center;
    font-weight: 600;
}

.options-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
