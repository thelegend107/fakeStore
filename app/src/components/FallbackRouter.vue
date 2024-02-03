<script setup>
import Card from '@/components/Card.vue';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiAccount, mdiHome, mdiInvoice, mdiLoginVariant } from '@mdi/js';

defineProps({
    session: Object,
    order: Boolean
})
</script>
<template>
    <Card :centered="true">
        <div class="flex-c ai-c jc-c" style="gap: 1rem;">
            <h1 v-if="session && !order">A user session is currently active! Please go home or logout.</h1>
            <h1 v-else-if="session && order">Are you trying to view your order history?</h1>
            <h1 v-else>There is currently no user session active! Please login or go home.</h1>

            <div class="flex-r jc-sb w-100" style="gap: 0.5rem;">
                <button name="go-home" @click="$router.push({name: 'home'})" class="flex-r ai-c w-100" style="gap: 5px;"><svg-icon type="mdi" :path="mdiHome" />HOME</button>
                <button name="go-to-account" @click="$router.push({name: 'account'})" v-if="session && !order" class="flex-r ai-c w-100" style="gap: 5px;">
                    <svg-icon type="mdi" :path="mdiAccount" /> ACCOUNT
                </button>
                <button name="go-to-orders" @click="$router.push({name: 'account-orders'})" v-else-if="session && order" class="flex-r ai-c w-100" style="gap: 5px;">
                    <svg-icon type="mdi" :path="mdiInvoice" /> ACCOUNT ORDERS
                </button>
                <button name="go-to-login" @click="$router.push({name: 'login'})" v-else class="flex-r ai-c w-100" style="gap: 5px;">
                    <svg-icon type="mdi" :path="mdiLoginVariant" />LOGIN
                </button>
            </div>
        </div>
    </Card>
</template>