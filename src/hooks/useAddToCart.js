import { reactive, ref } from 'vue';
import { useStore } from 'vuex';

export default function useAddToCart() {
    const store = useStore();
    const loadingStates = reactive({});
    const isAnyLoading = ref(false);

    async function addToCart(item, quantity = 1, meta) {
        const itemId = item.id;
        if (!loadingStates[itemId]) {
            loadingStates[itemId] = false;
        }

        try {
            isAnyLoading.value = true;
            loadingStates[itemId] = true;

            const currentUser = store.getters.currentUser;
            if (!currentUser || !currentUser.cart_id) {
                throw new Error('No current user or cart ID available');
            }

            const product_id = itemId;
            const cart_id = currentUser.cart_id;

            if (Object.keys(meta)) meta = Object.keys(meta).map((key) => meta[key].id);

            const data = { product_id, cart_id, quantity, meta };

            await store.dispatch('addToCart', data);
            await store.dispatch('getCartItems', cart_id);
        } catch (error) {
            throw error;
        } finally {
            loadingStates[itemId] = false;
            isAnyLoading.value = false;
        }
    }

    return { loadingStates, isAnyLoading, addToCart };
}
