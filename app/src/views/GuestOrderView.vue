<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import { store } from '@/store';
import OrderDetails from '@/components/OrderDetails.vue';
import FallbackRouter from '@/components/FallbackRouter.vue';
import Card from '@/components/Card.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

const noOrder = ref(false);
const order = ref();
const route = useRoute();

onBeforeMount(async () => {
    if (route.params.orderId && route.params.email) {
        order.value = await store.getGuestOrderById(route.params.orderId, route.params.email)
        if (!order.value)
            noOrder.value = true;
    }
})
</script>
<template>
    <main>
        <Transition mode="out-in">
            <card v-if="!store.session && order" style="margin-top: 0.5rem;">
                <order-details @order-details-back="$router.push({name: 'home'})" :order="order" :guest="true" />
            </card>
            <card v-else-if="!order && !noOrder">
                <LoadingSpinner />
            </card>
            <card :centered="true" v-else-if="noOrder">
                <div class="flex-c ai-c" style="gap: 1rem;">
                    <h2>no order to display...</h2>
                    <button @click="$router.push({name: 'home'})" class="w-100" style="height: 3rem;">HOME</button>
                </div>
            </card>
            <FallbackRouter v-else :session="store.session" :order="true" />
        </Transition>
    </main>
</template>