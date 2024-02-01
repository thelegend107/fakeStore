<script setup>
import { store } from '@/store';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiInformation } from '@mdi/js';
import { onBeforeMount, ref } from 'vue';
import OrderDetails from './OrderDetails.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const ordersExist = ref(true);
const showDetails = ref(false);
const showOrder = ref({});
const customerOrders = ref([]);

function showOrderDetails(order) {
    showOrder.value = order;
    showDetails.value = true;
}

function handleBackToOrders() {
    showDetails.value = false;
    showOrder.value = null;
}

onBeforeMount(async () => {
    customerOrders.value = await store.getCustomerOrders();
    if (!customerOrders.value.length > 0)
        ordersExist.value = false;
    else {
        if (router.currentRoute.value.params.orderId) {
            const orderIndex = customerOrders.value.findIndex(o => o.id == router.currentRoute.value.params.orderId)
            if (orderIndex != -1)
                showOrderDetails(customerOrders.value[orderIndex]);
        }
    }
})
</script>
<template>
    <transition mode="out-in">
        <transition-group v-if="!showDetails && ordersExist" mode="out-in" tag="div" name="list" class="flex-c h-100" style="gap: 0.25rem;overflow-x: hidden; overflow-y:scroll;">
            <div class="bg-glass-rounded flex-r ai-c jc-sb" v-for="o in customerOrders" :key="o.id">
                <div class="flex-r ai-c" style="gap: 10px;">
                    <p>#{{ o.id }}</p>
                </div>
                <p>{{ new Date(o.createdAt).toLocaleDateString() }}</p>
                <p class="notInclude">{{ o.referenceId.startsWith('*') ? 'Credit Card' : 'PO Number' }}</p>
                <p>{{ currency.format(o.total) }}</p>
                <svg-icon @click="showOrderDetails(o)" class="order-action" type="mdi" :path="mdiInformation" />
            </div>
        </transition-group>
        <h2 class="bg-glass-rounded" style="padding: 1rem;" v-else-if="!ordersExist">There is no orders to display...</h2>
        <order-details @order-details-back="handleBackToOrders" v-else :order="showOrder" style="overflow-y:scroll;"></order-details>
    </transition>
</template>
<style lang="scss" scoped>
.status {
    border-radius: 100%;
}
.notInclude {
    display: none;
}

@media (min-width: 1024px) and (min-height: 788px) {
    .notInclude {
        display: flex;
    }
}
</style>