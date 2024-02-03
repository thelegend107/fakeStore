<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { onMounted, ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import { bool, number, object, string } from 'yup';
import { vMaska } from 'maska';
import { displayAddress, store } from '@/store';
import Order from '@/models/Order'
import OrderItem from '@/models/OrderItem'
import { mdiCashCheck, mdiCreditCard } from '@mdi/js';
import { siVisa, siMastercard, siAmericanexpress } from 'simple-icons';
import svgIcon from '@jamescoyle/vue-icon';
import { toastPrimary, toastType } from '@/toast';
import router from '@/router';
import Modal from './Modal.vue';
import AddressInput from './AddressInput.vue';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const title = ref('Checkout');
const prop = defineProps({
    guest: Boolean
})

const customerAddress = ref([]);
const addressModalBilling = ref(false);
const addressModalShow = ref(false);
const sameAsShippingAddress = ref(true);

const months = ref([]);
const years = [];
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

for (let i=currentYear; i <= currentYear+10; i++) {
    years.push(i);
}

for (let i=1; i <= 12; i++) {
    months.value.push(i);
}

function creditCardExpYearChange(year) {
    months.value = [];
    if (year == currentYear) {
        for (let i=currentMonth; i <= 12; i++) {
            months.value.push(i);
        }

        if (cardExpMonth.value < currentMonth)
            cardExpMonth.value = 0;
    }
    else
        for (let i=1; i <= 12; i++) {
            months.value.push(i);
        }
}

const paymentMethods = ref([
    { id: 1, method: 'Credit/Debit Card', iconPath: mdiCreditCard, size: 25 },
    { id: 2, method: 'PO Number', iconPath: mdiCashCheck, size: 27 },
]);

onMounted(async () => {
    if (!prop.guest) {
        customerAddress.value = await store.getCustomerAddresses();
    }
    else {
        title.value = 'Guest Checkout'
        paymentMethods.value = paymentMethods.value.filter(x => x.id != 2);
    }
})

const { meta, errors, defineField, handleSubmit } = useForm({
    validationSchema: object({
        guest: bool(),
        email: string().when('guest', {
            is: true,
            then: (schema) => schema.required('email is a required field').matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'please enter a valid email address')
        }),
        billingAddressId: number().required('please choose an address or create one').min(1, ''),
        shippingAddressId: number().required('please choose an address or create one').min(1, ''),
        paymentMethodId: number().required('please choose a payment method'),
        cardHolderName: string().when('paymentMethodId', {
            is: 1,
            then: (schema) => schema.required('card holder name is required')
        }),
        cardNumber: string().when('paymentMethodId', {
            is: 1,
            then: (schema) => schema.required('card number is required').matches(/^[2,3,4,5]/, 'card has to be VISA, MASTERCARD, or AMEX').matches(/^(\d+ \d+ \d+ \d+)|(\d+ \d+ \d+)/, 'card has to be a number').min(17).max(19)
        }),
        cardExpMonth: number().when('paymentMethodId', {
            is: 1,
            then: (schema) => schema.required().min(1)
        }),
        cardExpYear: number().when('paymentMethodId', {
            is: 1,
            then: (schema) => schema.required().min(currentYear).max(currentYear+10)
        }),
        cardCVC: string().when('paymentMethodId', {
            is: 1,
            then: (schema) => schema.required().matches(/^\d+$/, 'CVC has to be a number').min(3).max(4)
        }),
        purchaseOrderNumber: string().when('paymentMethodId', {
            is: 2,
            then: (schema) => schema.required('purhcase order number is required')
        })
    }),
    initialValues: {
        guest: prop.guest ? true : false,
        paymentMethodId: prop.guest ? 1 : null,
        billingAddressId: 0,
        shippingAddressId: 0,
        cardExpMonth: 0,
        cardExpYear: 0,
    }
})

