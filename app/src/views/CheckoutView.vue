<script setup>
import { onBeforeMount } from 'vue';
import router from '@/router';
import CartItems from '@/components/CartItems.vue';
import { store } from '@/store';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiCart } from '@mdi/js';
import GuestCheckout from '@/components/GuestCheckout.vue';
import AccountCheckout from '@/components/AccountCheckout.vue';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

onBeforeMount(() => {
    if (store.getCartItemCount() == 0)
        router.push({name: 'shop'});
})
</script>
<template>
    <main>
        <div class="checkout bg-glass-rounded flex-c" style="padding: 1rem 1rem; box-shadow: var(--box-shadow-1);">
            <div class="grid-column cart flex-c" style="gap: 1rem;">
                <div>
                    <h1 class="flex-r ai-c" style="gap: 5px;"><svg-icon type="mdi" :path="mdiCart" :size="30" />Cart</h1>
                    <h4>There is {{ store.getCartItemCount() == 0 ? router.push({name: 'shop'}) : store.getCartItemCount() }} items in your cart</h4>
                </div>
                <CartItems />
                <div class="flex-c" style=" text-align: center; gap: 5px;">
                    <pre class="separator"> Total </pre>
                    <h2>{{ currency.format(store.getCartTotal()) }}</h2>
                </div>
            </div>
            <div class="grid-column flex-c bg-glass-b">
                <div class="flex-c h-100">
                    <h1>Checkout</h1>
                    <account-checkout v-if="store.session" />
                    <guest-checkout v-else />
                </div>
            </div>
        </div>
    </main>
</template>
<style lang="scss" scoped>
.cart {
    display: none;
}

.grid-column {
    width: 100%;
    color: rgb(225, 225, 225);
    padding: 0.75rem 1.5rem;
}

main {
    max-width: 1666px;
}

@media (min-width: 1024px) and (min-height: 788px) {
    .cart {
        display: flex;
    }

    .bg-glass-b {
        display: flex;
        background-color: rgba($color: #000000, $alpha: 0.35);
        border-radius: 15px;
    }

    .checkout {
        display: flex;
        flex-direction: row;
        height: 90vh;
    }
}
</style>