<template>
    <footer>
        <div class="footer-clip"></div>
        <div class="footer-content container">
            <div class="column logo">
                <img :src="SiteLogo" alt="" class="site-logo" />
                <!-- <span class="site-logo column-heading">Logoipsum</span> -->
                <span class="site-description"
                    >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ut elit rhoncus, lacinia mauris porttitor, tempus leo. Curabitur
                    in porta sem. Aliquam scelerisque, orci a aliquet feugiat, tortor neque posuere nibh, ac finibus neque dolor sed lectus.</span
                >
            </div>
            <div class="column">
                <span class="column-heading">Contact Us</span>
                <ul class="column-list">
                    <li><strong>Email</strong>: <a href="mailto:contact@example.com">contact@example.com</a></li>
                    <li><strong>Phone</strong>: <a href="tel:+1 234 567 8900">+1 234 567 8900</a></li>
                    <li><strong>Address</strong>: 1234 Street Name</li>
                </ul>
            </div>
            <div class="column">
                <span class="column-heading">Customer Service</span>
                <ul class="column-list">
                    <li><a href="#">FAQ</a></li>
                    <li><a href="#">Return Policy</a></li>
                    <li><a href="#">Shipping Information</a></li>
                </ul>
            </div>
            <div class="column">
                <NewsletterForm />
            </div>
        </div>
    </footer>
</template>

<script setup>
import NewsletterForm from './Forms/NewsletterForm.vue';
import SiteLogo from '../assets/logo.svg';
</script>

<style scoped>
footer {
    background-color: #222;
    color: rgba(255, 255, 255, 0.7);
    margin-top: 50px;
}

.footer-clip {
    min-height: 100px;
    background-color: white;
    clip-path: polygon(0 100%, 100% 0, 0 0, 0% 100%);
    margin-top: -0.2px;
}

.site-logo {
    max-width: 200px;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    background-color: #222;
}

.column {
    display: flex;
    flex-direction: column;
    padding: 20px;
}

.site-description {
    color: gray;
}

.column-heading {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
    color: white;
}

.column-list {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.site-logo {
    font-size: 40px;
    font-weight: 700;
    margin-bottom: 20px;
    line-height: 1em;
}

a {
    transition: 0.2s;
    text-decoration: underline;
    text-decoration-color: transparent;
}

a:hover {
    color: white;
    text-decoration-color: white;
}
</style>
