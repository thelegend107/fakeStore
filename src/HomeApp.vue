<script setup>
import CategoryList from '@/components/CategoryList.vue';
import { categories } from '@/components/BestBuyApi';
import { ref } from 'vue';
import SearchBar from './components/SearchBar.vue';

const searchTerm = ref('');
const navShow = ref(true);
const mainCategory = ref(categories[0]);

function mainCategoryChange(categoryIndex) {
    mainCategory.value = categories[categoryIndex];
}

function handleSearchRequest(searchInput, searchToggle) {
    searchTerm.value = searchInput;
    navShow.value = !searchToggle;
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
    <div class="category-searchBar">
        <SearchBar @search-request="handleSearchRequest" />
        <CategoryList @main-category-change="mainCategoryChange" :categories="categories" :main-category="mainCategory" />
    </div>
    <main>
        <router-view :main-category="mainCategory" :search-term="searchTerm"></router-view>
    </main>
</template>

<style lang="scss">
.category-searchBar {
    padding: 0.5rem 1.5rem 0rem 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: var(--primaryV);
    gap: 0.5rem;
}
</style>