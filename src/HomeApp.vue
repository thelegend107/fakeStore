<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SearchBar from './components/SearchBar.vue';

const router = useRouter();
const shopViewSearchTerm = ref('');
const shopViewCategoryIndex = ref(null);
const navShow = ref(true);

function handleSearchRequest(searchInput, searchToggle, categoryIndexReset) {
    shopViewSearchTerm.value = searchInput;
    navShow.value = !searchToggle;

    if (categoryIndexReset) {
        shopViewCategoryIndex.value = 0;
    }

    if (shopViewSearchTerm.value) {
        router.push({name: 'shop'});
    }
}

function goToCategory(index) {
    shopViewCategoryIndex.value = index;
    router.push({ name: 'shop'});
}
</script>

<template>
    <header>
        <img @click="router.push({name: 'home'})" alt="Vue logo" class="logo" src="@/assets/logo.svg" />
        <SearchBar @search-request="handleSearchRequest" />
        <transition name="slide-fade">
            <nav v-if="navShow">
                <p>Profile</p>
                <p>Login</p>
            </nav>
        </transition>
    </header>
    <router-view @go-to-category="goToCategory" :category-index="shopViewCategoryIndex" :search-term="shopViewSearchTerm" v-slot="{ Component }">
        <transition mode="out-in">
            <component :is="Component" />
        </transition>
    </router-view>
</template>