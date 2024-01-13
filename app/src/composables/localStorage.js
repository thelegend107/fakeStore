import { ref, watch } from "vue";
import { store } from "@/store";

const cartKey = 'cart';

export function getCart() {
    const cart = ref(JSON.parse(localStorage.getItem(cartKey)) || []);
    return cart;
}

export function useCart() {
    watch(() => store.cart, (newCart) => 
        {
            localStorage.setItem(cartKey, JSON.stringify(newCart));
        },
        { 
            deep: true 
        }
    );
}