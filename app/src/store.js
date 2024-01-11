import { reactive } from 'vue'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export const store = reactive({
    cart: [],
    addToCart(product, quantity) {
        let existingProductIndex = this.cart.findIndex(x => x.product.sku == product.sku);
        if (existingProductIndex != -1){
            this.cart[existingProductIndex].quantity++;
            this.cart[existingProductIndex] = recalculateCartItemTotals(this.cart[existingProductIndex]);
        }
        else {
            this.cart.push({
                product: product,
                quantity: quantity,
                regularPrice: currency.format(product.unitPrice * quantity),
                salePrice: currency.format(product.unitPriceAfterDiscount * quantity),
            });
        }
    },
    cartItemQtyIncrement(sku) {
        let existingProductIndex = this.cart.findIndex(x => x.product.sku == sku);
        if (existingProductIndex != -1) {
            this.cart[existingProductIndex].quantity++;
            this.cart[existingProductIndex] = recalculateCartItemTotals(this.cart[existingProductIndex]);
        } 
    },
    cartItemQtyDecrement(sku) {
        let existingProductIndex = this.cart.findIndex(x => x.product.sku == sku);
        if (existingProductIndex != -1) {
            if (this.cart[existingProductIndex].quantity - 1 > 0) {
                this.cart[existingProductIndex].quantity--;
                this.cart[existingProductIndex] = recalculateCartItemTotals(this.cart[existingProductIndex]);
            }
            else {
                this.removeFromCart(sku)
            }
        }
    },
    removeFromCart(sku) {
        this.cart = this.cart.filter(x => x.product.sku != sku)
    },
    getCartItemCount() {
        let count = 0;
        this.cart.forEach(x => {
            count += x.quantity;
        });

        return count;
    }
});

function recalculateCartItemTotals(cartItem) {
    cartItem.regularPrice = currency.format(cartItem.product.unitPrice * cartItem.quantity);
    cartItem.salePrice = currency.format(cartItem.product.unitPriceAfterDiscount * cartItem.quantity);
    return cartItem;
}