<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { mdiMinus } from '@mdi/js';
import SvgIcon from '@jamescoyle/vue-icon';
import CustomerReview from './CustomerReview.vue';

defineProps({
    products: Array,
    productIndex: {
        type: Number,
        default: 0
    },
    carousel: {
        type: Boolean,
        default: false
    }
})
</script>

<template>
    <div v-if="carousel" class="td">
        <div class="td-p" v-for="p in products.filter((x, index) => index == productIndex)" :key="p.sku">
            <img :src="p.image" :alt="p.sku">
            <div class="td-p-info">
                <div class="td-p-details">
                    <CustomerReview :average="p.customerReviewAverage" :count="p.customerReviewCount" />
                    <h3>{{ p.name }}</h3>
                    <div class="td-p-model-sku">
                        <p>Model: {{ p.modelNumber }}</p>
                        <p>SKU: {{ p.sku }}</p>
                    </div>
                </div>
                <div class="salePrice">
                    <div v-if="p.onSale">
                        <s style="color: lightcoral;">{{ p.regularPrice }}</s>
                        <p style="display: flex; align-items: center; color: lightgreen;">
                            <SvgIcon type="mdi" :path="mdiMinus" :size="11" />
                            {{ p.percentSavings }}
                        </p>
                    </div>
                    <b class="price">{{ p.salePrice }}</b>
                </div>
            </div>
        </div>
        <slot v-if="carousel">

        </slot>
    </div>

    <div v-else class="products">
        <div class="product" v-for="p in products" :key="p.sku">
            <img :src="p.image" :alt="p.sku">
            <div class="product-info">
                <p v-for="n in p.name.split(' - ').slice(0, 2)" :key="n[0]">{{ n }}</p>
                <div class="salePrice">
                    <div v-if="p.onSale">
                        <s style="color: lightcoral;">{{ p.regularPrice }}</s>
                        <p style="display: flex; align-items: center; color: lightgreen;"><SvgIcon type="mdi" :path="mdiMinus" :size="11" />{{ p.percentSavings }}</p>
                    </div>
                    <b class="price">{{ p.salePrice }}</b>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.products {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1rem;

    .product {
        width: 200px;
        height: 400px;
        overflow: hidden;
        border-radius: 10px;
        background-color: var(--vt-c-black);
        display: flex;
        flex-direction: column;
        font-size: 12px;
        flex-grow: 1;

        img {
            height: 230px;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
        }

        .product-info {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 0.5rem 0.75rem 0.25rem 0.75rem;
        }
    }
}

.td {
    display: flex;
    justify-content: center;
    flex-direction: column;
    flex-grow: 1;

    .td-p {
        display: flex;
        flex-direction: column;
        padding: 1rem 1rem 0rem 1rem;
        justify-content: center;
        gap: 1rem;

        img {
            flex-grow: 1;
            object-fit: contain;
            height: 145px;
        }

        .td-p-info {
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .td-p-details {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                color: rgba(255,255,255,0.75);
                h3 {
                    color: white;
                    font-weight: 700;
                }
            }

            .td-p-model-sku {
                display: flex;
                flex-direction: column;
            }

            .salePrice {
                margin-top: 1rem;
                padding: 0.25rem 0.5rem;
                border-radius: 15px;
                background-color: var(--primaryV);
            }
        }
    }
}

@media (min-width: 1024px) and (min-height: 788px) {
    .td {
        .td-p {
            padding: 1rem 2rem;
            display: grid;
            grid-template-columns: 50% 50%;
            justify-content: center;
            
            .td-p-info {
                flex-grow: 1;
                justify-content: space-between;
                .td-p-model-sku {
                    flex-direction: row;
                    justify-content: space-between;
                }
            }


            img {
                display: flex;
                width: 28vw;
                border-radius: 15px;
                height: 34vh;
                object-fit: contain;
            }
        }
    }
}
</style>