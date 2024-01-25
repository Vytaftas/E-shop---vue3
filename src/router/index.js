import { createRouter, createWebHistory } from 'vue-router';
import Home from '../view/Home.vue';
import SingleProduct from '../view/SingleProductPage.vue';
import SingleCategory from '../view/SingleCategory.vue';
import Categories from '../view/Categories.vue';
import Shop from '../view/Shop.vue';
import About from '../view/About.vue';
import NotFound from '../view/NotFound.vue';
import MyAccount from '../view/MyAccount.vue';
import HomePage from '../view/HomePage.vue';
import LoginRegister from '../components/Forms/LoginRegister.vue';
import AdminDashboard from '../view/AdminDashboard.vue';
import ManageProducts from '../components/Admin/ManageProducts.vue';
import ManageMeta from '../components/Admin/ManageMeta.vue';
import ManageCategories from '../components/Admin/ManageCategories.vue';
import ManageUsers from '../components/Admin/ManageUsers.vue';
import Dashboard from '../components/Admin/Dashboard.vue';
import EditProduct from '../components/Admin/EditProduct/EditProduct.vue';

const routes = [
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: AdminDashboard,
        children: [
            { name: 'Dashboard', path: '', component: Dashboard },
            { name: 'Manage Products', path: 'manage-products', component: ManageProducts },
            { name: 'Manage Products Metadata', path: 'manage-metadata', component: ManageMeta },
            { name: 'Edit Product', path: 'manage-products/:id', component: EditProduct },
            { name: 'Add Product', path: 'manage-products/add-new', component: EditProduct, props: { addNew: true } },
            { name: 'Manage Categories', path: 'manage-categories', component: ManageCategories },
            { name: 'Manage Users', path: 'manage-users', component: ManageUsers },
        ],
    },
    {
        path: '/',
        component: Home,
        children: [
            { name: 'Home', path: '', component: HomePage },
            { name: 'Shop', path: '/shop/', component: Shop },
            { name: 'Product', path: '/shop/product/:id', component: SingleProduct },
            { name: 'Categories', path: '/shop/categories', component: Categories },
            { name: 'Category', path: '/shop/categories/:categoryName', component: SingleCategory },
            { name: 'About', path: '/about-us/', component: About },
            { name: 'NotFound', path: '/:pathMatch(.*)*', component: NotFound },
            {
                name: 'My Account',
                path: '/my-account/',
                component: MyAccount,
                children: [
                    {
                        name: 'Login',
                        path: 'login',
                        component: LoginRegister,
                        props: { register: false },
                    },
                    {
                        name: 'Register',
                        path: 'register',
                        component: LoginRegister,
                        props: { register: true },
                    },
                ],
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return { top: 0 };
    },
});

export default router;
