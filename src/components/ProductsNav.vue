<script setup>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import { ref, watch} from 'vue';


const emit = defineEmits([
    'pageNavigation',
    'pageNavigationInput',
    'carouselNavigation'
])

const props = defineProps({
    currentPage: Number,
    totalPages: Number,
    carousel: {
        type: Boolean,
        default: false
    }
})

const currentPageInput = ref(props.currentPage)

watch(() => props.currentPage, (newPage)=> {
    currentPageInput.value = newPage
})
</script>

<template>
    <div v-if="!carousel" class="pl-nav-container">
        <button @click="emit('pageNavigation', -1)"><svg-icon type="mdi" :path="mdiChevronLeft" /></button>
        <div class="pl-nav-info">
            <input v-on:change="emit('pageNavigationInput', currentPageInput)" v-model="currentPageInput" type="number" />
            <p>/ {{ props.totalPages }}</p>
        </div>
        <button @click="emit('pageNavigation', 1)"><svg-icon type="mdi" :path="mdiChevronRight" /></button>
    </div>
    <div class="carousel" v-else>
        <button @click="emit('carouselNavigation', -1)">
            <SvgIcon type="mdi" :path="mdiChevronLeft" :size="35" />
        </button>
        <slot></slot>
        <button @click="emit('carouselNavigation', 1)">
            <SvgIcon type="mdi" :path="mdiChevronRight" :size="35" />
        </button>
    </div>
    
</template>

<style lang="scss" scoped>
.pl-nav-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
    background-color: var(--vt-c-black);
    border-radius: 15px;
    color: white;
    width: 100%;

    .pl-nav-info {
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

.carousel {
    display: flex;
    align-items: center;
    border-radius: 15px;
    background-color: var(--primaryDark);
    padding: 0.25rem;

    button {
        width: 2rem;
        height: 2rem;
        border-radius: 100%;
    }
}

@media (min-width: 1024px) and (min-height: 788px) {
    .carousel {
        padding: 1rem;

        button {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 100%;
        }
    }
}
</style>