<script setup>
import ProductList from '@/components/ProductList.vue';
import { ref } from 'vue';


const categories = [
    { id: 'abcat0501000', name: 'Desktops & All-in-One Computers' },
    { id: 'abcat0502000', name: 'Laptops' },
    { id: 'abcat0101000', name: 'TVs' },
    { id: 'abcat0204000', name: 'Headphones' },
    { id: 'pcmcat241600050001', name: 'Home Audio' }
]

const mainCategory = ref(categories[0]);
</script>

<template>
    <div class="background-image"></div>
    <div class="home">
        <div class="categories">
            <h3 class="category" v-for="c in categories" :key="c.id"> {{ c.name }}</h3>
        </div>
        <Suspense>
            <ProductList :category-id="mainCategory.id" />
        </Suspense>
    </div>
</template>

<style lang="scss">
.home {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    gap: 2rem;
}

.categories {
    display: flex;
    justify-content: center;
    gap: 5rem;
}
</style>
