<template>
    <form @submit.prevent="userRegister">
        <img class="logo" :src="logo" alt="" />

        <h3>Register</h3>

        <div class="single-input-wrapper">
            <label for="email">Email</label>
            <input type="email" required maxlength="60" placeholder="Enter your email.." v-model.trim="email" />
        </div>

        <div class="single-input-wrapper">
            <label for="password">Password</label>
            <input type="text" required minlength="8" placeholder="Enter your password.." v-model.trim="password" />
        </div>

        <div class="single-input-wrapper">
            <label for="password">Repeat Password</label>
            <input type="text" required minlength="8" placeholder="Repeat password.." v-model.trim="passwordConfirm" />
        </div>

        <button type="submit" class="register-button">{{ loading ? 'Please wait..' : 'Register' }}</button>

        <span>Already have an account? <router-link to="/my-account/login" class="login-form-button">Login</router-link></span>
    </form>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import logo from '../../assets/logo.svg';

const store = useStore();

const loading = ref(false);

const email = ref('');
const password = ref('');
const passwordConfirm = ref('');

const userRegister = () => {
    try {
        store.dispatch('register', { email: email.value, password: password.value, passwordConfirm: passwordConfirm.value });
    } catch (error) {}
    console.log('login');
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

.register-button {
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

.register-button:hover {
    background-color: rgb(255, 102, 0);
}

.login-form-button {
    color: rgb(255, 102, 0);
    transition: 0.2s;
    text-decoration: underline;
    text-decoration-color: transparent;
}

.login-form-button:hover {
    text-decoration-color: inherit;
}

input {
    padding: 10px 20px;
    outline: none;
    border: none;
    border-radius: 4px;
    font-weight: 400;
    background-color: rgba(255, 102, 0, 0.144);
}

input::placeholder {
    font-size: 14px;
}

p {
    text-align: center;
    font-size: 20px;
    font-weight: 500;
    padding: 10px 0;
}

.footer-action {
    text-align: center;
}
</style>
