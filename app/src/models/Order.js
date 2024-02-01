export default class Order {
    constructor(obj) {
        if (obj)
            Object.assign(this, obj);
        else {
            this.id = undefined;
            this.userId = undefined;
            this.billingAddressId = undefined;
            this.shippingAddressId = undefined;
            this.subTotal = undefined;
            this.total = undefined;
            this.status = undefined;
            this.lastUpdated = undefined;
            this.createdAt = undefined;
            this.referenceId = undefined;
            this.email = undefined;
        }
    }
}