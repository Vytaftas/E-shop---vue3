<template>
    <h4 class="my-account-page-heading">Change Password</h4>

    <form v-if="currentUser" @submit.prevent="handlePasswordChangeSubmit">
        <div class="single-form-input">
            <label for="old-password">Current Password</label>
            <div class="input-wrap">
                <input
                    id="old-password"
                    name="old-password"
                    :type="showFormData.oldPassword ? 'text' : 'password'"
                    minlength="8"
                    v-model.trim="formData.oldPassword"
                    autocomplete="current-password"
                    :class="{ error: formDataErrors.oldPassword }"
                    @input="resetErrors"
                />
                <i @click="showFormData.oldPassword = !showFormData.oldPassword" class="fa-solid fa-eye show-password"></i>
            </div>
            <p class="error-message" v-if="formDataErrors.oldPassword">Incorrect Password</p>
        </div>

        <div class="single-form-input">
            <label for="new-password">New Password</label>

            <div class="input-wrap">
                <input
                    id="new-password"
                    name="new-password"
                    :type="showFormData.password ? 'text' : 'password'"
                    minlength="8"
                    v-model.trim="formData.password"
                    autocomplete="new-password"
                    :class="{ error: formDataErrors.passwordsDontMatch }"
                    @input="resetErrors"
                />
                <i @click="showFormData.password = !showFormData.password" class="fa-solid fa-eye show-password"></i>
            </div>
        </div>

        <div class="single-form-input">
            <label for="password-confirm">Confirm Password</label>

            <div class="input-wrap">
                <input
                    id="password-confirm"
                    name="password-confirm"
                    :type="showFormData.passwordConfirm ? 'text' : 'password'"
                    minlength="8"
                    v-model.trim="formData.passwordConfirm"
                    autocomplete="new-password"
                    :class="{ error: formDataErrors.passwordsDontMatch }"
                    @input="resetErrors"
                />
                <i @click="showFormData.passwordConfirm = !showFormData.passwordConfirm" class="fa-solid fa-eye show-password"></i>
                <p class="error-message" v-if="formDataErrors.passwordsDontMatch">Passwords don't match</p>
            </div>
        </div>
        <p class="error-message" v-if="formDataErrors.fieldsEmpty">Fields can't be empty</p>
        <button type="submit" class="button-main">{{ submitting ? 'Please Wait..' : 'Change Password' }}</button>
    </form>

    <LoadingOverlay v-else background="transparent" color="black" />
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useStore } from 'vuex';
import router from '../../router';
import LoadingOverlay from '../Misc/LoadingOverlay.vue';

const store = useStore();

const props = defineProps({
    currentUser: { default: null },
});

const formData = reactive({
    oldPassword: '',
    password: '',
    passwordConfirm: '',
});

const showFormData = reactive({
    oldPassword: false,
    password: false,
    passwordConfirm: false,
});

const formDataErrors = reactive({
    passwordsDontMatch: false,
    oldPassword: false,
    fieldsEmpty: false,
});

const resetErrors = () => {
    formDataErrors.passwordsDontMatch = false;
    formDataErrors.oldPassword = false;
    formDataErrors.fieldsEmpty = false;
};

const resetForm = () => {
    formData.oldPassword = '';
    formData.password = '';
    formData.passwordConfirm = '';
};

const submitting = ref(false);

const handlePasswordChangeSubmit = async () => {
    if (formData.password !== formData.passwordConfirm) return (formDataErrors.passwordsDontMatch = true);
    if (Object.keys(formData).some((key) => !formData[key])) return (formDataErrors.fieldsEmpty = true);
    if (props.currentUser.username === 'admin')
        return store.dispatch('addNotification', { message: "Admin password can't be changed", type: 'error' });

    try {
        submitting.value = true;
        await store.dispatch('updateUser', { userId: props.currentUser.id, userData: formData });
        resetForm();
        store.dispatch('logout');
        router.push('/login');
    } catch (error) {
        if (error.response.data.oldPassword) formDataErrors.oldPassword = true;
    } finally {
        submitting.value = false;
    }
};
</script>

<style scoped>
.error-message {
    margin-top: 5px;
}
.my-account-page-heading {
    font-size: 20px;
    font-weight: 500;
}

.single-form-input {
    display: flex;
    flex-direction: column;
    width: calc(50% - 10px);
}

.single-form-input input {
    padding: 10px;
    border: none;
    outline: none;
    background-color: rgba(0, 0, 0, 0.055);
    transition: 0.2s;
    border-radius: 3px;
    width: 100%;
}

.single-form-input input.error {
    background-color: rgba(255, 0, 0, 0.411);
}

.single-form-input input:focus-visible:not(.error) {
    background-color: rgba(255, 123, 0, 0.247);
}

.single-form-input label {
    display: inline-block;
    margin-bottom: 5px;
    font-weight: 500;
}

.input-wrap {
    position: relative;
}

form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
    margin-top: 10px;
}

.show-password {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: rgb(90, 90, 90);
    transition: 0.2s;
}

.show-password:hover {
    color: black;
}
</style>
