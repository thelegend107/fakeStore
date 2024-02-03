<script setup>
import svgIcon from '@jamescoyle/vue-icon';
import { mdiCart, mdiClose } from '@mdi/js';
import { store } from '@/store';
import CartItems from './CartItems.vue';

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['closeShoppingCart']);
</script>
<template>
    <Transition>
        <div @click="emit('closeShoppingCart')" class="overlay" v-if="show"></div>
    </Transition>
    <div class="shopping-cart flex-c" :style="props.show ? {} : {width: 0}">
        <div class="cart flex-c h-100" v-if="show">
            <div class="flex-r jc-sb">
                <div class="flex-r ai-c" style="gap: 5px;">
                    <svgIcon type="mdi" :path="mdiCart" :size="30" />
                    <h3 class="flex-r ai-c">Cart</h3>
                </div>
                <svgIcon style="cursor: pointer;" @click="emit('closeShoppingCart')" type="mdi" :path="mdiClose" :size="30" />
            </div>
            <hr>
            <CartItems />
            <div class="cart-footer flex-r jc-c" :class="store.cart.length ? 'ai-e' : 'ai-c h-100'">
                <button name="checkout-button" v-if="store.cart.length" @click="$router.push({name: 'checkout'}); emit('closeShoppingCart')" class="w-100">Checkout</button>
                <div v-else class="flex-c ai-c w-100">
                    <p>Your cart is empty</p>
                    <button @click="$router.push({name: 'shop'}); emit('closeShoppingCart')">START SHOPPING</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.shopping-cart {
    min-width: 0;
    min-height: 0;
    width: 95vw;
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1;
    color: white;
    background: linear-gradient(to right, var(--primaryDark), black);
    transition: all 0.3s ease;

    button {
        height: 2rem;
    }

    .cart {
        gap: 1rem;
        padding: 1rem 2rem;
        flex-grow: 1;
        
        hr {
            border-radius: 100%;
        }

        .cart-footer {
            padding: 0.70rem 0rem;
            button {
                font-size: 16px;
                height: 3rem;
                width: 100%;
            }
        }
    }
}

@media (min-width: 700px) {
    .shopping-cart{
        width: 700px;
    }
}
</style>