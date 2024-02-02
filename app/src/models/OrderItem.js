export default class OrderItem {
    constructor(obj) {
        if (obj)
            Object.assign(this, obj);
        else {
            this.id = undefined;
            this.userId = undefined;
            this.orderId = undefined;
            this.sku = undefined;
            this.name = undefined;
            this.quantity = undefined;
            this.unitPrice = undefined;
            this.discount = undefined;
            this.salePrice = undefined;
            this.subTotal = undefined;
            this.total = undefined;
            this.imageUrl = undefined;
            this.lastUpdated = undefined;
            this.createdAt = undefined;
        }
    }
}