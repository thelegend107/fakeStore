<script setup>
import { onMounted, ref, watch } from 'vue';
import { getProductsByCategory, getProductsForAllCategories } from './BestBuyApi';
import ListPagination from './ListPagination.vue';

const currentPage = ref(1);
const pageSize = ref(10);
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

    await getProductByCategoryPerPage();
}

onMounted(async () => {
    await getProductByCategoryPerPage();
})

watch(() => props.searchTerm, async () => {
    await getProductByCategoryPerPage();
})
</script>
<template>
    <div class="list-container">     
        <div class="products">
            <div class="product" v-for="p in products" :key="p.sku">
                <img :src="p.image" :alt="p.sku">
                <div class="product-info">
                    <p v-for="n in p.name.split(' - ').slice(0, 2)" :key="n[0]">{{ n }}</p>
                    <div class="salePrice">
                        <div v-if="p.onSale">
                            <strike style="color: lightcoral;">${{ p.regularPrice }}</strike>
                            <p style="color: lightgreen;">-%{{ p.percentSavings }}</p>
                        </div>
                        <b class="price">${{ p.salePrice }}</b>
                    </div>
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
    justify-content: space-between;
    gap: 1rem;

    .product {
        width: 200px;
        height: 400px;
        overflow: hidden;
        border-radius: 10px;
        background-color: var(--vt-c-black);
        display: flex;
        flex-direction: column;
        font-size: 12px;
        flex-grow: 1;

        img {
            height: 230px;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
        }

        .product-info {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 0.5rem 0.75rem 0.25rem 0.75rem;
        }

        .salePrice {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: white;
            .price {
                font-size: large;
            }
        }
    }
}
</style>