const [email] = defineField('email');
const [billingAddressId] = defineField('billingAddressId');
const [shippingAddressId] = defineField('shippingAddressId');
const [paymentMethodId] = defineField('paymentMethodId');
const [cardHolderName] = defineField('cardHolderName');
const [cardNumber] = defineField('cardNumber');
const [cardExpMonth] = defineField('cardExpMonth');
const [cardExpYear] = defineField('cardExpYear');
const [cardCVC] = defineField('cardCVC');
const [purchaseOrderNumber] = defineField('purchaseOrderNumber');

function newAddressSelect(billing) {
    if (billing){
        addressModalBilling.value = true;
        billingAddressId.value = 0;
    }
    else {
        addressModalBilling.value = false;
        shippingAddressId.value = 0;
    }

    addressModalShow.value = true;
}

async function handleAddressUpsert(a) {
    await store.upsertAddress(a).then(async (data) => {
        addressModalShow.value = false;
        customerAddress.value = await store.getCustomerAddresses();

        if (addressModalBilling.value)
            billingAddressId.value = data.id;
        else
            shippingAddressId.value = data.id;

        toastPrimary("Address was added successfuly!", toastType.success); 
    });
}

async function handleGuestNewAddress(a) {
    let guestMaxAddressId = 0;

    if (customerAddress.value.length > 0)
        guestMaxAddressId = Math.max(customerAddress.value.map(x => x.id));

    a.id = guestMaxAddressId+1
    
    addressModalShow.value = false;
    customerAddress.value.push(a);

    if (addressModalBilling.value)
        billingAddressId.value = a.id;
    else
        shippingAddressId.value = a.id;
}

const placeOrder = handleSubmit(async () => {
    let order = new Order();
    let orderItems = [];

    let gBillingAddress = null;
    let gShippingAddress = null;
    if (prop.guest) {
        let baIndex = customerAddress.value.findIndex(x => x.id == billingAddressId.value);
        let saIndex = customerAddress.value.findIndex(x => x.id == shippingAddressId.value);

        gBillingAddress = await store.upsertAddress(customerAddress.value[saIndex]);

        if (!sameAsShippingAddress.value && gBillingAddress)
            gShippingAddress = await store.upsertAddress(customerAddress.value[baIndex]);
        else
            gShippingAddress = gBillingAddress;

        if (!gShippingAddress || !gBillingAddress) {
            toastPrimary('Failed to create shipping or billing address', toastType.error);
            return false;
        }

        order.email = email.value.toLowerCase();
        order.billingAddressId = gBillingAddress.id;
        order.shippingAddressId = gShippingAddress.id;
    }
    else {
        order.billingAddressId = billingAddressId.value;
        order.shippingAddressId = shippingAddressId.value;
    }
    order.subTotal = store.getCartTotal();
    order.total = order.subTotal;

    store.cart.forEach(cartItem => {
        let orderItem = new OrderItem();
        orderItem.name = cartItem.product.name;
        orderItem.sku = cartItem.product.sku;
        orderItem.unitPrice = cartItem.product.regularPrice;
        orderItem.discount = cartItem.product.percentSavings;
        orderItem.salePrice = cartItem.product.salePrice;
        orderItem.imageUrl = cartItem.product.image;
        orderItem.quantity = cartItem.quantity;
        orderItem.subTotal = cartItem.subTotal;
        orderItem.total = cartItem.total;
        
        orderItems.push(orderItem);
    });
    
    switch (paymentMethodId.value) {
        case 1:
            order.referenceId = '';
            for (let i = 0; i < cardNumber.value.length; i++)
                if (i < cardNumber.value.length-4)
                    order.referenceId += cardNumber.value[i] == ' ' ? ' ' : '*'
                else
                    order.referenceId += cardNumber.value[i]
            break;
        case 2:
            order.referenceId = purchaseOrderNumber.value;
            break;
    }

    const { orderData, orderItemsData } = await store.upsertOrder(order, orderItems);
    
    if (orderData && orderItemsData.length == orderItems.length) {
        toastPrimary(`Order #${orderData.id} was created successfully`, toastType.success);
        
        if (prop.guest)
            router.push({name: 'guest-order', params: { email: orderData.email, orderId: orderData.id }});
        else
            router.push({name: 'account-orders'});

        setTimeout(() => {
            store.cart.length = 0;
        }, 500);
    }
})

