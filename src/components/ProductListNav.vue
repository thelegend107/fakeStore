<script setup>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import { ref, watch} from 'vue';


const emit = defineEmits([
    'handlePageNavigation',
    'handlePageNavigationInput'
])

const props = defineProps({
    currentPage: Number,
    totalPages: Number
})

const currentPageInput = ref(props.currentPage)

watch(() => props.currentPage, (newPage)=> {
    currentPageInput.value = newPage
})
</script>

<template>
    <div class="pl-pagination-container">
        <button @click="emit('handlePageNavigation', -1)"><svg-icon type="mdi" :path="mdiChevronLeft" /></button>
        <div class="pl-pagination-info">
            <input v-on:change="emit('handlePageNavigationInput', currentPageInput)" v-model="currentPageInput" type="number" />
            <p>/ {{ props.totalPages }}</p>
        </div>
        <button @click="emit('handlePageNavigation', 1)"><svg-icon type="mdi" :path="mdiChevronRight" /></button>
    </div>
</template>

<style lang="scss" scoped>
.pl-pagination-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
    background-color: var(--vt-c-black);
    border-radius: 15px;
    color: white;
    width: 100%;

    .pl-pagination-info {
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
</style>