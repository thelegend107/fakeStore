<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiClose } from '@mdi/js';

defineProps({
    title: String
})
</script>
<template>
    <div class="overlay flex-r ai-c jc-c" style="flex-wrap: wrap;">
        <div class="modal flex-c jc-c w-100" style="gap: 1rem; flex-wrap: wrap;">
            <div class="modal-header flex-r ai-c jc-sb">
                <h2>{{ title }}</h2>
                <svg-icon class="modal-close" @click="$emit('close-modal')" type="mdi" :path="mdiClose" />
            </div>
            <slot name="body"></slot>
            <slot name="footer"></slot>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.modal {
    box-shadow: var(--box-shadow-1);
    max-width: 700px;
    border-radius: 15px;
    background-color: rgba($color: white, $alpha: 0.1);
    backdrop-filter: blur(25px);
    padding: 2rem;
}

.modal-header {
    color: white;
}

.modal-close {
    transition: all 0.3s ease;
    cursor: pointer;
}
.modal-close:hover {
    opacity: 70%;
}
</style>