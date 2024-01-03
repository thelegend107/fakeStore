<script setup>
import { ref } from 'vue';
import { mdiCircle, mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import { getTopDealProducts } from './BestBuyApi';
import SvgIcon from '@jamescoyle/vue-icon';

const itemIndex = ref(0);
const topDealProducts = ref([]);

await getTopDealProducts(10).then((data) => {
    topDealProducts.value = data.products;
});

function handeCarouselNavigation(num) {
    if (itemIndex.value == topDealProducts.value.length - 1 && num > 0)
        itemIndex.value = 0;
    else if (itemIndex.value == 0 && num < 0)
        itemIndex.value = topDealProducts.value.length - 1;
    else if (num > 0)
        itemIndex.value++;
    else
        itemIndex.value--;
}
</script>
<template>
    <div class="carousel">
        <button @click="handeCarouselNavigation(-1)">
            <SvgIcon class="left" type="mdi" :path="mdiChevronLeft" :size="35" />
        </button>
        <div class="td">
            <div class="td-p" v-for="p in topDealProducts.filter((x, index) => index == itemIndex)" :key="p.sku">
                <img :src="p.image" :alt="p.sku">
                <div class="td-p-info">
                    <p>{{ p.name }}</p>
                    <div class="salePrice">
                        <div v-if="p.onSale">
                            <s style="color: lightcoral;">${{ p.regularPrice }}</s>
                            <p style="color: lightgreen;">-%{{ p.percentSavings }}</p>
                        </div>
                        <b class="price">$ {{ p.salePrice }}</b>
                    </div>
                </div>
            </div>
            <div class="carousel-pagination">
                <SvgIcon class="cp-circle"
                    :style="itemIndex == index ? 'color: var(--primary)' : 'color: var(--primaryV)'"
                    v-for="(p, index) in topDealProducts" :key="p.sku" type="mdi" :path="mdiCircle" 
                />
            </div>
        </div>
        <button @click="handeCarouselNavigation(1)">
            <SvgIcon class="right" type="mdi" :path="mdiChevronRight" :size="35" />
        </button>
    </div>
</template>
<style lang="scss" scoped>
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

    .td {
        display: flex;
        justify-content: center;
        flex-direction: column;
        flex-grow: 1;

        .td-p {
            display: flex;
            flex-direction: column;
            padding: 0.75rem;
            justify-content: center;

            img {
                object-fit: contain;
                height: 150px;
                width: auto;
            }

            .td-p-info {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }

            .salePrice {
                padding: 0.25rem 0.5rem;
                border-radius: 15px;
                background-color: var(--primaryV);
            }
        }

        .carousel-pagination {
            display: flex;
            justify-content: center;

            .cp-circle {
                border-radius: 100%;
                box-shadow: var(--box-shadow-1);
            }
        }
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
        .td {
            .td-p {
                padding: 1rem;
                display: grid;
                grid-template-columns: 50% 50%;
                justify-content: center;

                img {
                    display: flex;
                    width: 28vw;
                    border-radius: 15px;
                    height: 34vh;
                    object-fit: contain;
                }
            }

            .carousel-pagination {
                gap: 1rem;
            }
        }
    }
}
</style>