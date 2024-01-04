import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    define: {
        DB_URL: JSON.stringify('https://my-shop-app.pockethost.io/'),
    },
});
