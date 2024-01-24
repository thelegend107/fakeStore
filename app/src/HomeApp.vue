<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { mdiCart, mdiLoginVariant } from '@mdi/js';
import svgIcon from '@jamescoyle/vue-icon';
import SearchBar from '@/components/SearchBar.vue';
import ShoppingCart from '@/components/ShoppingCart.vue';
import HeaderAccount from './components/HeaderAccount.vue';
import { bestBuy } from '@/bestBuy';
import { store } from '@/store';

const route = useRoute();
const router = useRouter();
const shoppingCartShow = ref(false);
const navShow = ref(true);

function handleSearchRequest(searchTerm, searchToggle) {
    navShow.value = !searchToggle;
    if (searchTerm)
        router.push({name: 'shop'});

    if (searchTerm != bestBuy.searchTerm)
        bestBuy.searchRequest(searchTerm);
}
</script>

<template>
    <header>
        <img @click="router.push({name: 'home'})" alt="Vue logo" class="logo" src="@/assets/logo.svg" />
        <SearchBar @search-request="handleSearchRequest" />
        <transition name="slide-fade">
            <nav v-if="navShow">
                <HeaderAccount v-if="store.session" @click="if (!route.path.includes('account')) router.push({name: 'account'});" />
                <svg-icon v-else @click="router.push({name: 'login'})" class="header-action" type="mdi" :path="mdiLoginVariant" />
                <div @click="shoppingCartShow = !shoppingCartShow" class="header-action flex-r ai-c">
                    <svg-icon type="mdi" :path="mdiCart" />
                    <span v-if="store.cart.length > 0" class='cartCount'>{{ store.getCartItemCount() }}</span>
                </div>
            </nav>
        </transition>
    </header>
    <ShoppingCart @close-shopping-cart="shoppingCartShow = false" :show="shoppingCartShow" />
    <router-view v-slot="{ Component }">
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