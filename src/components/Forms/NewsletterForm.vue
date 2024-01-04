<template>
    <div class="newsletter-block">
        <form @submit.prevent="subscribe">
            <h3>Newsletter</h3>
            <span>Discover modern brands for modern people.</span>

            <div class="single-input-wrapper">
                <input type="email" required maxlength="60" placeholder="Enter your email address.." v-model.trim="email" />
                <button type="submit" class="register-button">Subscribe</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const loading = ref(false);

const email = ref('');

const subscribe = () => {
    console.log(email.value);
};
</script>

<style scoped>
.newsletter-block {
    position: relative;
    display: flex;
}

form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

h3 {
    font-weight: 700;
    font-size: 24px;
    color: white;
}

.single-input-wrapper {
    display: flex;
    align-items: center;
}

.register-button {
    background-color: rgb(255, 102, 0);
    color: white;
    outline: none;
    border: none;
    border-radius: 0 4px 4px 0;
    padding: 10px 24px;
    cursor: pointer;
    transition: 0.2s;
}

.register-button:hover {
    background-color: black;
}

input {
    padding: 10px 20px;
    outline: none;
    border: none;
    border-radius: 4px 0 0 4px;
    font-weight: 400;
    background-color: white;
}

input::placeholder {
    font-size: 14px;
}
</style>
