import PocketBase from 'pocketbase';

const url = DB_URL;
export const PocketBaseDB = new PocketBase(url);
PocketBaseDB.autoCancellation(false);

(async () => {
    const vueStore = await import('../store');
    const store = vueStore.default;

    try {
        const currentUser = PocketBaseDB.authStore.model;

        if (!currentUser) return store.commit('ADD_CURRENT_USER', null);

        const userId = currentUser.id;

        const userData = await PocketBaseDB.collection('users').getOne(userId, { expand: 'permissions_id, user_info' });
        store.commit('ADD_CURRENT_USER', userData);

        await store.dispatch('getCartItems', userData.cart_id);
    } catch (error) {
        console.log(error.response);
        store.commit('ADD_CURRENT_USER', null);
        throw new Error(error.message);
    }

    PocketBaseDB.authStore.onChange(async (token, user) => {
        if (!token) return store.commit('ADD_CURRENT_USER', null);
    });
})();
