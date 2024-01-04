<script setup>
import { onBeforeMount, ref } from 'vue';
import { getTopDealProducts } from './BestBuyApi';
import Products from './Products.vue';
import ProductsNav from './ProductsNav.vue';
import LoadingSpinner from './LoadingSpinner.vue';

const productIndex = ref(0);
const topDealProducts = ref([]);
const loading = ref(true);

function handleCarouselNavigation(num) {
    if (productIndex.value == topDealProducts.value.length - 1 && num > 0)
        productIndex.value = 0;
    else if (productIndex.value == 0 && num < 0)
        productIndex.value = topDealProducts.value.length - 1;
    else if (num > 0)
        productIndex.value++;
    else
        productIndex.value--;
}

onBeforeMount(async () => {
    await getTopDealProducts(10).then((data) => {
        topDealProducts.value = data.products;
        loading.value = false;
    });
})
</script>

<template>
    <div class="carousel">
        <ProductsNav @carousel-navigation="handleCarouselNavigation" :carousel="true" :carousel-direction="-1" />

        <Products v-if="!loading" :products="topDealProducts" :product-index="productIndex" :carousel="true" />
        <LoadingSpinner v-else />

        <ProductsNav @carousel-navigation="handleCarouselNavigation" :carousel="true" :carousel-direction="1" />
    </div>
</template>

<style lang="scss" scoped>
.carousel {
    display: flex;
    align-items: center;
    border-radius: 15px;
    background-color: var(--primaryDark);
    padding: 0.25rem;

    button {
        width: 2rem;
        height: 2rem;
        border-radius: 100%;
    }
}

@media (min-width: 1024px) and (min-height: 788px) {
    .carousel {
        padding: 1rem;

        button {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 100%;
        }
    }
}
</style>