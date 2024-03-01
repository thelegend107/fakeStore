<script setup>
import Product from '@/models/Product'
import CustomerReview from '@/components/CustomerReview.vue';
import Accordion from '@/components/Accordion.vue';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiCartPlus, mdiMinus } from '@mdi/js';
import { decode } from 'he';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const percentage = new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })

defineEmits(['addToCart']);
defineProps({
    product: Product
})
</script>
<template>
    <div v-if="product.sku" class="product-details flex-r h-100" style="gap: 2rem;">
        <div class="grid-column flex-c" style="gap: 0.5rem;">
            <img :src="product.image" :alt="product.sku" style="border-radius: 15px; border: 2px solid inherit;">
            <accordion title="Features">
                <p style="font-size: 14px;">{{ decode(product.longDescription) }}</p>
            </accordion>
            <accordion title="Included Items" v-if="product.includedItemList.length > 0">
                <ul style="font-size: 14px;" v-for="i in product.includedItemList" :key="i.includedItem">
                    <li>{{ i.includedItem }}</li>
                </ul>
            </accordion>
        </div>
        <hr class="hide" style="color: rgba(255, 255, 255, 0.08);">
        <div class="grid-column flex-c" style="gap: 1rem;">
            <div class="product-header">
                <customer-review :average="product.customerReviewAverage" :count="product.customerReviewCount" />
                <h3 style="color: white;">{{ product.name }}</h3>
                <div class="flex-r jc-sb" style="font-size: 15px;">
                    <p>Model: {{ product.modelNumber }}</p>
                    <p>SKU: {{ product.sku }}</p>
                </div>
            </div>
            <div class="product-info">
                <p>Condition: {{ product.condition }}</p>
                <p>Color: {{ product.color }}</p>
                <p>Weight: {{ product.shippingWeight }} lbs</p>
                <p>Warranty: {{ product.warrantyLabor }}</p>
            </div>
            <div class="flex-c" style="gap: 0.5rem;margin-top: auto;">
                <div class="salePrice bg-glass-rounded" :style="{ justifyContent: product.onSale ? 'space-between' : 'center' }" style="margin-top: auto;">
                    <div v-if="product.onSale">
                        <s style="color: lightcoral;">{{ currency.format(product.regularPrice) }}</s>
                        <p style="display: flex; align-items: center; color: lightgreen;"><svg-icon type="mdi" :path="mdiMinus" :size="11" />{{ percentage.format(product.percentSavings / 100) }}</p>
                    </div>
                    <b class="price">{{ currency.format(product.salePrice) }}</b>
                </div>
                <div class="product-actions">
                    <button @click="$emit('addToCart', product)" :style="{ width: '100%' }">
                        <svg-icon type="mdi" :path="mdiCartPlus" />
                        <p>Add to Cart</p>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div v-else style="gap: 2rem; display: flex; justify-content: center; align-items: center; font-size: x-large;">
        Product does not exist
    </div>
</template>
<style lang="scss" scoped>
.hide {
    display: none;
}

img {
    min-height: 50px;
    max-height: 275px;
}

.grid-column {
    width: auto;
}

.product-details {
    flex-direction: column;
}

@media screen and (min-width: 720px) {
    .hide {
        display: flex;
    }

    img {
        min-height: 50px;
        max-height: 450px;
    }

    .grid-column {
        width: 50%;
    }

    .product-details {
        flex-direction: row;
    }
}
</style>