<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
const prop = defineProps({
    centered: Boolean,
    fullHeight: Boolean,
})
</script>
<template>
    <div class="card flex-r ai-c jc-c" style="flex-wrap: wrap; margin-top: 2.5rem;">
        <div class="card-slot flex-c w-100" :class="{'h-100': fullHeight}"  :style="{maxWidth: prop.centered ? '700px' : '100%' }">
            <slot></slot>
        </div>
    </div>
</template>