<script setup>
import Account from '@/components/Account.vue';
import Login from '@/components/Login.vue';
import { store } from '@/store';
</script>
<template>
    <main>
        <div class="background"></div>
        <Account v-if="store.session" />
        <Login v-else />
    </main>
</template>