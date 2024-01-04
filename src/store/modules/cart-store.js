// import { PocketBaseDB } from '../../pocketbase/pocketbase';

const state = {
    cart: [],
    cartLoading: false,
    sidebar: false,
};
const getters = {
    cartData: (state) => state.cart,
    cartLoading: (state) => state.cartLoading,
    sidebarVisible: (state) => state.sidebar,
};

const actions = {
    async getCartItems({ commit, dispatch }, cartId) {
        try {
            commit('SET_CART_LOADING', true);
            const cartItems = await this.$db_api.getCartItems(cartId);

            console.log(cartItems);

            commit('SET_CART_ITEMS', cartItems);
        } catch (error) {
            console.log(error);
        } finally {
            commit('SET_CART_LOADING', false);
        }
    },

    async addToCart({ commit, dispatch }, data) {
        try {
            const addedItem = await this.$db_api.addToCart(data);
            console.log(addedItem);
        } catch (error) {
            console.log(error);
        }
    },

    async removeFromCart({ commit, dispatch }, id) {
        try {
            const removedItem = await this.$db_api.removeFromCart(id);
            console.log(removedItem);
        } catch (error) {
            console.log(error);
        }
    },

    async adjustProductQuantity({ commit, dispatch }, data) {
        try {
            const cartItems = await this.$db_api.adjustProductQuantity(data);

            console.log(cartItems);

            // commit('SET_CART_ITEMS', cartItems);

            // dispatch('addNotification', {
            //     message: 'Vartotojas sėkmingai atnaujintas',
            //     type: 'success',
            // });
        } catch (error) {
            console.log(error);
            // console.log(error);
            // dispatch('addNotification', {
            //     message: 'Nepavyko atnaujinti vartotojo',
            //     type: 'error',
            // });
        }
    },
};

const mutations = {
    SET_CART_ITEMS: (state, items) => (state.cart = items),
    SET_CART_LOADING: (state, value) => (state.cartLoading = value),
    SET_SIDEBAR_VISIBILITY: (state, value) => (state.sidebar = value),
};

export default {
    state,
    getters,
    actions,
    mutations,
};
