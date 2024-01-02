<script setup>
import { ref } from 'vue';
import CategoryNav from '@/components/CategoryNav.vue';
import { categories } from '@/components/BestBuyApi';
import ProductList from '@/components/ProductList.vue';

const mainCategory = ref(categories[0]);

function mainCategoryChange(categoryIndex) {
    mainCategory.value = categories[categoryIndex];
}

const props = defineProps({
    searchTerm: String,
    categoryIndex: Number
})

if (props.categoryIndex) {
    mainCategoryChange(props.categoryIndex);
}
</script>

<template>
    <main>
        <div class="shop">
            <CategoryNav @main-category-change="mainCategoryChange" :categories="categories" :main-category="mainCategory" />
            <transition mode="out-in">
                    <ProductList :key="mainCategory.id + searchTerm" :category-id="mainCategory.id" :search-term="searchTerm" />
            </transition>
        </div>
    </main>
</template>

<style lang="scss" scoped>
.shop {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1rem;
}
</style>
