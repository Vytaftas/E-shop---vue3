<template>
    <div class="dashboard">
        <div class="sidebar">
            <nav>
                <router-link class="sidebar-link" to="manage-products">Products</router-link>

                <router-link class="sidebar-link" to="manage-categories">Categories</router-link>

                <router-link class="sidebar-link" to="manage-users">Users</router-link>

                <span class="sidebar-link">Atsijungti</span>
            </nav>
        </div>
        <div class="content">
            <router-view></router-view>
        </div>
    </div>
</template>

<style scoped>
.dashboard {
    display: grid;
    grid-template-columns: 200px 1fr;
    height: 100vh;
}
.sidebar {
    background-color: #1f5fab;
}

.sidebar nav {
    display: flex;
    flex-direction: column;
    color: white;
}

.sidebar .sidebar-link {
    padding: 20px 30px;
    transition: 0.2s;
    cursor: pointer;
}
.sidebar .sidebar-link:hover,
.router-link-exact-active {
    background-color: #1b66c2;
}

.content {
    overflow: auto;
}
</style>
