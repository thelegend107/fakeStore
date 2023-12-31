<script setup>
import ProductList from '@/components/ProductList.vue';

defineProps({
    mainCategory: Object
})
</script>

<template>
    <div class="background-image"></div>
    <div class="home">
        <Suspense>
            <ProductList :key="mainCategory.id" :category-id="mainCategory.id" />
        </Suspense>
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
