<template>
    <div class="form-wrap">
        <div class="login-info-message" v-if="showInfoMessage && !register">
            <p>To Log In as an admin use:</p>
            <span>Login: admin</span>
            <span>Password: adminadmin</span>
            <i class="fa-solid fa-xmark close-info-message" @click="showInfoMessage = false"></i>
        </div>

        <form @submit.prevent="handleSubmit">
            <img class="logo" :src="logo" alt="" />
            <h3>{{ register ? 'Register' : 'Log In' }}</h3>

            <div class="single-input-wrapper">
                <label for="username">{{ register ? 'Username' : 'Username or Email' }}</label>
                <input
                    type="text"
                    required
                    maxlength="60"
                    placeholder="Enter your username or email.."
                    v-model.trim="username"
                    @input="errors.username = null"
                />
                <span class="error-message" v-if="errors.username">{{ errors.username }}</span>
            </div>

            <div v-if="register" class="single-input-wrapper">
                <label for="email">Email</label>
                <input
                    type="text"
                    required
                    maxlength="60"
                    placeholder="Enter your username or email.."
                    v-model.trim="email"
                    @input="errors.email = null"
                />
                <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
            </div>

            <div class="single-input-wrapper">
                <label for="password">Password</label>

                <div class="input-wrap">
                    <input
                        :type="showPassword ? 'text' : 'password'"
                        required
                        minlength="8"
                        placeholder="Enter your password.."
                        v-model.trim="password"
                        @input="errors.password = null"
                    />
                    <i @click="showPassword = !showPassword" class="fa-solid fa-eye show-password"></i>
                </div>

                <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
            </div>

            <div v-if="register" class="single-input-wrapper">
                <label for="password">Confirm Password</label>

                <div class="input-wrap">
                    <input
                        :type="showPasswordConfirm ? 'text' : 'password'"
                        required
                        minlength="8"
                        placeholder="Repeat password.."
                        v-model.trim="passwordConfirm"
                        @input="errors.passwordConfirm = null"
                    />
                    <i @click="showPasswordConfirm = !showPasswordConfirm" class="fa-solid fa-eye show-password"></i>
                </div>
                <span class="error-message" v-if="errors.passwordConfirm">{{ errors.passwordConfirm }}</span>
            </div>

            <span class="error-message" v-if="errors.global">{{ errors.global }}</span>

            <button type="submit" class="login-button">{{ loading ? 'Please wait..' : buttonText }}</button>

            <span class="footer-action"
                >Don't have an account?
                <router-link :to="register ? '/my-account/login' : '/my-account/register'" class="register-button">{{
                    footerActionText
                }}</router-link></span
            >
        </form>
    </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import logo from '../../assets/logo.svg';
import router from '../../router';

const props = defineProps(['register']);

const buttonText = computed(() => (props.register ? 'Register' : 'Login'));
const footerActionText = computed(() => (props.register ? 'Login' : 'Register'));

const showPassword = ref(false);
const showPasswordConfirm = ref(false);

const store = useStore();

const loading = ref(false);

const username = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');

const errors = reactive({
    username: null,
    email: null,
    password: null,
    passwordConfirm: null,
    global: null,
});

const showInfoMessage = ref(true);

const handleSubmit = async () => {
    errors.global = null;

    try {
        loading.value = true;
        props.register
            ? await store.dispatch('register', {
                  username: username.value,
                  email: email.value,
                  password: password.value,
                  passwordConfirm: passwordConfirm.value,
              })
            : await store.dispatch('login', { username: username.value, password: password.value });

        router.push('/');
    } catch (err) {
        const errorResponse = err.response;

        if (!Object.keys(errorResponse.data).length) return (errors.global = errorResponse.message);

        Object.keys(errorResponse.data).forEach((key) => (errors[key] = errorResponse.data[key].message));
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 25px;
    box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.11);
    border-radius: 5px;
    min-width: 400px;
    background-color: white;
}

.logo {
    max-width: 200px;
    margin-bottom: 10px;
}

h3 {
    font-weight: 700;
    font-size: 30px;
}

.single-input-wrapper {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.input-wrap {
    position: relative;
    width: 100%;
}

.login-button {
    background-color: black;
    color: white;
    outline: none;
    border: none;
    border-radius: 360px;
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.103);
    padding: 8px 24px;
    margin-top: 20px;
    cursor: pointer;
    transition: 0.2s;
}

.login-button:hover {
    background-color: rgb(255, 102, 0);
}

.register-button {
    color: rgb(255, 102, 0);
    transition: 0.2s;
    text-decoration: underline;
    text-decoration-color: transparent;
}

.register-button:hover {
    text-decoration-color: inherit;
}

.single-input-wrapper input {
    padding: 10px 20px;
    outline: none;
    border: none;
    border-radius: 4px;
    font-weight: 400;
    background-color: rgba(255, 102, 0, 0.144);
    width: 100%;
}

.single-input-wrapper input::placeholder {
    font-size: 14px;
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

.footer-action {
    text-align: center;
}

.login-info-message {
    background-color: rgb(255 0 0 / 27%);
    border-radius: 5px;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.212);
    margin-bottom: 20px;
    padding: 20px;
    position: relative;
}

.login-info-message p {
    font-weight: 500;
    font-size: 18px;
}

.login-info-message span {
    display: block;
}

.close-info-message {
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 10px;
}
</style>
