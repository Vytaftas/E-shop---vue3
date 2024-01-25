import { PocketBaseDB } from '../../pocketbase/pocketbase';

export const DB_API = (store) =>
    (store.$db_api = {
        async login({ username, password }) {
            try {
                const authData = await PocketBaseDB.collection('users').authWithPassword(username, password);

                return authData.record;
            } catch (error) {
                throw error;
            }
        },

        async register({ username, email, password, passwordConfirm }) {
            try {
                const data = {
                    username,
                    email,
                    password,
                    passwordConfirm,
                    emailVisibility: true,
                };

                const user = await PocketBaseDB.collection('users').create(data);

                const cart = await PocketBaseDB.collection('carts').create({ user_id: user.id });

                await PocketBaseDB.collection('users').update(user.id, { cart_id: cart.id });

                return await this.login({ username, password });
            } catch (error) {
                console.log(error.response);
                throw error;
            }
        },

        logout() {
            try {
                PocketBaseDB.authStore.clear();
            } catch (error) {
                console.log(error);
                throw new Error(error.message);
            }
        },

        async getProducts({ page = 1, amount = 12, filterData, getAvailableCategories = false, categoryName }) {
            try {
                if (getAvailableCategories) {
                    const categories = await this.getAvailableCategories({ filter: `link = '${categoryName}'` });

                    if (filterData?.filter) {
                        filterData.filter = `(${filterData.filter})`;
                        filterData.filter += ` && categories ~ '${categories[0].id}'`;
                    } else {
                        filterData = { filter: `categories ~ '${categories[0].id}'` };
                    }
                }

                const productsData = await PocketBaseDB.collection('products').getList(page, amount, {
                    ...filterData,
                    expand: 'product_ratings(product_id).user_id, categories, rating_id, product_meta',
                    sort: '-created',
                });

                const { items, ...paginationData } = productsData;

                return { items, paginationData };
            } catch (error) {
                console.log(error.response);
            }
        },
        async getAllUsers({ page = 1, amount = 12 }) {
            try {
                const productsData = await PocketBaseDB.collection('users').getList(page, amount, {
                    sort: '-created',
                    expand: 'permissions_id',
                });

                const { items, ...paginationData } = productsData;

                return { items, paginationData };
            } catch (error) {
                console.log(error);
            }
        },
        async deleteProduct(id) {
            try {
                return await PocketBaseDB.collection('products').delete(id);
            } catch (error) {
                throw error;
            }
        },

        async addProduct(data) {
            try {
                return await PocketBaseDB.collection('products').create(data);
            } catch (error) {
                console.log(error.response);
                throw error;
            }
        },

        async updateProduct(data) {
            const { productId, formData } = data;

            try {
                return await PocketBaseDB.collection('products').update(productId, formData);
            } catch (error) {
                throw error;
            }
        },

        async addUser(data) {
            const { userData, newPermissions } = data;

            try {
                const user = await PocketBaseDB.collection('users').create(userData);

                const permissions = await this.createPermissions(newPermissions);

                const cart = await this.createCart(user.id);

                return await PocketBaseDB.collection('users').update(user.id, { cart_id: cart.id, permissions_id: permissions.id });
            } catch (error) {
                throw error;
            }
        },

        async updateUser(data) {
            const { userId, userData } = data;

            try {
                return await PocketBaseDB.collection('users').update(userId, userData);
            } catch (error) {
                throw error;
            }
        },
        async deleteUser(user) {
            try {
                await PocketBaseDB.collection('users').delete(user.id);
                await this.deleteCart(user.cart_id);
                await this.deletePermissions(user.permissions_id);
            } catch (error) {
                throw error;
            }
        },

        async getAvailableCategories(filterData) {
            try {
                return await PocketBaseDB.collection('available_categories').getFullList({
                    ...filterData,
                    sort: '-created',
                });
            } catch (error) {
                console.log(error);
            }
        },

        async getAllMetaData() {
            try {
                return await PocketBaseDB.collection('meta_data').getFullList({
                    sort: '-created',
                });
            } catch (error) {
                console.log(error);
            }
        },

        async addMetaData(data) {
            try {
                return await PocketBaseDB.collection('meta_data').create(data);
            } catch (error) {
                console.log(error);
            }
        },
        async updateMetaData({ metaId, metaData }) {
            try {
                return await PocketBaseDB.collection('meta_data').update(metaId, metaData);
            } catch (error) {
                console.log(error);
            }
        },

        async deleteMetaData(id) {
            try {
                return await PocketBaseDB.collection('meta_data').delete(id);
            } catch (error) {
                console.log(error);
            }
        },

        async getProduct(id) {
            try {
                return await PocketBaseDB.collection('products').getOne(id, {
                    expand: 'product_ratings(product_id).user_id, categories, product_meta',
                });
            } catch (error) {
                throw error;
            }
        },

        async getProductRatings({ productId }) {
            try {
                return await PocketBaseDB.collection('product_ratings').getList(1, 50, {
                    expand: 'user_id, product_id, rating_id',
                    filter: `product_id = '${productId}'`,
                });
            } catch (error) {
                throw error.response;
            }
        },

        async getCartItems(cartId) {
            try {
                return await PocketBaseDB.collection('cart_items').getFullList({
                    filter: `cart_id = '${cartId}'`,
                    expand: 'product_id, product_id.categories, meta',
                    sort: '-created',
                });
            } catch (error) {
                console.log(error);
            }
        },

        async adjustProductQuantity({ cartItemId, quantity }) {
            try {
                return await PocketBaseDB.collection('cart_items').update(cartItemId, { quantity });
            } catch (error) {
                console.log(error);
            }
        },

        async addToCart({ product_id, cart_id, quantity, meta }) {
            let metaIds = '';

            meta.forEach((item, index) => {
                metaIds += `meta ~ '${item}'`;
                if (index !== meta.length - 1) metaIds += ' && ';
            });

            let cartItemsFilter = `product_id = '${product_id}' && cart_id = '${cart_id}'`;

            metaIds ? (cartItemsFilter += ` && ${metaIds}`) : (cartItemsFilter += ` && meta = '[]'`);

            try {
                const isInCart = await PocketBaseDB.collection('cart_items').getFullList({
                    expand: 'meta',
                    filter: cartItemsFilter,
                });

                if (isInCart.length) {
                    return await this.adjustProductQuantity({ cartItemId: isInCart[0].id, quantity: isInCart[0].quantity + quantity });
                } else {
                    return await PocketBaseDB.collection('cart_items').create({ product_id, cart_id, quantity, meta });
                }
            } catch (error) {
                console.log(error);
            }
        },

        async removeFromCart(id) {
            try {
                return await PocketBaseDB.collection('cart_items').delete(id);
            } catch (error) {
                console.log(error);
            }
        },

        async createCart(user_id) {
            try {
                return await PocketBaseDB.collection('carts').create({ user_id });
            } catch (error) {
                console.log(error);
            }
        },

        async deleteCart(id) {
            try {
                return await PocketBaseDB.collection('carts').delete(id);
            } catch (error) {
                console.log(error);
            }
        },

        async addReview(data) {
            try {
                return await PocketBaseDB.collection('product_ratings').create(data);
            } catch (error) {
                console.log(error);
            }
        },

        async updateReview({ ratingId, data }) {
            try {
                return await PocketBaseDB.collection('product_ratings').update(ratingId, data);
            } catch (error) {
                console.log(error);
            }
        },
        async deleteReview(id) {
            try {
                return await PocketBaseDB.collection('product_ratings').delete(id);
            } catch (error) {
                console.log(error);
            }
        },
        async addCategory(data) {
            try {
                return await PocketBaseDB.collection('available_categories').create(data);
            } catch (error) {
                console.log(error);
            }
        },
        async updateCategory({ categoryId, data }) {
            try {
                return await PocketBaseDB.collection('available_categories').update(categoryId, data);
            } catch (error) {
                console.log(error);
            }
        },
        async deleteCategory(id) {
            try {
                return await PocketBaseDB.collection('available_categories').delete(id);
            } catch (error) {
                console.log(error);
            }
        },

        async createPermissions(data) {
            try {
                return await PocketBaseDB.collection('permissions').create(data);
            } catch (error) {
                console.log(error);
            }
        },
        async updatePermissions({ permissionsId, data }) {
            try {
                return await PocketBaseDB.collection('permissions').update(permissionsId, data);
            } catch (error) {
                console.log(error);
            }
        },
        async deletePermissions(id) {
            try {
                return await PocketBaseDB.collection('permissions').delete(id);
            } catch (error) {
                console.log(error);
            }
        },
    });
