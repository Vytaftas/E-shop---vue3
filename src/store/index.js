import { createStore } from 'vuex';

import userStore from './modules/user-store';
import productsStore from './modules/products-store';
import cartStore from './modules/cart-store';
import notificationsStore from './modules/notifications-store';
import modalStore from './modules/modal-store';

import { DB_API } from './plugins/db-api';

export default createStore({
    modules: {
        userStore,
        productsStore,
        cartStore,
        notificationsStore,
        modalStore,
    },
    plugins: [DB_API],
});
