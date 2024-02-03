<script setup>
import { store } from '@/store';
import svgIcon from '@jamescoyle/vue-icon';
import { mdiMinus, mdiPlus, mdiTrashCan } from '@mdi/js';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
</script>
<template>
    <TransitionGroup tag="ul" name="list" class="cart-items" :class="store.cart.length ? 'h-100' : null">
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
                        <s v-if="ci.product.onSale" style="color: var(--error);">{{ currency.format(ci.subTotal) }}</s>
                        <p>{{ currency.format(ci.total) }}</p>
                    </div>
                </div>
            </div>
            <div class="flex-r jc-sb ai-c" style="gap: 0.5rem;">
                <button @click="store.removeFromCart(ci.product.sku)" class="w-100"><svgIcon type="mdi" :path="mdiTrashCan" /></button>
                <div class="cartItem-qty flex-r ai-c jc-sb w-100">
                    <button name="decrement-quantity" @click="store.cartItemQtyDecrement(ci.product.sku)"><svgIcon type="mdi" :path="mdiMinus" /></button>
                    <p>{{ ci.quantity }}</p>
                    <button name="increment-quantity" @click="store.cartItemQtyIncrement(ci.product.sku)"><svgIcon type="mdi" :path="mdiPlus" /></button>
                </div>
            </div>
        </li>
    </TransitionGroup>
</template>
<style lang="scss" scoped>
.cart-items {
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

@media (min-width: 700px) { 
    .cart-items{
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
</style>