// Product API Provided by BestBuy
// Link: https://bestbuyapis.github.io/bby-query-builder/
import axios from 'axios';

// API categories of interest
export const categories = [
    { id: 'all', name: 'All' },
    { id: 'abcat0501000', name: 'Desktops & All-in-One Computers' },
    { id: 'abcat0502000', name: 'Laptops' },
    { id: 'abcat0101000', name: 'TVs' },
    { id: 'abcat0204000', name: 'Headphones' },
    { id: 'pcmcat241600050001', name: 'Home Audio' }
];

// API search fields
export const searchFields = [
    'name',
    'sku'
];

// Number format defaults
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const percentage = new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })

// API default values
const currentYear = new Date().getFullYear() - 2;
const baseUrl = 'https://api.bestbuy.com/v1/products'
const apiKey = 'qhqws47nyvgze2mq3qx4jadt'
const defaultSort = 'sku.desc'
const defaultFormat = 'json'
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
    'shipping'
];

const defaultShow = propertyArray.join(',');

// Retrieves Top Deals on Best Buy products (default: Top 10)
export async function getTopDealProducts(pageSize) {
    let url = generateUrl(baseUrl, categories[0].id, null);

    return await callBestBuyProductsAPI(url, 'dollarSavings.desc', defaultShow, null, pageSize);
};

// Retrieves Best Buy products by CategoryId
export async function getProductsByCategory(categoryId, page, pageSize, searchTerm=null) {
    let url = generateUrl(baseUrl, categoryId, searchTerm);

    return await callBestBuyProductsAPI(url, defaultSort, defaultShow, page, pageSize);
};

// Retrieves Best Buy product by sku
export async function getProductBySku(sku) {
    let url = baseUrl + '/' + sku + '.' + defaultFormat

    return await callBestBuyProductsAPI(url, defaultSort, defaultShow, null, null);
};

async function callBestBuyProductsAPI(url, pSort=defaultSort, pShow=defaultShow, page=1, pageSize=10) {
    try {
        const { data } = await axios.get(url, {
            params: {
                apiKey: apiKey,
                format: defaultFormat,
                sort: pSort,
                show: pShow,
                pageSize: pageSize,
                page: page
            }
        })

        data.totalPages = data.totalPages == 0 ? 1 : data.totalPages;
        if (data.products.length > 0){
            data.products.forEach(x => {
                x.regularPrice = currency.format(x.regularPrice);
                x.salePrice = currency.format(x.salePrice);
                x.percentSavings = percentage.format(x.percentSavings/100);
            });
        }

        return data

    } catch (error) {
        console.log(error)
    }
};

function cleanUpSearchTerm(searchTerm){
    if (searchTerm)
        return searchTerm.replace(/\s+/g,' ').trim().split(' ');
    else
        return searchTerm;
};

function generateUrl(baseUrl, categoryId, searchTerm) {
    let url = baseUrl;
    url += '('

    // Categories
    if (categoryId == 'all') {
        let categoriesQueryParams = [];
        categories.forEach(c => {
            categoriesQueryParams.push('categoryPath.id=' + c.id);
        });

        url += '(' + categoriesQueryParams.join('|') + ')';
    }
    else {
        url += '(categoryPath.id=' + categoryId + ')';
    }

    // Start Date
    url += '&(startDate>=' + currentYear + '-01-01)'

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
};
