<script setup>
import CategoryList from '@/components/CategoryList.vue';
import { categories } from '@/components/BestBuyApi';
import { ref } from 'vue';

const mainCategory = ref(categories[0]);

function mainCategoryChange(categoryIndex) {
    mainCategory.value = categories[categoryIndex];
}
</script>

<template>
    <header>
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" />
        <nav>
            <p>Profile</p>
            <p>Login</p>
        </nav>
    </header>
    <CategoryList @main-category-change="mainCategoryChange" :categories="categories" :main-category="mainCategory" />
    <main>
        <router-view :main-category="mainCategory"></router-view>
    </main>
</template>