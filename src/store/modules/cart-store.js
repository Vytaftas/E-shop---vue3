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
    async getCartItems({ commit }, cartId) {
        try {
            commit('SET_CART_LOADING', true);
            const cartItems = await this.$db_api.getCartItems(cartId);

            commit('SET_CART_ITEMS', cartItems);
        } catch (error) {
            console.log(error);
        } finally {
            commit('SET_CART_LOADING', false);
        }
    },

    async addToCart({}, data) {
        try {
            await this.$db_api.addToCart(data);
        } catch (error) {
            console.log(error);
        }
    },

    async removeFromCart({}, id) {
        try {
            await this.$db_api.removeFromCart(id);
        } catch (error) {
            console.log(error);
        }
    },

    async adjustProductQuantity({}, data) {
        try {
            await this.$db_api.adjustProductQuantity(data);
        } catch (error) {
            console.log(error);
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
