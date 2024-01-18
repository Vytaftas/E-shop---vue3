const state = {
    user: null,
};
const getters = {
    currentUser: (state) => state.user,
};

const collectionName = 'users';

const actions = {
    async getAllUsers({ commit, dispatch }, data) {
        try {
            return await this.$db_api.getAllUsers(data);

            // console.log(products);

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

    async addUser({ dispatch }, data) {
        try {
            await this.$db_api.addUser(data);

            dispatch('addNotification', {
                message: 'User added successfully',
                type: 'success',
            });
        } catch (error) {
            console.log(error.response);
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
            console.log(error.response);
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

            // dispatch('addNotification', {
            //     message: 'Prisijungta sėkmingai',
            //     type: 'success',
            // });
        } catch (error) {
            // dispatch('addNotification', {
            //     message: 'Nepavyko prisijungti',
            //     type: 'error',
            // });

            throw error;
        }
    },

    async register({ commit, dispatch }, data) {
        try {
            const user = await this.$db_api.register(data);

            commit('ADD_CURRENT_USER', user);

            // dispatch('addNotification', {
            //     message: 'Prisijungta sėkmingai',
            //     type: 'success',
            // });
        } catch (error) {
            // dispatch('addNotification', {
            //     message: 'Nepavyko prisijungti',
            //     type: 'error',
            // });
            // return error;
            console.log(error);

            throw error;
        }
    },

    async logout({ dispatch, commit }) {
        try {
            await this.$db_api.logout();

            commit('ADD_CURRENT_USER', null);
            // dispatch('addNotification', {
            //     message: 'Atsijungta sėkmingai',
            //     type: 'success',
            // });
        } catch (error) {
            console.log(error);
            // dispatch('addNotification', {
            //     message: 'Nepavykto atsijungti',
            //     type: 'error',
            // });
        }
    },

    async changeUserPassword({ dispatch }, data) {
        try {
            await this.$db_api.updateCollectionItem({ collectionName, id: data.id, data: data.data, refresh: true });

            dispatch('addNotification', {
                message: 'Slaptažodis sėkmingai pakeistas',
                type: 'success',
            });
        } catch (error) {
            dispatch('addNotification', {
                message: 'Nepavykto pakeisti slaptažodžio',
                type: 'error',
            });

            throw new Error(error.message);
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
