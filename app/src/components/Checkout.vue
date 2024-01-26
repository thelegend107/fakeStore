<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import SvgIcon from '@jamescoyle/vue-icon';
import CartItems from './CartItems.vue';
import { mdiCart } from '@mdi/js';
import { store } from '@/store';

</script>
<template>
    <main>
        <div class="checkout bg-glass-rounded flex-c" style="padding: 1rem 1rem; box-shadow: var(--box-shadow-1);">
            <div class="grid-column cart flex-c w-100" style="gap: 1rem;">
                <div>
                    <h1 class="flex-r ai-c" style="gap: 5px;"><svg-icon type="mdi" :path="mdiCart" :size="30" />Cart</h1>
                    <h4> {{ `There is ${store.getCartItemCount()} items in your cart` }} </h4>
                </div>
                <CartItems />
                <div class="flex-c" style=" text-align: center; gap: 5px;">
                    <pre class="separator"> Total </pre>
                    <h2>{{ `${store.getCartTotal()}` }}</h2>
                </div>
            </div>
            <div class="grid-column bg-glass-b flex-r w-100" style="gap: 1rem;">
                <h1>Checkout</h1>
                <div>
                    
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
        background-color: rgba($color: #000000, $alpha: 0.7);
        backdrop-filter: blur(25px);
        border-radius: 15px;
    }

    .checkout {
        display: flex;
        flex-direction: row;
        max-height: 90vh;
    }
}
</style>