<script setup>
import svgIcon from '@jamescoyle/vue-icon';
import { mdiCart, mdiClose, mdiMinus, mdiPlus, mdiTrashCan } from '@mdi/js';
import { store } from '@/store';

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
            <div class="cart-header flex-r jc-sb">
                <div class="flex-r ai-c" style="gap: 5px;">
                    <svgIcon type="mdi" :path="mdiCart" :size="30" />
                    <h3 class="flex-r ai-c">Cart</h3>
                </div>
                <svgIcon style="cursor: pointer;" @click="emit('closeShoppingCart')" type="mdi" :path="mdiClose" :size="30" />
            </div>
            <hr>
            <TransitionGroup tag="ul" name="list" class="cart-body" :class="store.cart.length ? 'h-100' : null">
                <li class="cart-item flex-c" v-for="ci in store.cart" :key="ci.product.sku">
                    <div class="cart-item-info" style="gap: 1rem;">
                        <img :src="ci.product.image" :alt="ci.product.sku">
                        <div class="cart-item-skuModelPrice" style="gap: 1rem;">
                            <div>
                                <p>{{ ci.product.name }}</p>
                                <div class="cart-item-skuModel" style="font-size: small;color: gray;">
                                    <p>SKU: {{ ci.product.sku }}</p>
                                    <p>Model: {{ ci.product.modelNumber }}</p>
                                </div>
                            </div>
                            <hr>
                            <div class="cart-item-price" :class="ci.product.onSale ? 'jc-sb' : 'jc-e'" style="gap: 1rem;">
                                <s v-if="ci.product.onSale" style="color: darkred;">{{ ci.regularPrice }}</s>
                                <p>{{ ci.salePrice }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex-r jc-sb ai-c" style="gap: 0.5rem;">
                        <button @click="store.removeFromCart(ci.product.sku)" class="w-100"><svgIcon type="mdi" :path="mdiTrashCan" /></button>
                        <div class="cartItem-qty flex-r ai-c jc-sb w-100">
                            <button @click="store.cartItemQtyDecrement(ci.product.sku)"><svgIcon type="mdi" :path="mdiMinus" /></button>
                            <p>{{ ci.quantity }}</p>
                            <button @click="store.cartItemQtyIncrement(ci.product.sku)"><svgIcon type="mdi" :path="mdiPlus" /></button>
                        </div>
                    </div>
                </li>
            </TransitionGroup>
            <div class="cart-footer flex-r jc-c" :class="store.cart.length ? 'ai-e' : 'ai-c h-100'">
                <button v-if="store.cart.length" class="w-100">Checkout</button>
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

        .cart-header {
        }

        .cart-body {
            padding: 0 10px 0 0;
            overflow-x: hidden;
            overflow-y: scroll;
            gap: 1rem;
            border-radius: 15px;
            .cart-item {
                box-shadow: var(--box-shadow-1);
                margin-bottom: 0.5rem;
                gap: 0.6rem;
                padding: 0.5rem;
                background-color: rgba(255,255,255,0.065);
                backdrop-filter: blur(50px);
                border-radius: 15px;

                .cart-item-info {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    .cart-item-skuModelPrice {
                        flex-direction: column;
                        .cart-item-skuModel {
                            display: flex;
                            flex-direction: column;
                        }
                        .cart-item-price {
                            display: flex;
                            flex-direction: row;
                            justify-content: space-between;
                        }
                    }
                }
            }
            img {
                border-radius: 15px;
                height: 90px;
                width: 150px;
            }

            .cartItem-qty {
                border-radius: 15px;
                color: white;
                backdrop-filter: blur(50px);
            }
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
        .cart {
            .cart-body{
                .cart-item {
                    .cart-item-info {
                        display: flex;
                        flex-direction: row;
                        .cart-item-skuModelPrice {
                            display: flex;
                            flex-direction: row;
                            justify-content: space-between;
                            .cart-item-skuModel {
                                display: flex;
                                justify-content: space-between;
                                flex-direction: row;
                            }
                            .cart-item-price {
                                font-size: 20px;
                                display: flex;
                                flex-direction: column;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>