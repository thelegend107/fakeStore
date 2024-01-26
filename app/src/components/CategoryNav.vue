<script setup>
import { ref } from 'vue';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';

const props = defineProps({
    mainCategory: Object,
    categories: Array
})

const emit = defineEmits(['mainCategoryChange'])

// Mobile version of categories
const categoryIndex = ref(
    props.categories.findIndex(x => x.id === props.mainCategory.id) >= 0 ? 
    props.categories.findIndex(x => x.id === props.mainCategory.id) : 
    0
);

const categorySize = props.categories.length;
function handleCategoryNavigation(num) {
    if (categoryIndex.value == 0 && num < 0)
        categoryIndex.value = categorySize - 1;
    else if (categoryIndex.value == categorySize - 1 && num > 0)
        categoryIndex.value = 0;
    else if (num < 0)
        categoryIndex.value--;
    else
        categoryIndex.value++;

    emit('mainCategoryChange', categoryIndex.value);
}
</script>

<template>
    <div class="categories bg-glass">
        <h3 class="category" @click="emit('mainCategoryChange', index)" v-for="(c, index) in props.categories" :key="c.id" :class="{ categoryActive: c.id == props.mainCategory.id }">
            <p>{{ c.name }}</p>
        </h3>
    </div>
    <div class="categories-mobile bg-glass">
        <button @click="handleCategoryNavigation(-1)">
            <svg-icon type="mdi" :path="mdiChevronLeft" />
        </button>
        <h3 class="category" @click="emit('mainCategoryChange', categoryIndex)">
            {{ props.categories[categoryIndex].name }}
        </h3>
        <button @click="handleCategoryNavigation(1)">
            <svg-icon type="mdi" :path="mdiChevronRight" />
        </button>
    </div>
</template>

<style lang="scss" scoped>
.categories {
    display: none;
}

.categories-mobile {
    width: 100%;
    border-radius: 15px;
    background-color: var(--primaryV);
    display: flex;
    justify-content: space-between;
    text-align: center;
    align-items: center;
    color: white;
    padding: 0.5rem;

    .category {
        align-items: center;
        display: flex;
        justify-content: center;
        flex-direction: column;
        transition: all 0.3s ease;
    }
}

.categoryActive {
    color: white;
    border-bottom: 2px solid white;
}

@media (min-width: 1024px) and (min-height: 788px) {
    .categories-mobile {
        display: none;
    }

    .categories {
        width: 100%;
        border-radius: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2.5vw;

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
}</style>