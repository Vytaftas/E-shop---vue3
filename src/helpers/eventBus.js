import { ref } from 'vue';

const events = ref({});

const emit = (event, data) => {
    if (events.value[event]) {
        events.value[event].forEach((callback) => {
            callback(data);
        });
    }
};

const on = (event, callback) => {
    if (!events.value[event]) {
        events.value[event] = [];
    }
    events.value[event].push(callback);
};

export { emit, on };
