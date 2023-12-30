// Product API Provided by BestBuy
// Link: https://bestbuyapis.github.io/bby-query-builder/
import axios from 'axios'

const baseUrl = 'https://api.bestbuy.com/v1/products'
const apiKey = 'qhqws47nyvgze2mq3qx4jadt'
const sort = 'sku.desc'
const format = 'json'
const propertyArray = [
    'sku',
    'manufacturer',
    'name',
    'modelNumber',
    'description',
    'shortDescription',
    'longDescription',
    'onSale',
    'freeShipping',
    'color',
    'condition',
    'salePrice',
    'regularPrice',
    'percentSavings',
    'customerReviewAverage',
    'customerReviewCount',
    'image',
    'largeFrontImage',
    'shipping'
]

const show = propertyArray.join(',')

export async function getProductsByCategory(categoryId, page=1, pageSize=10) {
    let url = baseUrl + '(categoryPath.id=' + categoryId + ')'
    try {
        const { data } = await axios.get(url, {
            params: {
                apiKey: apiKey,
                format: format,
                sort: sort,
                show: show,
                pageSize: pageSize,
                page: page
            }
        })

        return data
    } catch (error) {
        console.log(error)
    }
}

export async function getProductBySku(sku) {
    let url = baseUrl + '/' + sku + '.' + format

    try {
        const { data } = await axios.get(url, {
            params: {
                apiKey: apiKey,
                format: format,
                show: show
            }
        })

        return data
    } catch (error) {
        console.log(error)
    }
}
