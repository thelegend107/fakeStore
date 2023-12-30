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
            <h3 @click="mainCategory = categories[index]" class="category" v-for="(c,index) in categories" :key="c.id" :class="{categoryActive: c.id==mainCategory.id}"> {{ c.name }}</h3>
        </div>
        <Suspense>
            <ProductList :key="mainCategory.id" :category-id="mainCategory.id" />
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
    width: 100%;
    background-color: var(--primary);
    border-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 4vw;
    min-width: 350px;

    .category {
        padding: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .category:hover {
        color: white;
        border-bottom: 2px solid white;        
    }
}

.categoryActive {
    color: white;
    border-bottom: 2px solid white;
}

</style>
