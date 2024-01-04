<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
defineProps({
    products: Array
})
</script>

<template>
    <div class="products">
        <div class="product" v-for="p in products" :key="p.sku">
            <img :src="p.image" :alt="p.sku">
            <div class="product-info">
                <p v-for="n in p.name.split(' - ').slice(0, 2)" :key="n[0]">{{ n }}</p>
                <div class="salePrice">
                    <div v-if="p.onSale">
                        <s style="color: lightcoral;">${{ p.regularPrice }}</s>
                        <p style="color: lightgreen;">-%{{ p.percentSavings }}</p>
                    </div>
                    <b class="price">${{ p.salePrice }}</b>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.products {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1rem;

    .product {
        width: 200px;
        height: 400px;
        overflow: hidden;
        border-radius: 10px;
        background-color: var(--vt-c-black);
        display: flex;
        flex-direction: column;
        font-size: 12px;
        flex-grow: 1;

        img {
            height: 230px;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
        }

        .product-info {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 0.5rem 0.75rem 0.25rem 0.75rem;
        }
    }
}
</style>