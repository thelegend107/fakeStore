<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { store } from './store';
import { mdiAccount, mdiCart } from '@mdi/js';
import svgIcon from '@jamescoyle/vue-icon';
import SearchBar from './components/SearchBar.vue';
import ShoppingCart from './components/ShoppingCart.vue';
const router = useRouter();
const shopViewSearchTerm = ref('');
const shopViewCategoryIndex = ref(null);
const shoppingCartShow = ref(false);
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
                <svg-icon class="header-action" type="mdi" :path="mdiAccount" />
                <div @click="shoppingCartShow = !shoppingCartShow" class="header-action flex-r ai-c">
                    <svg-icon type="mdi" :path="mdiCart" />
                    <span v-if="store.cart.length > 0" class='cartCount'>{{ store.getCartItemCount() }}</span>
                </div>
            </nav>
        </transition>
    </header>
    <ShoppingCart @close-shopping-cart="shoppingCartShow = false" :show="shoppingCartShow" />
    <router-view @go-to-category="goToCategory" :category-index="shopViewCategoryIndex" :search-term="shopViewSearchTerm" v-slot="{ Component }">
        <transition mode="out-in">
            <component :is="Component" />
        </transition>
    </router-view>
</template>

<style lang="scss" scoped>
.header-action {
    color: var(--primary);
    transition: all 0.3s ease;
    cursor: pointer;
}

.header-action:hover {
    opacity: 70%;
}

.cartCount {
    display: flex;
    align-items: center;
    cursor: pointer;
    background-color: darkred;
    color: white;
    border-radius: 100%;
    padding: 1px 4px 2px 6px;
    font-size: 10px;
    margin-left: -0.5rem;
    margin-bottom: 0.85rem;
    z-index: 1;
}
</style>