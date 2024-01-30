<template>
    <div class="paths">
        <div class="single-path-wrap" v-for="(path, index) of linkPaths" :key="path.link">
            <router-link v-if="index !== linkPaths.length - 1 && path.link" class="single-path link" :to="path.link">{{
                path.name.charAt(0).toUpperCase() + path.name.slice(1)
            }}</router-link>
            <span v-else class="single-path">{{ path.name.charAt(0).toUpperCase() + path.name.slice(1) }}</span>
            <i v-if="index !== linkPaths.length - 1" class="fa-solid fa-angles-right chevron-icon"></i>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const props = defineProps({ productName: { default: null } });

const linkPaths = computed(() => {
    let pathArray = route.path.split('/');
    pathArray[0] = 'Home';

    const isProduct = pathArray.find((item) => item.toLowerCase() === 'product');

    if (isProduct) {
        const index = pathArray.indexOf(isProduct);
        pathArray[index] = 'product';
        if (props.productName) pathArray[index + 1] = props.productName;
    }

    const paths = pathArray.map((item) => {
        const name = item;
        let link = '';

        if (item.toLowerCase() === 'home') {
            link = '/';
        } else if (item.toLowerCase() === 'categories') {
            link = '/shop/' + item.toLowerCase();
        } else if (item.toLowerCase() === 'product') {
            link = false;
        } else {
            link = '/' + item.toLowerCase();
        }

        return { name, link };
    });
    return paths;
});
</script>

<style scoped>
.paths {
    display: flex;
    align-items: center;
    line-height: 1em;
}

.chevron-icon {
    font-size: 10px;
    padding: 0 10px;
}
</style>
