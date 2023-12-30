<script setup>
import { onMounted, ref } from 'vue';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import { getProductsByCategory } from './BestBuyApi';

const currentPage = ref(1);
const pageSize = ref(12);
const totalPages = ref(1);
const props = defineProps({
    categoryId: String
})

const products = ref([]);

async function getProductByCategoryPerPage(){
    await getProductsByCategory(props.categoryId, currentPage.value, pageSize.value)
    .then((data) => {
        products.value = data.products;
        currentPage.value = data.currentPage;
        totalPages.value = data.totalPages;
    });
}

function handlePageNavigation(num) {
    if (currentPage.value == totalPages.value && num > 0)
        currentPage.value = 1;
    else if (currentPage.value == 1 && num < 0)
        currentPage.value = totalPages.value;
    else if (num > 0)
        currentPage.value++;
    else{
        currentPage.value--;
    }
    
    getProductByCategoryPerPage();
}

onMounted(() => {
    getProductByCategoryPerPage();
})
</script>
<template>
    <div class="list-footer">
        <button @click="handlePageNavigation(-1)"><svg-icon type="mdi" :path="mdiChevronLeft" /></button>
        <div class="footer-pagination">
            <input v-on:change="getProductByCategoryPerPage" :min=1 :max="totalPages" v-model="currentPage" type="number" /> 
            <p>/ {{ totalPages }}</p>
        </div>
        <button @click="handlePageNavigation(1)"><svg-icon type="mdi" :path="mdiChevronRight" /></button>
    </div>
    <div class="products">
        <div class="product" v-for="p in products" :key="p.sku">
            <img :src="p.image" :alt="p.sku">
            <div class="product-info">
                <p v-for="n in p.name.split(' - ')" :key="n[0]">{{ n }}</p>
            </div>
        </div>
    </div>
    <div class="list-footer">
        <button @click="handlePageNavigation(-1)"><svg-icon type="mdi" :path="mdiChevronLeft" /></button>
        <div class="footer-pagination">
            <input v-on:change="getProductByCategoryPerPage" :min=1 :max="totalPages" v-model="currentPage" type="number" /> 
            <p>/ {{ totalPages }}</p>
        </div>
        <button @click="handlePageNavigation(1)"><svg-icon type="mdi" :path="mdiChevronRight" /></button>
    </div>
</template>

<style lang="scss" scoped>
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

.list-footer {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
    background-color: var(--vt-c-black);
    border-radius: 15px;

    .footer-pagination {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    input {
        appearance: none;
        font: inherit;
        background-color: inherit;
        display: flex;
        text-align: center;
        border: none;
        outline: none;
        color: white;
        width: 3em;
        border-radius: 15px;
    }

    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    input[type=number] {
        -moz-appearance: textfield;
    }
}
</style>