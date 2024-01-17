const state = {
    component: null,
    data: null,
};
const getters = {
    showModal: (state) => state.component,
    modalData: (state) => state.data,
    selectedComponent: (state) => state.component,
};
const actions = {
    openModal({ commit }, modalData) {
        commit('SET_SELECTED_COMPONENT', modalData.component);
        commit('SET_MODAL_DATA', modalData.data);
    },

    closeModal({ commit }) {
        commit('SET_SELECTED_COMPONENT', null);
        commit('SET_MODAL_DATA', null);
    },
};

const mutations = {
    SET_MODAL_DATA: (state, data) => (state.data = data),
    SET_SELECTED_COMPONENT: (state, component) => (state.component = component),
};

export default {
    state,
    getters,
    actions,
    mutations,
};
