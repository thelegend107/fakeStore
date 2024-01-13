<script setup>
import { bestBuy } from '@/bestBuy';
import Products from '@/components/Products.vue';
import ProductsNav from '@/components/ProductsNav.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { store } from '@/store';

function handlePageNavigation(num) {
    bestBuy.pageNavigation(num);
}

function handlePageNavigationInput(input) {
    bestBuy.pageNavigationInput(input);
}

function handleAddToCart(product, quantity) {
    store.addToCart(product, quantity);
}
</script>
<template>
    <div class="w-100">
        <ProductsNav @page-navigation="handlePageNavigation" @page-navigation-input="handlePageNavigationInput" :current-page="bestBuy.currentPage" :total-pages="bestBuy.totalPages">
            <Products v-if="!bestBuy.loading" @add-to-cart="handleAddToCart" :products="bestBuy.products" />
            <loading-spinner v-else />
        </ProductsNav>
    </div>
</template>