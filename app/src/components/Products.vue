<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { productDescription, productNameBrand } from '@/store';
import CustomerReview from './CustomerReview.vue';
import { mdiCartPlus, mdiMinus, mdiOpenInNew } from '@mdi/js';
import SvgIcon from '@jamescoyle/vue-icon';

const emit = defineEmits(['addToCart']);

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const percentage = new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })

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
        <div class="td-p" v-for="(p,i) in products" :key="p.sku" v-show="i == productIndex">
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
                <div class="flex-c" style="gap: 0.5rem;">
                    <div class="salePrice">
                        <div v-if="p.onSale">
                            <s style="color: lightcoral;">{{ currency.format(p.regularPrice) }}</s>
                            <p style="display: flex; align-items: center; color: lightgreen;">
                                <SvgIcon type="mdi" :path="mdiMinus" :size="11" />
                                {{ percentage.format(p.percentSavings/100) }}
                            </p>
                        </div>
                        <b class="price">{{ currency.format(p.salePrice) }}</b>
                    </div>
                    <div class="product-actions">
                        <button name="addToCart-button" @click="emit('addToCart', p)" :style="{width: '100%'}">
                            <SvgIcon type="mdi" :path="mdiCartPlus" />
                            <p>Add to Cart</p>
                        </button>
                        <button name="view-product-details-button" @click="$router.push({name:'product',params:{productId:p.sku}})" :style="{width: '100%'}">
                            <SvgIcon type="mdi" :path="mdiOpenInNew" />
                            <p>View Details</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <slot v-if="carousel">
        </slot>
    </div>

    <div v-else class="products">
        <div class="product bg-glass" v-for="p in products" :key="p.sku">
            <img :src="p.image" :alt="p.sku">
            <div class="product-info">
                <p>{{ productNameBrand(p.name) }}</p>
                <p>{{ productDescription(p.name) }}</p>
                <div class="flex-c" style="gap: 0.5rem;">
                    <div class="salePrice" :style="{justifyContent: p.onSale ? 'space-between' : 'end'}">
                        <div v-if="p.onSale">
                            <s style="color: lightcoral;">{{ currency.format(p.regularPrice) }}</s>
                            <p style="display: flex; align-items: center; color: lightgreen;"><SvgIcon type="mdi" :path="mdiMinus" :size="11" />{{ percentage.format(p.percentSavings/100) }}</p>
                        </div>
                        <b class="price">{{ currency.format(p.salePrice) }}</b>
                    </div>
                    <div class="product-actions">
                        <button name="addToCart-button" @click="emit('addToCart', p)" :style="{width: '100%'}">
                            <SvgIcon type="mdi" :path="mdiCartPlus" :size="16" />
                            <p>Add to Cart</p>
                        </button>
                        <button name="view-product-details-button" @click="$router.push({name:'product',params:{productId:p.sku}})" :style="{width: '100%'}">
                            <SvgIcon type="mdi" :path="mdiOpenInNew" :size="16" />
                            <p>View Details</p>
                        </button>
                    </div>
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
        flex-grow: 1;
        width: 300px;
        height: 330px;
        overflow: hidden;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        font-size: 12px;

        img {
            height: 175px;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
        }

        .product-info {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 0.5rem 0.75rem;
            flex-grow: 1;
        }

        .product-favorite {
            padding: 5px;
            display: flex;
            position: absolute;
            align-self: flex-end;
        }

        .product-actions {
            button {
                height: 1.75rem;
                font-size: 12px;
                display: flex;
            }
        }
    }
}

.td {
    display: flex;
    justify-content: center;
    flex-direction: column;
    flex-grow: 1;
    transition: all 0.3s ease;
    min-width: 0;
    min-height: 0;

    .td-p {
        display: flex;
        flex-direction: column;
        padding: 1rem 1rem 0rem 1rem;
        justify-content: center;
        gap: 1rem;

        img {
            border-radius: 15px;
            align-self: center;
            max-height: 190px;
            width: 100%;
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

            .product-actions {
                gap: 0.5rem;
                flex-direction: column;
                button {
                    height: 2rem;
                }
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
                .product-actions {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    gap: 0.75rem;
                    
                    button {
                        font-size: 15px;
                        display: flex;
                        gap: 0.5rem;
                        height: 3rem;
                    }
                }
            }

            img {
                display: flex;
                max-height: 100%;
                border-radius: 15px;
                height: 34vh;
                object-fit: contain;
            }
        }
    }
}
</style>