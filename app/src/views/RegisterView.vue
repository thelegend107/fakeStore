<script setup>
import { store } from '@/store';
import Register from '@/components/Register.vue';
import FallbackRouter from '@/components/FallbackRouter.vue';
</script>
<template>
    <main>
        <div class="background"></div>
        <Transition>
            <Suspense>
                <Register v-if="!store.session"></Register>
                <FallbackRouter :session="store.session" v-else></FallbackRouter>
            </Suspense>
        </Transition>
    </main>
</template>