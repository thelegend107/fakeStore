<script setup>
import { bestBuy } from '@/bestBuy';
import Card from '@/components/Card.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ProductDetails from '@/components/ProductDetails.vue';
import Product from '@/models/Product';
import { store } from '@/store';
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const product = ref();

function handleAddToCart(product, quantity) {
    store.addToCart(product, quantity);
}

onBeforeMount(async () => {
    if (route.params.productId)
        product.value = new Product(await bestBuy.getProduct(route.params.productId));
})
</script>
<template>
    <main style="max-width: 1450px; margin-top: -2rem;">
        <card style="min-height: 80vh; height: 100%;">
            <transition mode="out-in">
                <product-details @add-to-cart="handleAddToCart" v-if="product" :product="product"></product-details>
                <loading-spinner v-else></loading-spinner>
            </transition>
        </card>
    </main>
</template>
<style lang="scss" scoped>
</style>