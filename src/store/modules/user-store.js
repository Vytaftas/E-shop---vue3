const state = {
    user: null,
};
const getters = {
    currentUser: (state) => state.user,
};

const actions = {
    async getAllUsers({}, data) {
        try {
            return await this.$db_api.getAllUsers(data);
        } catch (error) {
            console.log(error);
        }
    },

    async addUser({ dispatch }, data) {
        try {
            await this.$db_api.addUser(data);

            dispatch('addNotification', {
                message: 'User added successfully',
                type: 'success',
            });
        } catch (error) {
            dispatch('addNotification', {
                message: 'Failed to add user',
                type: 'error',
            });
        }
    },
    async updateUser({ dispatch }, data) {
        try {
            await this.$db_api.updateUser(data);

            dispatch('addNotification', {
                message: 'User updated successfully',
                type: 'success',
            });
        } catch (error) {
            dispatch('addNotification', {
                message: 'Failed to update user',
                type: 'error',
            });
        }
    },

    async deleteUser({ dispatch }, user) {
        try {
            await this.$db_api.deleteUser(user);

            dispatch('addNotification', {
                message: 'User deleted successfully',
                type: 'success',
            });
        } catch (error) {
            dispatch('addNotification', {
                message: 'Failed to delete user',
                type: 'error',
            });
        }
    },

    async login({ commit, dispatch }, data) {
        try {
            const user = await this.$db_api.login(data);
            commit('ADD_CURRENT_USER', user);

            dispatch('getCartItems', user.cart_id);

            dispatch('addNotification', {
                message: 'Successfully Logged In',
                type: 'success',
            });
        } catch (error) {
            dispatch('addNotification', {
                message: 'Failed to Log In',
                type: 'error',
            });
            throw error;
        }
    },

    async register({ commit, dispatch }, data) {
        try {
            const user = await this.$db_api.register(data);

            commit('ADD_CURRENT_USER', user);

            dispatch('addNotification', {
                message: 'Successfully Registered',
                type: 'success',
            });
        } catch (error) {
            dispatch('addNotification', {
                message: 'Error while trying to register',
                type: 'error',
            });
        }
    },

    async logout({ commit, dispatch }) {
        try {
            await this.$db_api.logout();

            commit('ADD_CURRENT_USER', null);
            commit('SET_CART_ITEMS', []);
            dispatch('addNotification', {
                message: 'Logged out successfully',
                type: 'success',
            });
        } catch (error) {
            dispatch('addNotification', {
                message: 'Error while trying to log out',
                type: 'error',
            });
        }
    },

    async updatePermissions({ dispatch }, data) {
        try {
            await this.$db_api.updatePermissions(data);

            dispatch('addNotification', {
                message: 'Permissions successfully updated',
                type: 'success',
            });
        } catch (error) {
            dispatch('addNotification', {
                message: 'Failed to update permissions',
                type: 'error',
            });

            throw new Error(error.message);
        }
    },

    async getDashboardMessages() {
        try {
            return await this.$db_api.getDashboardMessages();
        } catch (error) {
            console.log(error);
        }
    },

    async addDashboardMessage({ dispatch }, data) {
        try {
            await this.$db_api.addDashboardMessage(data);
            dispatch('addNotification', {
                message: 'Message successfully added',
                type: 'success',
            });
        } catch (error) {
            console.log(error);
            dispatch('addNotification', {
                message: 'Failed to add message',
                type: 'error',
            });
        }
    },
};

const mutations = {
    ADD_CURRENT_USER: (state, user) => (state.user = user),
};

export default {
    state,
    getters,
    actions,
    mutations,
};
