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
    async getProducts({ commit, dispatch }, data) {
        try {
            const products = await this.$db_api.getProducts(data);

            if (data.returnData) {
                return products;
            } else {
                commit('SET_PRODUCTS', products.items);
                commit('SET_PAGINATION_DATA', products.paginationData);
            }

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

    async getAvailableCategories({ commit, dispatch }) {
        try {
            const categories = await this.$db_api.getAvailableCategories();

            return categories;

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

    async getAllMetaData({ commit, dispatch }) {
        try {
            return await this.$db_api.getAllMetaData();

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

    async getProduct({ commit, dispatch }, id) {
        try {
            const product = await this.$db_api.getProduct(id);

            return product;

            // commit('SET_PRODUCTS', products.items);
            // commit('SET_PAGINATION_DATA', products.paginationData);

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

    async addProduct({ commit, dispatch }, data) {
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

    async updateProduct({ commit, dispatch }, data) {
        try {
            await this.$db_api.updateProduct(data);

            dispatch('addNotification', {
                message: 'Product successfully updated',
                type: 'success',
            });
        } catch (error) {
            console.log(error.response);
            dispatch('addNotification', {
                message: 'Error while trying to update product',
                type: 'error',
            });
        }
    },

    async getProductRatings({ commit, dispatch }, data) {
        try {
            const ratings = await this.$db_api.getProductRatings(data);

            return ratings;

            // commit('SET_PRODUCTS', products.items);
            // commit('SET_PAGINATION_DATA', products.paginationData);

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

    async deleteProduct({ commit, dispatch }, id) {
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

    async addReview({ commit, dispatch }, data) {
        try {
            const review = await this.$db_api.addReview(data);

            return review;

            // commit('SET_PRODUCTS', products.items);
            // commit('SET_PAGINATION_DATA', products.paginationData);

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
    async updateReview({ commit, dispatch }, data) {
        try {
            const review = await this.$db_api.updateReview(data);

            return review;

            // commit('SET_PRODUCTS', products.items);
            // commit('SET_PAGINATION_DATA', products.paginationData);

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
    async deleteReview({ commit, dispatch }, id) {
        try {
            const review = await this.$db_api.deleteReview(id);

            return review;

            // commit('SET_PRODUCTS', products.items);
            // commit('SET_PAGINATION_DATA', products.paginationData);

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
    async addCategory({ dispatch }, data) {
        try {
            await this.$db_api.addCategory(data);

            dispatch('addNotification', {
                message: 'Category successfully added',
                type: 'success',
            });
        } catch (error) {
            console.log(error);
            // console.log(error);
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
            console.log(error);
            // console.log(error);
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
