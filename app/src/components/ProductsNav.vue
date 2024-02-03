<script setup>
import { vMaska } from 'maska';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';

const emit = defineEmits([
    'pageNavigation',
    'pageNavigationInput',
    'carouselNavigation'
])

const prop = defineProps({
    currentPage: Number,
    totalPages: Number,
    carousel: {
        type: Boolean,
        default: false
    }
})
</script>

<template>
    <div class="flex-c" v-if="!carousel" style="gap: 0.75rem;">
        <div class="pl-nav-container bg-glass">
            <button aria-label="page-right-navigation" @click="emit('pageNavigation', -1)"><svg-icon type="mdi" :path="mdiChevronLeft" /></button>
            <div class="pl-nav-info bg-glass">
                <input inputmode="numeric" v-maska data-maska="NNN" data-maska-tokens="N:[0-9]" v-on:change="emit('pageNavigationInput', $event.target.value)" :value="currentPage" type="number" />
                <p>/ {{ prop.totalPages }}</p>
            </div>
            <button aria-label="page-left-navigation" @click="emit('pageNavigation', 1)"><svg-icon type="mdi" :path="mdiChevronRight" /></button>
        </div>
        <slot></slot>
        <div class="pl-nav-container bg-glass">
            <button aria-label="page-right-navigation" @click="emit('pageNavigation', -1)"><svg-icon type="mdi" :path="mdiChevronLeft" /></button>
            <div class="pl-nav-info bg-glass">
                <input inputmode="numeric" v-maska data-maska="NNN" data-maska-tokens="N:[0-9]" v-on:change="emit('pageNavigationInput', $event.target.value)" :value="currentPage" type="number" />
                <p>/ {{ prop.totalPages }}</p>
            </div>
            <button aria-label="page-left-navigation" @click="emit('pageNavigation', 1)"><svg-icon type="mdi" :path="mdiChevronRight" /></button>
        </div>
    </div>
    <div class="carousel" v-else>
        <button aria-label="carousel-left-navigation" @click="emit('carouselNavigation', -1)">
            <SvgIcon class="icon" type="mdi" :path="mdiChevronLeft" :size="35" />
        </button>
        <slot></slot>
        <button aria-label="carousel-right-navigation" @click="emit('carouselNavigation', 1)">
            <SvgIcon class="icon" type="mdi" :path="mdiChevronRight" :size="35" />
        </button>
    </div>
</template>

<style lang="scss" scoped>
.pl-nav-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
    border-radius: 15px;
    color: white;
    width: 100%;

    .pl-nav-info {
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0rem 2rem;
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
        padding: 0;
    }

    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    input[type=number] {
        appearance: textfield;
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