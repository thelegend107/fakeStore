<script setup>
import { onBeforeMount, ref } from 'vue';
import { mdiCircle } from '@mdi/js';
import SvgIcon from '@jamescoyle/vue-icon';
import Products from './Products.vue';
import ProductsNav from './ProductsNav.vue';
import LoadingSpinner from './LoadingSpinner.vue';
import { bestBuy } from '@/bestBuy';
import { store } from '@/store';

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

function carouselPaginationActive(carouselIndex) {
    return carouselIndex == productIndex.value ? 'color: var(--primary)' : 'color: var(--primaryV)'
}

function handleCarouselPagination(index) {
    productIndex.value = index;
}

function handleAddToCart(product, quantity) {
    store.addToCart(product, quantity);
}

onBeforeMount(async () => {
    await bestBuy.getTopDeals(10).then((data) => {
        topDealProducts.value = data.products;
        loading.value = false;
    });
})
</script>

<template>
    <ProductsNav @carousel-navigation="handleCarouselNavigation" :carousel="true">
        <Products @add-to-cart="handleAddToCart" v-if="!loading" :products="topDealProducts" :product-index="productIndex" :carousel="true">
            <div class="carousel-pagination">
                <SvgIcon class="cp-circle" v-for="(p, index) in topDealProducts"
                    @click="handleCarouselPagination(index)"
                    :style="carouselPaginationActive(index)"
                    :key="p.sku" 
                    :type="'mdi'" 
                    :path="mdiCircle">
                </SvgIcon>
            </div>
        </Products>
        <LoadingSpinner v-else />
    </ProductsNav>
</template>

<style lang="scss" scoped>
.carousel-pagination {
    display: flex;
    justify-content: center;
    padding: 1rem 0rem;

    .cp-circle {
        border-radius: 100%;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .cp-circle:hover {
        background-color: var(--primary);
    }
}

@media (min-width: 1024px) and (min-height: 788px) {
    .carousel-pagination {
        padding: 0.5rem 0rem;
        gap: 1rem;
    }
}
</style>