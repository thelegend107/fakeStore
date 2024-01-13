import { reactive } from 'vue'
import { supabase } from './supabase';
import { getCart } from './composables/localStorage';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export const store = reactive({
    cart: getCart(),
    session: null,
    customer: {},
    addToCart(product, quantity=1) {
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
    },
    customerClear() {
        this.customer = {};
    },
    async getCustomer() {
        try {
            const { user } = this.session;
    
            const { data, error, status } = await supabase
                .from('customers')
                .select('firstname, lastname, username, avatarurl')
                .eq('id', user.id)
                .single()
    
            if (error && status !== 406) throw error
            if (data) {
                this.customer.firstname = data.firstname;
                this.customer.lastname = data.lastname;
                this.customer.avatarurl = data.avatarurl;
                this.customer.username = data.username;

                return data;
            }
        } catch (error) {
            alert(error.message)
        }
    },
    getAvatarUrl(size = 150) {
        let url = 'https://ui-avatars.com/api/?name=';
    
        if (this.customer.avatarurl)
            url = this.customer.avatarurl;
        else
            url += this.customer.firstname + '+' + this.customer.lastname;
    
        if (size && Number.parseInt(size))
            url += '&size=' + Number.parseInt(size);
        return url;
    }
});

function recalculateCartItemTotals(cartItem) {
    cartItem.regularPrice = currency.format(cartItem.product.unitPrice * cartItem.quantity);
    cartItem.salePrice = currency.format(cartItem.product.unitPriceAfterDiscount * cartItem.quantity);
    return cartItem;
}