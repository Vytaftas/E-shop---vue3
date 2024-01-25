// import { PocketBaseDB } from '../../pocketbase/pocketbase';

const state = {
    products: [],
    categories: [],
    paginationData: {
        page: 1,
        perPage: 12,
        totalItems: 0,
        totalPages: 0,
    },
};
const getters = {
    products: (state) => state.products,
    paginationData: (state) => state.paginationData,
    availableCategories: (state) => state.categories,
};

const actions = {
    async getProducts({ commit }, data) {
        try {
            const products = await this.$db_api.getProducts(data);

            if (data.returnData) {
                return products;
            } else {
                commit('SET_PRODUCTS', products.items);
                commit('SET_PAGINATION_DATA', products.paginationData);
            }
        } catch (error) {
            console.log(error);
        }
    },

    async getAvailableCategories({}) {
        try {
            return await this.$db_api.getAvailableCategories();
        } catch (error) {
            console.log(error);
        }
    },

    async getAllMetaData({}) {
        try {
            return await this.$db_api.getAllMetaData();
        } catch (error) {
            console.log(error);
        }
    },
    async addMetaData({ dispatch }, data) {
        try {
            await this.$db_api.addMetaData(data);

            dispatch('addNotification', {
                message: 'Meta data added successfully',
                type: 'success',
            });
        } catch (error) {
            console.log(error);
            dispatch('addNotification', {
                message: 'Failed to add meta data',
                type: 'error',
            });
        }
    },
    async updateMetaData({ dispatch }, data) {
        try {
            await this.$db_api.updateMetaData(data);

            dispatch('addNotification', {
                message: 'Meta data updated successfully',
                type: 'success',
            });
        } catch (error) {
            console.log(error);
            dispatch('addNotification', {
                message: 'Failed to update meta data',
                type: 'error',
            });
        }
    },
    async deleteMetaData({ dispatch }, id) {
        try {
            await this.$db_api.deleteMetaData(id);

            dispatch('addNotification', {
                message: 'Meta data deleted successfully',
                type: 'success',
            });
        } catch (error) {
            console.log(error);
            dispatch('addNotification', {
                message: 'Failed to deleta meta data',
                type: 'error',
            });
        }
    },

    async getProduct({ commit, dispatch }, id) {
        try {
            return await this.$db_api.getProduct(id);
        } catch (error) {
            console.log(error);
        }
    },

    async addProduct({ dispatch }, data) {
        try {
            await this.$db_api.addProduct(data);

            dispatch('addNotification', {
                message: 'Product successfully added',
                type: 'success',
            });
        } catch (error) {
            dispatch('addNotification', {
                message: 'Error while trying to add product',
                type: 'error',
            });
        }
    },

    async updateProduct({ dispatch }, data) {
        try {
            await this.$db_api.updateProduct(data);

            dispatch('addNotification', {
                message: 'Product successfully updated',
                type: 'success',
            });
        } catch (error) {
            dispatch('addNotification', {
                message: 'Error while trying to update product',
                type: 'error',
            });
        }
    },

    async getProductRatings({}, data) {
        try {
            return await this.$db_api.getProductRatings(data);
        } catch (error) {
            console.log(error);
        }
    },

    async deleteProduct({ dispatch }, id) {
        try {
            await this.$db_api.deleteProduct(id);

            dispatch('addNotification', {
                message: 'Product successfully deleted',
                type: 'success',
            });
        } catch (error) {
            dispatch('addNotification', {
                message: 'Error while trying to delete product',
                type: 'error',
            });
        }
    },

    async addReview({}, data) {
        try {
            return await this.$db_api.addReview(data);
        } catch (error) {
            console.log(error);
        }
    },
    async updateReview({}, data) {
        try {
            return await this.$db_api.updateReview(data);
        } catch (error) {
            console.log(error);
        }
    },
    async deleteReview({}, id) {
        try {
            return await this.$db_api.deleteReview(id);
        } catch (error) {
            console.log(error);
        }
    },
    async addCategory({ dispatch }, data) {
        try {
            await this.$db_api.addCategory(data);

            dispatch('addNotification', {
                message: 'Category successfully added',
                type: 'success',
            });
        } catch (error) {
            dispatch('addNotification', {
                message: 'Failed to add category',
                type: 'error',
            });
        }
    },
    async updateCategory({ dispatch }, data) {
        try {
            await this.$db_api.updateCategory(data);

            dispatch('addNotification', {
                message: 'Category successfully updated',
                type: 'success',
            });
        } catch (error) {
            dispatch('addNotification', {
                message: 'Failed to update category',
                type: 'error',
            });
        }
    },
    async deleteCategory({ dispatch }, id) {
        try {
            await this.$db_api.deleteCategory(id);

            dispatch('addNotification', {
                message: 'Category successfully deleted',
                type: 'success',
            });
        } catch (error) {
            dispatch('addNotification', {
                message: 'Failed to delete category',
                type: 'error',
            });
        }
    },
};

const mutations = {
    SET_PRODUCTS: (state, products) => (state.products = products),
    SET_AVAILABLE_CATEGORIES: (state, categories) => (state.categories = categories),
    SET_PAGINATION_DATA: (state, data) => (state.paginationData = data),
};

export default {
    state,
    getters,
    actions,
    mutations,
};
