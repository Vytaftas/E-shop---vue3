import { PocketBaseDB } from '../../pocketbase/pocketbase';

export const DB_API = (store) =>
    (store.$db_api = {
        async login({ username, password }) {
            try {
                const authData = await PocketBaseDB.collection('users').authWithPassword(username, password);

                console.log(authData.record);
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
                console.log('logout in db-api');
                PocketBaseDB.authStore.clear();
            } catch (error) {
                console.log(error);
                throw new Error(error.message);
            }
        },

        async getProducts({ page = 1, amount = 12, filterData, getAvailableCategories = false, categoryName }) {
            try {
                if (getAvailableCategories) {
                    const categories = await this.getAvailableCategories({ filter: `name ~ '${categoryName}'` });

                    filterData.filter
                        ? (filterData.filter += ` && categories ~ '${categories[0].id}'`)
                        : (filterData.filter = `categories ~ '${categories[0].id}'`);
                }

                const productsData = await PocketBaseDB.collection('products').getList(page, amount, {
                    ...filterData,
                    expand: 'product_ratings(product_id).user_id, categories, rating_id',
                    sort: '-created',
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
            console.log(data);
            try {
                return await PocketBaseDB.collection('products').create(data);
            } catch (error) {
                throw error;
            }
        },

        async updateProduct(data) {
            const { productId, formData } = data;
            console.log(productId);
            console.log(formData);
            try {
                return await PocketBaseDB.collection('products').update(productId, formData);
            } catch (error) {
                throw error;
            }
        },

        async getAvailableCategories(filterData) {
            try {
                return await PocketBaseDB.collection('available_categories').getFullList({
                    ...filterData,
                });
            } catch (error) {
                console.log(error);
            }
        },

        async getProduct(id) {
            try {
                const product = await PocketBaseDB.collection('products').getOne(id, { expand: 'product_ratings(product_id).user_id, categories' });
                console.log(product);
                return product;
            } catch (error) {
                throw error;
                // error.response
            }
        },

        async getProductRatings({ productId }) {
            try {
                return await PocketBaseDB.collection('product_ratings').getList(1, 50, {
                    expand: 'user_id, product_id, rating_id',
                    filter: `product_id = '${productId}'`,
                });
            } catch (error) {
                throw error;
                // error.response
            }
        },

        async getCartItems(cartId) {
            try {
                const items = await PocketBaseDB.collection('cart_items').getFullList({
                    filter: `cart_id = '${cartId}'`,
                    expand: 'product_id, product_id.categories',
                });

                return items;
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

        async addToCart({ product_id, cart_id, quantity }) {
            try {
                const isInCart = await PocketBaseDB.collection('cart_items').getFullList({
                    filter: `product_id = '${product_id}' && cart_id = '${cart_id}'`,
                });

                if (isInCart.length) {
                    return await this.adjustProductQuantity({ cartItemId: isInCart[0].id, quantity: isInCart[0].quantity + quantity });
                } else {
                    return await PocketBaseDB.collection('cart_items').create({ product_id, cart_id, quantity });
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
    });
