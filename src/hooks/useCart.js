import { computed } from 'vue';
import { useStore } from 'vuex';

export default () => {
    const store = useStore();

    const cartItems = computed(() => store.getters.cartData);
    const cartLoading = computed(() => store.getters.cartLoading);

    const cartTotals = computed(() => {
        return cartItems.value
            .reduce((acc, item) => {
                const product = item.expand.product_id;

                return (acc += (product.discount_price ? product.discount_price : product.price) * item.quantity);
            }, 0)
            .toFixed(2);
    });

    return {
        cartItems,
        cartTotals,
        cartLoading,
    };
};
