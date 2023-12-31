<script setup>
import CategoryList from '@/components/CategoryList.vue';
import { categories } from '@/components/BestBuyApi';
import { ref } from 'vue';
import SearchBar from './components/SearchBar.vue';

const searchTerm = ref(null);
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
        <SearchBar @search-request="handleSearchRequest" />
        <transition name="slide-fade">
            <nav v-if="navShow">
                <p>Profile</p>
                <p>Login</p>
            </nav>
        </transition>
    </header>
    <CategoryList @main-category-change="mainCategoryChange" :categories="categories" :main-category="mainCategory" />
    <main>
        <router-view :main-category="mainCategory" :search-term="searchTerm"></router-view>
    </main>
</template>