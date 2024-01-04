import PocketBase from 'pocketbase';

const url = 'https://my-shop-app.pockethost.io/';
export const PocketBaseDB = new PocketBase(url);

(async () => {
    const vueStore = await import('../store');
    const vueRouter = await import('../router');
    const store = vueStore.default;
    const router = vueRouter.default;

    try {
        const currentUser = PocketBaseDB.authStore.model;

        if (!currentUser) return store.commit('ADD_CURRENT_USER', null);

        const userId = currentUser.id;

        const userData = await PocketBaseDB.collection('users').getOne(userId, { expand: 'permissions_id' });
        console.log(userData);
        store.commit('ADD_CURRENT_USER', userData);

        await store.dispatch('getCartItems', userData.cart_id);
    } catch (error) {
        console.log(error);
        store.commit('ADD_CURRENT_USER', null);
        throw new Error(error.message);
    } finally {
        // store.commit('SET_CONTENT_LOADING', false);
    }

    PocketBaseDB.authStore.onChange((token) => {
        console.log('pocketbase change');
        if (!token) {
            store.commit('ADD_CURRENT_USER', null);
        }
    });
})();