const cardPattern = ref('#### #### #### ####');
const cardCVCPattern = ref('###');
watch((cardNumber), newVal => {
    switch (newVal[0]) {
        case '2':
            paymentMethods.value[0].iconPath = siMastercard.path;
            cardPattern.value = '#### #### #### ####';
            cardCVCPattern.value = '###';
            break;
        case '5':
            paymentMethods.value[0].iconPath = siMastercard.path;
            cardPattern.value = '#### #### #### ####';
            cardCVCPattern.value = '###';
            break;
        case '4':
            paymentMethods.value[0].iconPath = siVisa.path;
            cardPattern.value = '#### #### #### ####';
            cardCVCPattern.value = '###';
            break;
        case '3':
            paymentMethods.value[0].iconPath = siAmericanexpress.path;
            cardPattern.value = '#### ###### #####';
            cardCVCPattern.value = '####';
            break;
        default:
            paymentMethods.value[0].iconPath = mdiCreditCard;
            cardPattern.value = '#### #### #### ####';
            cardCVCPattern.value = '###';
            break;
    }
})

watch((billingAddressId), (newVal) => {
    if (sameAsShippingAddress.value == true)
        shippingAddressId.value = newVal;
})

watch((sameAsShippingAddress), (newVal) => {
    if (newVal == true)
        shippingAddressId.value = billingAddressId.value;
})
</script>
<template>
    <div class="flex-c h-100">
        <transition>
            <modal v-if="addressModalShow && !guest" @close-modal="addressModalShow = false" title="New Address">
                <template #body><address-input @address-upsert="handleAddressUpsert" /></template>
            </modal>
            <modal v-else-if="addressModalShow && guest" @close-modal="addressModalShow = false" title="New Address">
                <template #body><address-input @address-upsert="handleGuestNewAddress" /></template>
            </modal>
        </transition>
        <h1>{{ title }}</h1>
        <form @submit.prevent="placeOrder" class="flex-c h-100" style="flex-wrap: wrap; gap: 0.5rem;">
            <div v-if="guest" class="account-email flex-c w-100">
                <label>Email:</label>
                <input :class="{ inputError: errors.email }" placeholder="please enter an email" type="email" v-model="email">
                <span>{{ errors.email }}</span>
            </div>
            <div class="account-billing flex-c w-100">
                <label>Billing Address:</label>
                <select v-on:change="$event.target.value == -1 ? newAddressSelect(true) : null" :class="{ inputError: errors.billingAddressId || billingAddressId == 0 }" v-model="billingAddressId">
                    <option :value='0' disabled selected hidden>Please select an address</option>
                    <option :value='-1'>------ New Address ------</option>
                    <option v-for="a in customerAddress" :key="a.id" :value="a.id">{{ displayAddress(a) }}</option>
                </select>
                <span>{{ errors.billingAddressId }}</span>
            </div>
            <div class="flex-r jc-e">
                <p style="display: inline-block; gap: 5px;">
                    same as shipping address <input style="align-self: flex-end;" type='checkbox' v-model="sameAsShippingAddress">
                </p>
            </div>
            <Transition>
                <div v-if="!sameAsShippingAddress" class="account-shipping flex-c w-100">
                    <label>Shipping Address:</label>
                    <select v-on:change="$event.target.value == -1 ? newAddressSelect(false) : null" :class="{ inputError: errors.shippingAddressId || shippingAddressId == 0 }" v-model="shippingAddressId">
                        <option :value='0' disabled selected hidden>Please select an address</option>
                        <option :value='-1'>------ New Address ------</option>
                        <option v-for="a in customerAddress" :key="a.id" :value="a.id">{{ displayAddress(a) }}</option>
                    </select>
                    <span>{{ errors.shippingAddressId }}</span>
                </div>
            </Transition>
            <div class="payment-method flex-c w-100" style="gap: 0.5rem; margin-bottom: 0.5rem;">
                <label>Payment Method:</label>
                <div class="flex-r ai-c" style="gap: 0.5rem;">
                    <button type="button" @click="paymentMethodId = p.id" class="w-100" v-for="p in paymentMethods" :key="p.id" :class="{selected: p.id == paymentMethodId}">
                        <svg-icon type="mdi" :path="p.iconPath" :size="p.size" />
                        <p>{{p.method}}</p>
                    </button>
                    <span>{{ errors.paymentMethodId }}</span>
                </div>
                <Transition mode="out-in">
                    <div v-if="paymentMethodId == 1" class="flex-c" style="gap: 0.25rem;">
                        <input :class="{ inputError: errors.cardHolderName }" v-maska data-maska="@ @ @" data-maska-tokens="@:[a-zA-Z]:multiple" v-model="cardHolderName" class="w-100" type="text" placeholder="Card Holder Name">
                        <span>{{ errors.cardHolderName }}</span>
                        <input :class="{ inputError: errors.cardNumber }" v-model="cardNumber" v-maska :data-maska="cardPattern" class="w-100" type="tel" inputmode="numeric" placeholder="Card Number">
                        <span>{{ errors.cardNumber }}</span>
                        <div class="flex-r" style="flex-wrap: wrap; gap: 0.5rem;">
                            <div class="flex-r" style="gap: 5px; flex-grow: 1;">
                                <div class="flex-c">
                                    <select :class="{ inputError: errors.cardExpMonth }" v-model="cardExpMonth">
                                        <option value=0 disabled selected hidden>MM</option>
                                        <option v-for="m in months" :key="m">{{ m }}</option>
                                    </select>
                                    <span>{{ errors.cardExpMonth }}</span>
                                </div>
                                <div class="flex-c" style="flex-grow: 1;">
                                    <select v-on:change="creditCardExpYearChange(cardExpYear)" :class="{ inputError: errors.cardExpYear }" v-model="cardExpYear">
                                        <option value=0 disabled selected hidden>YYYY</option>
                                        <option v-for="y in years" :key="y">{{ y }}</option>
                                    </select>
                                    <span>{{ errors.cardExpYear }}</span>
                                </div>
                            </div>
                            <div class="flex-c" style="flex-grow: 1;">
                                <input :class="{ inputError: errors.cardCVC }" v-maska :data-maska="cardCVCPattern" v-model="cardCVC" type="tel" inputmode="numeric" placeholder="CVC">
                                <span>{{ errors.cardCVC }}</span>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="paymentMethodId == 2">
                        <input maxlength="25" :class="{ inputError: errors.purchaseOrderNumber }" v-model="purchaseOrderNumber" class="w-100" placeholder="PO #">
                        <span>{{ errors.purchaseOrderNumber }}</span>
                    </div>
                </Transition>
            </div>
            <button name="place-order" class="flex-c" style="margin-top: auto; height: 4rem; gap: 0.25rem;" type="submit" :disabled="!meta.valid">
                <p>Place Order</p>
                <p class="btn-total">{{ currency.format(store.getCartTotal()) }}</p>
            </button>
        </form>
    </div>
</template>
<style lang="scss" scoped>
.btn-total {
    display: flex;
}

.payment-method {
    .selected, .selected:hover {
        background-color: var(--primary);
        border: none;
        opacity: 1;
    }

    button:hover {
        border: 2px solid var(--primary);
    }

    button {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 2.5rem;
        border-radius: 5px;
        border: 2px solid var(--primaryV);
        background-color: black;
        p {
            display: none;
        }
    }
}

@media (min-width: 1024px) and (min-height: 788px) {
    .btn-total {
        display: none;
    }
    .payment-method {
        button {
            p {
                display: block;
            }
        }
    }
}
</style>@/models/OrderItem@/models/Order