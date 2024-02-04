<script setup>
import { onMounted, ref } from 'vue'
import { store } from '@/store'
import { useRoute, useRouter } from 'vue-router'
import { mdiAccount, mdiInvoice, mdiLogoutVariant, mdiMapMarker } from '@mdi/js'
import { sortBy } from 'underscore';
import SvgIcon from '@jamescoyle/vue-icon';

const router = useRouter();
const route = useRoute();
const showAccountRoutes = ref(false);
let accountRoutes = [];
router.getRoutes().filter((x) => x.name?.includes('account')).forEach((x) => {
    accountRoutes.push({
        displayName: x.name == 'account' ? 'Account' : 
            x.name == 'account-addresses' ? 'Addresses' : 
            x.name == 'account-orders' ? 'Orders' : null,
        name: x.name,
        path: x.path,
        iconPath:
            x.name == 'account' ? mdiAccount : 
            x.name == 'account-addresses' ? mdiMapMarker : 
            x.name == 'account-orders' ? mdiInvoice : null
    })
})

accountRoutes = sortBy(accountRoutes, 'displayName');

function toggleAccountRoutes() {
    showAccountRoutes.value = !showAccountRoutes.value;
    
    if (showAccountRoutes.value == true) {
        setTimeout(() => {
            let dropDownElement = document.getElementById('account-dropdown');
            dropDownElement.focus();
        });
    }
}

onMounted(async () => {
    await store.getCustomer();
})
</script>
<template>
    <div>
        <div @click="toggleAccountRoutes" style="gap: 10px" class="h-account bg-glass flex-r ai-c">
            <img :src="store.getAvatarUrl(47)" width="25" height="25" />
            <div class="h-account-name flex-r ai-c" style="gap: 3.5px">
                <p>{{ store.customer.firstname }}</p>
                <p>{{ store.customer.lastname }}</p>
            </div>
        </div>
        <Transition>
            <div id="account-dropdown" @focusout="toggleAccountRoutes" tabindex="0" class="account-dropdown flex-c" style="gap: 1rem;" v-if="showAccountRoutes">
                <div class="flex-c" style="gap: 1rem;" v-if="!route.name.includes('account')">
                    <router-link class="flex-r ai-c" v-for="route in accountRoutes" :key="route.name" :to="route.path" style="gap: 0.5rem;">
                        <svg-icon type="mdi" :path="route.iconPath"></svg-icon>
                        {{ route.displayName }}
                    </router-link>
                    <hr style="color: rgba(255, 255, 255, 0.1);">
                </div>
                <button @click="store.signOut" class="flex-r ai-c" style="gap: 0.5rem;">
                    <svg-icon type="mdi" :path="mdiLogoutVariant"></svg-icon>
                    Logout
                </button>
            </div>
        </Transition>
    </div>
</template>
<style lang="scss" scoped>
a:hover {
    color: white;
}

.account-dropdown:focus {
    outline: none;
}

.account-dropdown {
    border-radius: 15px;
    backdrop-filter: blur(25px);
    padding: 1rem;
    background-color: rgba($color: #ffffff, $alpha: 0.08);
    margin-top: 0.5rem;
    position: absolute;
    right: 0.5rem;
}

.bg-glass::before {
    border-radius: 25px;
}

.h-account {
    user-select: none;
    position: relative;
    color: white;
    padding: 0;
    border-radius: 25px;
    border: 2px solid var(--primaryV);
    transition: all 0.3s ease;
    cursor: pointer;

    img {
        display: flex;
        align-items: center;
        height: 28px;
        width: 28px;
        border-radius: 100%;
    }

    cursor: pointer;
}

.h-account:hover {
    border: 2px solid var(--primary);
    opacity: 70%;
}

.h-account-name {
    display: none;
}

@media (min-width: 1024px) and (min-height: 788px) {
    .account-dropdown {
        right: auto;
    }
    .h-account {
        padding: 0 0.5rem 0 0rem;
    }
    .h-account-name {
        display: flex;
    }
}
</style>
