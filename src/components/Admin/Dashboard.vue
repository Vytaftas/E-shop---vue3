<template>
    <div class="dashboard-wrapper">
        <div class="dashboard">
            <div class="left-side">
                <h3 class="dashboard-heading">Admin Dashboard</h3>
                <p class="dashboard-description">Welcome! Here you can manage:</p>
                <p class="dashboard-items-list">Products, Products Metadata, Categories and Users</p>

                <div class="dashboard-message-wrap">
                    <form class="message-form" @submit.prevent="addNewMessage">
                        <p class="form-description">Leave a message for other users or developer.</p>
                        <div class="single-input-wrap">
                            <label for="name-input">Your Name</label>
                            <input
                                type="text"
                                placeholder="Name.."
                                id="name-input"
                                name="name-input"
                                v-model.trim="formData.name.value"
                                maxlength="100"
                            />
                        </div>
                        <div class="single-input-wrap">
                            <label for="message-input">Message</label>
                            <textarea
                                name=""
                                id=""
                                cols="30"
                                rows="6"
                                placeholder="Message.."
                                v-model.trim="formData.message.value"
                                :class="{ error: formData.message.error }"
                                @input="formData.message.error = false"
                            ></textarea>
                            <span class="error-message" v-if="formData.message.error">Please enter your message.</span>
                        </div>

                        <button type="submit" class="button-main">{{ formSubmitting ? 'Please wait..' : 'Submit' }}</button>
                        <LoadingOverlay background="transparent" color="rgb(255, 123, 0)" v-if="formSubmitting" />
                    </form>
                </div>
            </div>
            <div class="right-side">
                <h3>Messages</h3>
                <div class="messages-wrap">
                    <div class="single-message" v-for="message of messages" :key="message.id">
                        <p class="single-message-info">
                            <span class="name">{{ message.name ? message.name : 'Anonymous' }}</span> as
                            {{ message?.expand?.user?.name ? message?.expand?.user?.name : message?.expand?.user?.username }}
                        </p>
                        <div class="divider"></div>

                        <p class="single-message-message">{{ message.message }}</p>

                        <p class="date">{{ formatDate(message.created) }}</p>
                    </div>
                    <LoadingOverlay background="transparent" color="rgb(255, 123, 0)" v-if="messagesLoading" />
                    <p v-if="!messagesLoading && !messages.length">No messages found.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import formatDate from '../../helpers/formatDate';
import LoadingOverlay from '../Misc/LoadingOverlay.vue';

const store = useStore();
const currentUser = computed(() => store.getters.currentUser);

const formSubmitting = ref(false);
const messagesLoading = ref(false);
const messages = ref([]);

const formData = reactive({
    name: { value: '', error: false },
    message: { value: '', error: false },
});

const addNewMessage = async () => {
    try {
        formSubmitting.value = true;
        if (!formData.message.value) return (formData.message.error = true);
        const data = { name: formData.name.value, message: formData.message.value, user: currentUser.value.id };

        await store.dispatch('addDashboardMessage', data);
        getMessages();
    } catch (error) {
        console.log(error);
    } finally {
        formData.name.value = '';
        formData.message.value = '';
        formSubmitting.value = false;
    }
};

const getMessages = async () => {
    try {
        messagesLoading.value = true;
        const response = await store.dispatch('getDashboardMessages');

        messages.value = response;
    } catch (error) {
        console.log(error);
    } finally {
        messagesLoading.value = false;
    }
};

onMounted(() => {
    getMessages();
});
</script>

<style scoped>
.dashboard-wrapper {
    position: relative;
    height: 100%;
    background-color: #f6faff;
}

.dashboard {
    padding: 25px;
    height: 100%;
    display: grid;
    grid-template-columns: 500px 500px;
    gap: 50px;
}

.dashboard-heading {
    font-size: 30px;
    font-weight: 600;
}

.dashboard-description {
    font-size: 20px;
    margin-top: 20px;
}

.dashboard-items-list {
    font-weight: 600;
}

.dashboard-message-wrap {
    margin-top: 25px;
}

.form-description {
    font-weight: 500;
}

.message-form {
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
    border-radius: 10px;
    background-color: white;
    box-shadow: 0 3px 10px 0 #0000000f;
    position: relative;
}

.message-form input,
.message-form textarea {
    outline: none;
    border: none;
    padding: 5px;
    font-size: 14px;
    border-radius: 3px;
    border: 1px solid gray;
    box-shadow: 0 3px 3px 0 #0000000f;
    resize: none;
}

.message-form button {
    margin-top: 10px;
}

#name-input {
    max-width: 200px;
}

form textarea.error {
    border-color: red;
}
.single-input-wrap {
    display: flex;
    flex-direction: column;
}

.right-side h3 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 10px;
}

.messages-wrap {
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow: auto;
    height: 800px;
    padding-right: 10px;
    padding-bottom: 10px;
    position: relative;
}

.single-message {
    padding: 20px;
    border-radius: 10px;
    background-color: white;
    box-shadow: 0 3px 10px 0 #0000000f;
}

.single-message-info {
    font-size: 14px;
}

.date {
    font-size: 14px;
    color: gray;
    text-align: right;
    margin-top: 20px;
}

.name {
    font-weight: 600;
}

.divider {
    height: 1px;
    width: 100%;
    background-color: #00000015;
    margin: 10px 0;
}
</style>
