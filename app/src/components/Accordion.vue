<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiMinus, mdiPlus } from '@mdi/js';
import { ref } from 'vue';

defineProps({
    title: {
        type: String,
        default: 'Section'
    }
})
const showAccordionContent = ref(false);
const iconPath = ref(mdiPlus);

function onAccordionClick() {
    showAccordionContent.value = !showAccordionContent.value

    if (showAccordionContent.value)
        iconPath.value = mdiMinus;
    else
        iconPath.value = mdiPlus;
}
</script>
<template>
    <div>
        <button name="accordion-button" :class="{active: !showAccordionContent}"  @click="onAccordionClick" class="accordion w-100">
            <h3>{{ title }}</h3>
            <svg-icon type="mdi" :path="iconPath" />
        </button>
        <Transition>
            <div class="panel" v-show="showAccordionContent">
                <slot></slot>
            </div>
        </Transition>
    </div>
</template>
<style lang="scss" scoped>
button {
    color: white;
    background-color: rgba($color: #ffffff, $alpha: 0.08);
    justify-content: space-between;
    padding: 0.5rem 1rem;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

.active {
    border-radius: 15px;
}

.panel {
    padding: 0.5rem 1rem;
    background-color: rgba($color: #ffffff, $alpha: 0.05);
    border-radius: 15px;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
}
</style>