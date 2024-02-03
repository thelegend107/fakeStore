<script setup>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiCancel, mdiClose, mdiMagnify } from '@mdi/js';
import { ref } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router';

const searchToggle = ref(false);
const searchInput = ref("");

const emit = defineEmits(['searchRequest']);

function handleSearch(num) {
    searchToggle.value = !searchToggle.value;
    if (num === 0) {
        searchInput.value = "";
    }
    
    emit('searchRequest', searchInput.value, searchToggle.value);
};

function handleCancelSearch() {
    searchInput.value = "";
    emit('searchRequest', searchInput.value, searchToggle.value);
}

function handleSearchButton() {
    setTimeout(() => document.getElementById("searchInput").focus(), 0);
    if (searchToggle.value)
        handleSearch();
    else
        handleSearch(0);
}

const style = {
    backgroundColor: 'var(--primaryV)',
}

onBeforeRouteUpdate((to) => {
    if (to.name != 'shop') {
        handleCancelSearch();
    }
})
</script>
<template>
    <div class="searchBox" :style="searchToggle ? style : null">
        <transition name="slide-fade" mode="out-in">
            <div class="searchBar" v-if="searchToggle">
                <button name="search" @click="handleSearch(0)"><svg-icon type="mdi" :path="mdiClose" :size="25"></svg-icon></button>
                <input id="searchInput" @focusout="handleSearch" @keyup.esc="handleSearch(0)" @keyup.enter="handleSearch" v-model="searchInput" length="25" type="text" :placeholder="'enter search keywords...'" />
            </div>
        </transition>
        <transition name="slide-fade">
            <button name="search-cancel" @click="handleCancelSearch" v-if="!searchToggle && searchInput">
                <svg-icon type="mdi" :path="mdiCancel" :size="25"></svg-icon>
            </button>
        </transition>
        <button name="search-button" @click="handleSearchButton">
            <svg-icon type="mdi" :path="mdiMagnify" :size="25"></svg-icon>
            <transition name="slide-fade">
                <p v-if="!searchToggle">{{ searchInput ? '"' + searchInput + '"' : "Search" }}</p>
            </transition>
        </button>
    </div>
</template>
<style lang="scss" scoped>
.searchBox {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    flex-grow: 1;
    gap: 5px;

    .searchBar {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 15px;
        gap: 10px;
        flex-grow: 1;

        input {
            border: none;
            border-radius: 10px;
            color: white;
            background-color: inherit;
            width: 100%;
            height: 100%;
            outline: none;
            font-size: 16px;
            padding: 0;
        }
    }
}
</style>