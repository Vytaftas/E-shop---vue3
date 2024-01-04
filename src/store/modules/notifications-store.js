const state = {
    messages: [],
};
const getters = {
    notificationMessages: (state) => state.messages,
};
const actions = {
    addNotification({ commit }, notification) {
        notification.id = Math.floor(Math.random() * 1000000);
        commit('SET_MESSAGE', notification);

        setTimeout(() => {
            commit('REMOVE_MESSAGE', notification);
        }, 3000);
    },
};

const mutations = {
    SET_MESSAGE: (state, notification) => state.messages.push(notification),
    REMOVE_MESSAGE: (state, notification) => (state.messages = state.messages.filter((ogMessage) => ogMessage.id != notification.id)),
};

export default {
    state,
    getters,
    actions,
    mutations,
};
