<script setup>
import { store } from '@/store';
import FallbackRouter from '@/components/FallbackRouter.vue'
import Account from '@/components/Account.vue';

</script>
<template>
    <main>
        <Account v-if="store.session" />
        <FallbackRouter :session="store.session" v-else></FallbackRouter>
    </main>
</template>