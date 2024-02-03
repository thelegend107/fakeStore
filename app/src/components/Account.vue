<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref } from 'vue';
import { store } from '@/store';
import { supabase } from '@/supabase';
import Card from '@/components/Card.vue';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiAccount, mdiInvoiceCheck, mdiLogoutVariant, mdiMapMarker } from '@mdi/js';

const routeLinks = [
    { name: 'Account', path: '/account', iconPath: mdiAccount},
    { name: 'Addresses', path: '/account/addresses', iconPath: mdiMapMarker},
    { name: 'Orders', path: '/account/orders', iconPath: mdiInvoiceCheck},
]

const signingOut = ref(false);
async function signOut() {
    try {
        signingOut.value = true;
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        else {
            store.customerClear();
        }
    } 
    catch (error) {
        alert(error);
    }
    finally {
        signingOut.value = false;
    }
}
</script>
<template>
    <card :full-height="true">
        <img :src="store.getAvatarUrl()" width="150" height="150" />
        <nav class="bg-glass-rounded flex-r ai-c jc-c" style="gap: 1rem;">
            <router-link class="flex-r ai-c" style="gap: 5px;" v-for="route in routeLinks" :to="route.path" :key="route.name">
                <svg-icon type="mdi" :path="route.iconPath"></svg-icon>
                <p>{{ route.name }}</p>
            </router-link>
        </nav>
        <router-view class="h-100" v-slot="{ Component }">
            <transition mode="out-in">
                <component :is="Component" />
            </transition>
        </router-view>
        <hr>
        <button name="logout-button" @click="signOut"><svg-icon type="mdi" :path="mdiLogoutVariant" />{{ signingOut ? 'Logging out...' : 'Logout' }}</button>
    </card>
</template>
<style lang="scss" scoped>
.bg-glass-rounded {
    padding: 0px;
}

nav {
    a {
        color: inherit;
        padding: 0.5rem 1rem;
    }
    p {
        display:none;
    }
}

.router-link-exact-active {
    color: white;
    border-bottom: 2px solid white;
}

img {
    align-self: center;
    margin-top: -5rem;
    border-radius: 100%;
    border: 4px solid rgba($color: white, $alpha: 0.04);
}

@media (min-width: 1024px) and (min-height: 788px) {
    nav {
        p {
            display: block;
        }
    }
}
</style>