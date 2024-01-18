import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

import router from './router';
import store from './store';
import { emit, on } from './helpers/eventBus';

const app = createApp(App);

app.use(router);
app.use(store);

app.provide('eventBus', {
    emit,
    on,
});

app.mount('#app');
