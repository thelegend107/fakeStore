// Product API Provided by BestBuy
// Link: https://bestbuyapis.github.io/bby-query-builder/
import axios from 'axios'

export const categories = [
    { id: 'all', name: 'All' },
    { id: 'abcat0501000', name: 'Desktops & All-in-One Computers' },
    { id: 'abcat0502000', name: 'Laptops' },
    { id: 'abcat0101000', name: 'TVs' },
    { id: 'abcat0204000', name: 'Headphones' },
    { id: 'pcmcat241600050001', name: 'Home Audio' }
]

export const searchFields = [
    'name',
    'sku'
]

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

export async function getProductsByCategory(categoryId, page=1, pageSize=10, searchTerm=null) {
    let url = generateUrl(baseUrl, categoryId, searchTerm);

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

export async function getProductsForAllCategories(page=1, pageSize=10, searchTerm=null) {
    let url = generateUrl(baseUrl, null, searchTerm);

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

        data.totalPages = data.totalPages == 0 ? 1 : data.totalPages;

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
        
        data.totalPages = data.totalPages == 0 ? 1 : data.totalPages;

        return data
    } catch (error) {
        console.log(error)
    }
}

function cleanUpSearchTerm(searchTerm){
    if (searchTerm)
        return searchTerm.replace(/\s+/g,' ').trim().split(' ');
    else
        return searchTerm;
}

function generateUrl(baseUrl, categoryId, searchTerm) {
    let url = baseUrl;
    url += '('

    // Categories
    if (categoryId) {
        url += '(categoryPath.id=' + categoryId + ')';
    }
    else {
        let categoriesQueryParams = [];
        categories.forEach(c => {
            categoriesQueryParams.push('categoryPath.id=' + c.id);
        });

        url += '(' + categoriesQueryParams.join('|') + ')';
    }

    // Search Term
    if (searchTerm) {
        let searchTermArray = [];
        searchTerm = cleanUpSearchTerm(searchTerm);
        searchFields.forEach(field => {
            searchTerm.forEach(term => {
                if (field == 'sku'){
                    if (parseInt(term))
                        searchTermArray.push(field + '=' + parseInt(term));
                }
                else {
                    searchTermArray.push(field + '=' + term + '*');
                }
            });
        })

        url += '&(' + searchTermArray.join('|') + ')';
    }
    
    url += ')';

    return url;
}
