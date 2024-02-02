// Works but the button is ugly... tailored for a white themed website.
// I would need to use the actual PayPal API to get the user a PayPal session in a new tab.
// Might have to look into how to track that new tab, and if the user completed the checkout process on that new tab or cancelled.
// Using this button does track the new tab and has an overlay on the whole website until the user done checking out with PayPal. 
// Which is a pretty nice functionality that you would want to replicate if you use the API directly.
import { onBeforeMount } from 'vue'
import { loadScript } from '@paypal/paypal-js'
import { toastPrimary, toastType } from '@/toast'
import { store } from '@/store'

export default function () {
    const CLIENT_ID = 'test'

    onBeforeMount(() => {
        loadScript({ 'client-id': CLIENT_ID }).then((paypal) => {
            paypal.Buttons({
                fundingSource: 'paypal',
                style: {
                    layout: 'vertical',
                    color:  'black',
                    shape:  'rect',
                    label:  'paypal',
                    tagline: false
                },
                onCancel() { toastPrimary('PayPal order was canceled!', toastType.error); },
                createOrder: createOrder,
                onApprove: onApprove
            }).render('#paypal-button-container')
        })
    })
}

function createOrder(data, actions) {
    console.log('Creating order...')
    return actions.order.create({
        intent: 'CAPTURE',
        purchase_units: [
            {
                items: store.getPayPalCartItems(),
                payee: {
                    email_address: 'mma.ayoub@outlook.com'
                },
                amount: {
                    value: store.getCartTotal()
                }
            }
        ]
    })
}

function onApprove(data, actions) {
    console.log('Order approved...')
    return actions.order.capture().then(() => {
        toastPrimary('Order was completed successfully!', toastType.success)
    })
}
