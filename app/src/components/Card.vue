<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
const prop = defineProps({
    centered: Boolean,
    fullHeight: Boolean,
})

const mainCardStyle = { 
    height: prop.centered || prop.fullHeight ? '80vh' : '100%', 
    flexWrap: 'wrap', 
    marginTop: '2.5rem' 
};
</script>
<template>
    <div class="flex-r ai-c jc-c" :style="mainCardStyle">
        <div class="bg-glass slot-container flex-c w-100" :class="prop.fullHeight ? 'h-100' : null" :style="{maxWidth: prop.centered ? '700px' : '100%'}">
            <slot></slot>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.slot-container {
    background-color: rgba(255, 255, 255, 0.08);
    box-shadow: var(--box-shadow-1);
    gap: 1rem; 
    border-radius: 15px; 
    padding: 2rem;
}
</style>