<script setup>
import { ref, onBeforeMount } from 'vue';
import CategoryNav from '@/components/CategoryNav.vue';
import { categories } from '@/components/BestBuyApi';
import ProductList from '@/components/ProductList.vue';

const mainCategory = ref({});

const props = defineProps({
    searchTerm: String,
    categoryIndex: Number
})

function handleMainCategoryChange(categoryIndex) {
    mainCategory.value = categories[categoryIndex];
}

// Before Rendering:
// - If the parent component supplies a category index, push it through to the product list
// - else default to the 'all' category
onBeforeMount(() => {
    if (props.categoryIndex) {
        handleMainCategoryChange(props.categoryIndex);
    }
    else {
        mainCategory.value = categories[0];
    }  
})
</script>

<template>
    <main>
        <div class="shop">
            <CategoryNav @main-category-change="handleMainCategoryChange" :categories="categories" :main-category="mainCategory" />
            <transition mode="out-in">
                <Suspense>
                    <ProductList :key="mainCategory.id + searchTerm" :category-id="mainCategory.id" :search-term="searchTerm" />
                </Suspense>
            </transition>
        </div>
    </main>
</template>
