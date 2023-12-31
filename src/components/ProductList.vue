<script setup>
import { onMounted, ref, watch } from 'vue';
import { getProductsByCategory, getProductsForAllCategories } from './BestBuyApi';
import ListPagination from './ListPagination.vue';

const currentPage = ref(1);
const pageSize = ref(12);
const totalPages = ref(1);
const props = defineProps({
    categoryId: String,
    searchTerm: String
})

const products = ref([]);

async function getProductByCategoryPerPage(arg=currentPage.value) {
    if (arg < 1)
        arg = totalPages.value;
    else if (arg > totalPages.value)
        arg = 1;

    if (props.categoryId == 'all') {
        await getProductsForAllCategories(arg, pageSize.value, props.searchTerm)
            .then((data) => {
                products.value = data.products;
                totalPages.value = data.totalPages;
                currentPage.value = data.currentPage;
            });
    }
    else {
        await getProductsByCategory(props.categoryId, arg, pageSize.value, props.searchTerm)
            .then((data) => {
                products.value = data.products;
                totalPages.value = data.totalPages;
                currentPage.value = data.currentPage;
            });
    }
}

function handlePageNavigation(num) {
    if (currentPage.value == totalPages.value && num > 0)
        currentPage.value = 1;
    else if (currentPage.value == 1 && num < 0)
        currentPage.value = totalPages.value;
    else if (num > 0)
        currentPage.value++;
    else {
        currentPage.value--;
    }

    getProductByCategoryPerPage();
}

onMounted(() => {
    getProductByCategoryPerPage();
})

watch(() => props.searchTerm, () => {
    getProductByCategoryPerPage();
})
</script>
<template>
    <div class="list-container">
        <list-pagination 
            @handle-page-navigation="handlePageNavigation"
            @handle-page-navigation-input="getProductByCategoryPerPage"
            :current-page="currentPage" 
            :total-pages="totalPages"
        >
        </list-pagination>
        
        <div class="products">
            <div class="product" v-for="p in products" :key="p.sku">
                <img :src="p.image" :alt="p.sku">
                <div class="product-info">
                    <p v-for="n in p.name.split(' - ').slice(0, 2)" :key="n[0]">{{ n }}</p>
                </div>
            </div>
        </div>

        <list-pagination 
            @handle-page-navigation="handlePageNavigation"
            @handle-page-navigation-input="getProductByCategoryPerPage"
            :current-page="currentPage" 
            :total-pages="totalPages"
        >
        </list-pagination>
    </div>
</template>

<style lang="scss" scoped>
.list-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
}

.products {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;

    .product {
        width: 250px;
        border-radius: 10px;
        background-color: var(--vt-c-black);
        display: flex;
        flex-direction: column;
        flex-grow: 1;

        img {
            height: 250px;
            width: 100%;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
        }

        .product-info {
            padding: 1rem;
        }
    }
}
</style>