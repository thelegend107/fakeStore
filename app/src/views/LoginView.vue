<script setup>
import { store } from '@/store';
import Login from '@/components/Login.vue';
import FallbackRouter from '@/components/FallbackRouter.vue';
</script>
<template>
    <main>
        <div class="background"></div>
        <Transition>
            <Login v-if="!store.session"></Login>
            <FallbackRouter :session="store.session" v-else></FallbackRouter>
        </Transition>
    </main>
</template>