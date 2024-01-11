<script setup>
import svgIcon from '@jamescoyle/vue-icon';
import { mdiStar, mdiStarHalfFull, mdiStarOutline } from '@mdi/js';
import { onBeforeMount, ref } from 'vue';

const props = defineProps({
    count: {
        type: Number,
        default: 0
    },
    average: {
        type: Number,
        default: 0
    }
})

const iconPathArray = ref([])

onBeforeMount(() => {
    let average = props.average ? Math.floor(props.average) : 0;
    let averageDecimal = (props.average % 1).toFixed(2);

    for (let index = 0; index < 5; index++) {
        if (index < average)
            iconPathArray.value.push(mdiStar);
        else if (averageDecimal > 0 && !iconPathArray.value.includes(mdiStarHalfFull))
            iconPathArray.value.push(mdiStarHalfFull);
        else
            iconPathArray.value.push(mdiStarOutline);
    }
})
</script>

<template>
    <div class="customerReview">
        <div class="stars">
            <svg-icon v-for="path in iconPathArray" :key="path" 
                type="mdi" 
                :path="path" 
                :size="20"
                style="color: gold;"
            />
        </div>
        <p>({{ props.count ? props.count : 0 }})</p>
    </div>
</template>

<style lang="scss">
.customerReview {
    display: flex;
    font-size: 15px;
    gap: 5px;

    .stars {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
