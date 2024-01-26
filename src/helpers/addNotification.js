import { useStore } from 'vuex';

import store from '../store/index';

export default (text, type = 'success') => {
    store.dispatch('addNotification', {
        message: text,
        type: type,
    });
};
