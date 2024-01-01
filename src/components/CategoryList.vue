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
const categoryIndex = ref(0);
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
    <div class="categories">
        <h3 class="category" @click="emit('mainCategoryChange', index)" v-for="(c, index) in props.categories" :key="c.id"
            :class="{ categoryActive: c.id == props.mainCategory.id }">
            {{ c.name }}
        </h3>
    </div>
    <div class="categories-mobile">
        <button @click="handleCategoryNavigation(-1)">
            <SvgIcon type="mdi" :path="mdiChevronLeft" />
        </button>
        <h3 class="category" @click="emit('mainCategoryChange', categoryIndex)">{{ props.categories[categoryIndex].name }}
        </h3>
        <button @click="handleCategoryNavigation(1)">
            <SvgIcon type="mdi" :path="mdiChevronRight" />
        </button>
    </div>
</template>

<style lang="scss" scoped>
.categories {
    display: none;
}

.categories-mobile {
    display: flex;
    justify-content: space-between;
    text-align: center;
    align-items: center;
    color: white;
    padding-bottom: 0.5rem;

    .category {
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