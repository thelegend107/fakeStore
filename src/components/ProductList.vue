<script setup>
import { onBeforeMount, ref, watch } from 'vue';
import { getProductsByCategory } from './BestBuyApi';
import Products from './Products.vue';
import ProductsNav from './ProductsNav.vue';
import LoadingSpinner from './LoadingSpinner.vue';
import debounce from 'lodash.debounce';

const pageSize = 10;
const currentPage = ref(1);
const totalPages = ref(1);

const props = defineProps({
    categoryId: String,
    searchTerm: String
})

const products = ref([]);
const loading = ref(true);

const getProducts = debounce(async (pageNumber=currentPage.value) => {
    loading.value = true;
    await getProductsByCategory(props.categoryId, pageNumber, pageSize.value, props.searchTerm)
        .then((data) => {
            products.value = data.products;
            totalPages.value = data.totalPages;
            currentPage.value = data.currentPage;
            loading.value = false
        });
}, 500);

// Handles product list navigation event
async function handlePageNavigation(num) {
    if (currentPage.value == totalPages.value && num > 0)
        currentPage.value = 1;
    else if (currentPage.value == 1 && num < 0)
        currentPage.value = totalPages.value;
    else if (num > 0)
        currentPage.value++;
    else {
        currentPage.value--;
    }
}

// Handles product list navigation input event
async function handlePageNavigationInput(input) {
    if (input >= totalPages.value)
        currentPage.value = 1;
    else if (input <= 1)
        currentPage.value = totalPages.value;
    else
        currentPage.value = input;
}

// Retrieves products on component render
onBeforeMount(async () => {
    await getProducts();
}),

// Refreshes products on page change
watch(currentPage, async () => {
    loading.value = true;
    await getProducts();
})
</script>
<template>
    <div class="pl-container">
        <ProductsNav
            @page-navigation="handlePageNavigation"
            @page-navigation-input="handlePageNavigationInput"
            :current-page="currentPage" 
            :total-pages="totalPages">
        </ProductsNav>

        <Products v-if="!loading" :products="products" />
        <loading-spinner v-else />

        <ProductsNav
            @page-navigation="handlePageNavigation"
            @page-navigation-input="handlePageNavigationInput"
            :current-page="currentPage" 
            :total-pages="totalPages">
        </ProductsNav>
    </div>
</template>

<style lang="scss" scoped>
.pl-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
}
</style>