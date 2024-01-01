<script setup>
import ProductList from '@/components/ProductList.vue';

defineProps({
    mainCategory: Object,
    searchTerm: String
})
</script>

<template>
    <div class="background-image"></div>
    <div class="home">
        <transition mode="out-in">
            <Suspense>
                <template #default>
                    <ProductList :key="mainCategory.id+searchTerm" :category-id="mainCategory.id" :search-term="searchTerm" />
                </template>
            </Suspense>
        </transition>
    </div>
</template>

<style lang="scss">
.home {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    gap: 2rem;
}
</style>
