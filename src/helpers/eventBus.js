// eventBus.js

import { ref } from 'vue';

const events = ref({});

// Function to emit events
const emit = (event, data) => {
    if (events.value[event]) {
        events.value[event].forEach((callback) => {
            callback(data);
        });
    }
};

// Function to listen to events
const on = (event, callback) => {
    if (!events.value[event]) {
        events.value[event] = [];
    }
    events.value[event].push(callback);
};

export { emit, on };
