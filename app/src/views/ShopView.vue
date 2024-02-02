<script setup>
import CategoryNav from '@/components/CategoryNav.vue';
import ProductList from '@/components/ProductList.vue';
import { bestBuy, categories } from '@/bestBuy';
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function handleCategoryChange(index = 0) {
    router.push({name: 'shop', params: {categoryId: categories[index].id} });
    bestBuy.goToCategory(index);
}

onBeforeMount(async () => {
    let categoryIndex = categories.findIndex(x => x.id == router.currentRoute.value.params.categoryId);
    if (categoryIndex != -1) {
        handleCategoryChange(categoryIndex);
    }
    else
        handleCategoryChange();
})
</script>

<template>
    <main>
        <div class="shop">
            <CategoryNav @main-category-change="handleCategoryChange" :categories="categories" :main-category="bestBuy.mainCategory" />
            <transition mode="out-in">
                <ProductList />
            </transition>
        </div>
    </main>
</template>
