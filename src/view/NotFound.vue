<template>
    <div class="not-found">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Sorry, the page you are looking for does not exist.</p>
    </div>
</template>

<script setup></script>

<style scoped>
.not-found {
    min-height: 70vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

h1 {
    font-size: 100px;
    font-weight: 600;
    line-height: 1em;
}
h2 {
    font-size: 40px;
    font-weight: 500;
}
</style>
