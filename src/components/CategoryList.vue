<script setup>
const props = defineProps({
    mainCategory: Object,
    categories: Array
})

const emit = defineEmits(['mainCategoryChange'])
</script>

<template>
    <div class="categories">
        <h3 class="category" @click="emit('mainCategoryChange', index)" v-for="(c, index) in props.categories" :key="c.id" :class="{ categoryActive: c.id == props.mainCategory.id }">
            {{ c.name }}
        </h3>
    </div>
</template>

<style lang="scss" scoped>
.categories {
    width: 100%;
    background-color: var(--primary);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 3vw;

    .category {
        padding: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .category:hover {
        color: white;
        border-bottom: 2px solid white;
    }
}

.categoryActive {
    color: white;
    border-bottom: 2px solid white;
}
</style>