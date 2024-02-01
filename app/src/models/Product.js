export default class Product {
    constructor(obj) {
        if (obj)
            Object.assign(this, obj);
        else {
            this.sku = undefined,
            this.manufacturer = undefined,
            this.name = undefined,
            this.modelNumber = undefined,
            this.description = undefined,
            this.shortDescription = undefined,
            this.longDescription = undefined,
            this.onSale = undefined,
            this.freeShipping = undefined,
            this.color = undefined,
            this.condition = undefined,
            this.salePrice = undefined,
            this.regularPrice = undefined,
            this.percentSavings = undefined,
            this.customerReviewAverage = undefined,
            this.customerReviewCount = undefined,
            this.image = undefined,
            this.productVariations = undefined,
            this.shipping = undefined
        }
    }
}