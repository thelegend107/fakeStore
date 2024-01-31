<script setup>
import { displayAddress, store, truncateString } from '@/store';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiArrowLeftBoldCircle } from '@mdi/js';
import { onMounted, ref } from 'vue';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const percentage = new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })

const emit = defineEmits(['back-to-orders'])
const prop = defineProps({
    order: Object
})
const orderItems = ref([]);

onMounted(async () => {
    orderItems.value = await store.getOrderItemsByOrderId(prop.order.id);
})
</script>
<template>
    <div>
        <div class="flex-c" style="gap: 0.25rem;overflow-x: hidden;overflow-y: scroll;">
            <div class="action-buttons flex-r jc-sb bg-glass-rounded ai-c" style="padding: 0.25rem 1rem 0.25rem 0.25rem; color: white;">
                <div @click="emit('back-to-orders')" class="flex-r order-action" style="gap: 5px;">
                    <svg-icon type="mdi" :path="mdiArrowLeftBoldCircle" />
                    <p>back</p>
                </div>
                <p>Order #{{ order.id }}</p>
                <p>{{ new Date(order.createdAt).toLocaleDateString() }}</p>
            </div>
            <div class="order-details bg-glass-rounded">
                <h2>Order Details</h2>
                <div>
                    <p v-if="order.referenceId.startsWith('*')">Credit Card: {{ order.referenceId.replaceAll(' ','') }}</p>
                    <p v-else>PO Number: {{ order.referenceId }}</p>
                </div>
            </div>
            <div class="billing-information bg-glass-rounded">
                <h2>Billing Address</h2>
                {{ displayAddress(order.billingAddress) }}
            </div>
            <div class="shipping-information bg-glass-rounded">
                <h2>Shipping Address</h2>
                {{ displayAddress(order.shippingAddress) }}
            </div>
            <table class="bg-glass-rounded">
                <tr style="color: white;"> 
                    <th style="text-align: left;">Product</th>
                    <th>Qty</th>
                    <th class="t-hide">Unit Price</th>
                    <th class="t-hide">Discount</th>
                    <th class="t-hide">Sale Price</th>
                    <th>Total</th>
                </tr>
                <tr v-for="oi in orderItems" :key="oi.id">
                    <td style="max-width: 350px; text-align: left;">
                        <p>{{ truncateString(oi.name, false) }}</p>
                        <p style="font-size: 12px;">SKU: {{ oi.sku }}</p>
                    </td>
                    <td>{{ oi.quantity }}</td>
                    <td class="t-hide">{{ currency.format(oi.unitPrice) }}</td>
                    <td class="t-hide">{{ percentage.format(oi.discount/100) }}</td>
                    <td class="t-hide">{{ currency.format(oi.salePrice) }}</td>
                    <td>{{ currency.format(oi.total) }}</td>
                </tr>
            </table>
            <div class="order-total flex-c bg-glass-rounded" style="text-align: center; gap: 5px;">
                <p>Total</p>
                <h2>{{ currency.format(order.total) }}</h2>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
table {
    text-align: center;
    td {
        padding-top: 10px;
    }
}

.t-hide {
    display: none;
}

h2 {
    font-size: 18px;
    color: white;
}

@media (min-width: 1024px) and (min-height: 788px) {
    .t-hide {
        display: table-cell;
    }

    .shipping-information, .billing-information, .order-details {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
}
</style>