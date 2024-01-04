<template>
    <div class="product-quantity-wrap">
        <div class="quantity-minus" @click="handleQuantityChange(product, '-')">-</div>
        <div class="quantity">{{ productQuantity }}</div>
        <div class="quantity-plus" @click="handleQuantityChange(product, '+')">+</div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
    product: { default: {} },
    quantity: { default: null },
    instant: { default: false },
});

const productQuantity = computed(() => (props.quantity ? props.quantity : props.product.quantity));

const store = useStore();

const emit = defineEmits(['loading', 'increased', 'decreased']);

const handleQuantityChange = async (item, action) => {
    if (props.instant) {
        try {
            emit('loading', true);
            if (action === '-') {
                if (productQuantity.value <= 1) return;
                await store.dispatch('adjustProductQuantity', { cartItemId: item.id, quantity: item.quantity - 1 });
            } else {
                await store.dispatch('adjustProductQuantity', { cartItemId: item.id, quantity: item.quantity + 1 });
            }

            await store.dispatch('getCartItems', item.cart_id);
        } catch (error) {
            console.log(error);
        } finally {
            emit('loading', false);
        }
    } else {
        action === '-' ? emit('decreased') : emit('increased');
    }
};
</script>

<style scoped>
.product-quantity-wrap {
    display: flex;
}

.quantity-minus,
.quantity,
.quantity-plus {
    width: 28px;
    height: 28px;
    border: 1px solid rgb(151, 151, 151);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
}

.quantity-minus,
.quantity-plus {
    cursor: pointer;
    transition: 0.2s;
}

.quantity-minus:hover,
.quantity-plus:hover {
    background-color: rgb(255, 123, 0);
    border-color: black;
    color: white;
}

.quantity {
    border-left: none;
    border-right: none;
}
</style>
