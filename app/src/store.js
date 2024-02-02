import { reactive } from 'vue'
import { supabase, addressSelect } from './supabase';
import uselocalStorage from './composables/useLocalStorage';
import useSession from './composables/useSession';
import { toastPrimary, toastType } from './toast';
import Order from '@/models/Order';
import { PayPalItem, PayPalItemCategory } from './models/PayPalItem';

export const store = reactive({
    cart: uselocalStorage('cart', []),
    session: useSession(),
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
                subTotal: product.regularPrice * quantity,
                total: product.salePrice * quantity
            });
        }

        toastPrimary(`Product Item #${product.sku} has been added to the cart`, toastType.success);
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
    getCartTotal() {
        let total = 0;
        this.cart.forEach(x => {
            total += x.product.salePrice * x.quantity
        });

        return total;
    },
    customerClear() {
        this.customer = {};
    },
    async getCustomer() {
        try {
            const { user } = this.session;
    
            const { data, error, status } = await supabase
                .from('customers')
                .select()
                .eq('id', user.id)
                .single()
    
            if (error && status !== 406) throw error

            this.customer = data;
            return data;
        } catch (error) {
            alert(error.message)
        }
    },
    async getCustomerAddresses() {
        try {
            const { user } = this.session;
            const { data, error, status } = await supabase
                .from('addresses')
                .select(addressSelect)
                .eq('userId', user.id)
                .eq('deleted', false)
                .order('id', { ascending: true });
    
            if (error && status !== 406) throw error

            this.customer.addresses = data;
            return data;
        } catch (error) {
            alert(error.message)
        }
    },
    async upsertAddress(a) {
        try {
            const { data, error } = await supabase.from('addresses')
                .upsert({
                    id: a.id,
                    userId: this.session ? this.session.user.id : null,
                    address1: a.address1,
                    address2: a.address2,
                    city: a.city,
                    postalCode: a.postalCode,
                    stateId: a.stateId,
                    countryId: a.countryId,
                    deleted: a.deleted,
                    lastUpdated: new Date()
                }).select(addressSelect).single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            alert(error.message);
        }
    },
    async upsertOrder(order, orderItems) {
        try {
            order.userId = this.session ? store.session.user.id : undefined;

            const { data: orderData, error: orderError } = await supabase.from('orders').upsert(order).select().single();
            if (orderError) throw orderError;

            orderItems.forEach(i => {
                i.userId = this.session ? store.session.user.id : undefined;
                i.orderId = orderData.id;
                i = removeEmptyPropsFromObj(i);
            });

            const { data: orderItemsData, error: orderItemsError } = await supabase.from('orderItems').upsert(orderItems).select();
            if (orderItemsError) throw orderItemsError;

            return { orderData, orderItemsData };
        } catch (error) {
            alert(error.message)
        }
    },
    async getCustomerOrders() {
        try {
            const { user } = this.session;
            const { data, error, status } = await supabase
                .from('orders')
                .select(
                    getObjectSelect(new Order()) + 
                    `, billingAddress:billingAddressId(${addressSelect})` + 
                    `, shippingAddress:shippingAddressId(${addressSelect})`)
                .eq('userId', user.id)
                .order('id', { ascending: false });
    
            if (error && status !== 406) throw error
            return data;
        } catch (error) {
            alert(error.message)
        }
    },
    async getGuestOrderById(orderId, email) {
        try {
            const { data, error, status } = await supabase
                .from('orders')
                .select(
                    getObjectSelect(new Order()) + 
                    `, billingAddress:billingAddressId(${addressSelect})` + 
                    `, shippingAddress:shippingAddressId(${addressSelect})`)
                .is('userId', null)
                .eq('id', orderId)
                .eq('email', email.toLowerCase())
                .single()
    
            if (error && status !== 406) throw error
            return data;
        } catch (error) {
            alert(error.message)
        }
    },
    async getOrderItemsByOrderId(orderId) {
        try {
            const {data, error} = await supabase.from('orderItems').select().eq('orderId', orderId);
            if (error) throw error;
            return data;
        } catch (error) {
            alert(error);
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
    },
    getPayPalCartItems() {
        let paypalItems = [];

        this.cart.forEach(i => {
            let paypalItem = new PayPalItem();
            paypalItem.name =  truncateString(i.product.name, false, 120);
            paypalItem.sku = i.product.sku;
            paypalItem.quantity = i.quantity;
            paypalItem.category = PayPalItemCategory.PHYSICAL_GOODS;
            paypalItem.unitAmount = {
                currency_code: 'USD',
                value: i.product.salePrice
            };
            paypalItem.tax = {
                currency_code: 'USD',
                value: 0.0
            };

            paypalItems.push(paypalItem);
        })

        return paypalItems;
    }
});

function recalculateCartItemTotals(cartItem) {
    cartItem.subTotal = cartItem.product.regularPrice * cartItem.quantity;
    cartItem.total = cartItem.product.salePrice * cartItem.quantity;
    return cartItem;
}

export function truncateString(string, productName=false, maxLength=50) {
    if (productName)
        maxLength = 25;
    
    let totalLength = 0;
    let stringArray = [];
    let stringSplit = string.split(' ');

    for (let i = 0; i < stringSplit.length; i++) {
        totalLength += stringSplit[i].length;
        if (totalLength > maxLength) {
            break;
        }
        else {
            stringArray.push(stringSplit[i]);
        }
    }

    let truncatedString = stringArray.join(' ').trim();
    if (truncatedString.lastIndexOf('-') > 0 && truncatedString.indexOf('-') != truncatedString.lastIndexOf('-'))
        truncatedString = truncatedString.slice(0, truncatedString.lastIndexOf('-')).trim();

    if (totalLength > maxLength)
        truncatedString += '...';

    return truncatedString;
}

export function productNameBrand(name) {
    return truncateString(name.split(' - ').shift(), true);
}

export function productDescription(name) {
    let nameArray = name.split(' - ');
    let description = [];

    for (let i = 1; i < nameArray.length; i++) {
        nameArray[i];
        description.push(nameArray[i]);
    }

    return truncateString(description.join(' - '));
}

export function displayAddress(obj) {
    let addressArray = []
    if (obj.address1)
        addressArray.push(obj.address1);
    if (obj.address2) addressArray.push(obj.address2)
    if (obj.city || obj.state) addressArray.push((obj.city + ' ' + obj.state.stateCode).trim())
    if (obj.country) addressArray.push(obj.country.ISO3)

    return addressArray.join(', ')
}

function getObjectSelect(obj) {
    let props = [];
    Object.keys(obj).forEach((key) => {
        props.push(key)
    });
    
    return props.join(',');
}

function removeEmptyPropsFromObj(obj) {
    Object.keys(obj).forEach( 
        (key) => (obj[key] === null || obj[key] == undefined) && delete obj[key]);
    
    return obj;
}