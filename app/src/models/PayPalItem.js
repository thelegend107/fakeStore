export class PayPalItem {
    constructor() {
        this.name = '';
        this.quantity = '';
        this.descripton = '';
        this.sku = undefined;
        this.category = PayPalItemCategory.PHYSICAL_GOODS;
        this.unit_amount = {
            currency_code: 'USD',
            value: 0.0
        };
        this.tax = {
            currency_code: 'USD',
            value: 0.0
        };
    }
}

export const PayPalItemCategory = {
    DIGITAL_GOODS: 'DIGITAL_GOODS',
    PHYSICAL_GOODS: 'PHYSICAL_GOODS',
    DONATION: 'DONATION',
}