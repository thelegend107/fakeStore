// Product API Provided by BestBuy
// Link: https://bestbuyapis.github.io/bby-query-builder/
import axios from 'axios';
import { reactive } from "vue";
import { mdiDesktopTowerMonitor, mdiHeadphones, mdiLaptop, mdiSpeaker, mdiStore, mdiTelevision } from '@mdi/js';
import debounce from 'lodash.debounce';

// API categories of interest
export const categories = [
    { id: 'all', name: 'All', iconPath: mdiStore },
    { id: 'abcat0501000', name: 'Desktops & All-in-One Computers', iconPath: mdiDesktopTowerMonitor },
    { id: 'abcat0502000', name: 'Laptops', iconPath: mdiLaptop },
    { id: 'abcat0101000', name: 'TVs', iconPath: mdiTelevision },
    { id: 'abcat0204000', name: 'Headphones', iconPath: mdiHeadphones },
    { id: 'pcmcat241600050001', name: 'Home Audio', iconPath: mdiSpeaker }
];

// API default values
const dateFilter = new Date().getFullYear() - 2;
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
    'shippingWeight',
    'warrantyLabor',
    'warrantyParts',
    'includedItemList'
];

const defaultShow = propertyArray.join(',');

export const bestBuy = reactive({
    searchTerm: "",
    loading: false,
    mainCategory: categories[0],
    products: [],
    currentPage: 1,
    totalPages: 1,
    pageSize: 8,

    async getTopDeals(pageSize=10) {
        this.loading = true;
        return await this.callBestBuyProductsAPI(null, categories[0].id, "", "dollarSavings.desc", 1, pageSize, false);
    },

    async getProduct(productSku) {
        this.loading = true;
        return await this.callBestBuyProductsAPI(productSku);
    },

    goToCategory(categoryIndex) {
        this.loading = true;
        if (this.mainCategory.id != categories[categoryIndex].id) {
            this.mainCategory = categories[categoryIndex];
            this.currentPage = 1;
        }
        this.reloadProductsFaster();
    },

    searchRequest(searchTerm) {
        this.loading = true;
        this.searchTerm = searchTerm;
        this.currentPage = 1;
        this.reloadProductsFaster();
    },

    pageNavigation(num) {
        this.loading = true;
        if (this.currentPage == this.totalPages && num > 0)
            this.currentPage = 1;
        else if (this.currentPage == 1 && num < 0)
            this.currentPage = this.totalPages;
        else if (num > 0)
            this.currentPage++;
        else
            this.currentPage--;

        this.reloadProducts();
    },

    pageNavigationInput(input) {
        this.loading = true;
        if (input > this.totalPages)
            this.currentPage = 1;
        else if (input < 1)
            this.currentPage = this.totalPages;
        else
            this.currentPage = input;

        this.reloadProducts();
    },

    async callBestBuyProductsAPI(productSku=null, category=this.mainCategory.id, searchTerm=this.searchTerm, pSort=defaultSort, page=this.currentPage, pageSize=this.pageSize, primary=true) {
        let url = '';

        if (productSku) {
            url = baseUrl + '/' + productSku + '.' + defaultFormat;
        }
        else
            url = generateUrl(baseUrl, category, searchTerm);
    
        try {
            const { data } = await axios.get(url, {
                params: {
                    apiKey: apiKey,
                    format: defaultFormat,
                    show: defaultShow,
                    sort: pSort,
                    pageSize: pageSize,
                    page: page
                }
            })
    
            data.totalPages = data.totalPages == 0 ? 1 : data.totalPages;

            if (primary) {
                this.products = data.products;
                this.totalPages = data.totalPages;
                this.loading = false
            }

            return data;
    
        } catch (error) {
            console.log(error)
        }
    },
    reloadProducts: debounce(async () => {
        await bestBuy.callBestBuyProductsAPI();
    }, 500),
    reloadProductsFaster: debounce(async () => {
        await bestBuy.callBestBuyProductsAPI();
    }, 200),
});


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
    url += '&(startDate>=' + dateFilter + '-01-01)'

    // Search Term
    if (searchTerm) {
        let searchTermArray = [];
        searchTerm = cleanUpSearchTerm(searchTerm);
        searchTerm.forEach(term => {
            searchTermArray.push('search=' + term);
        });
        url += '&(' + searchTermArray.join('&') + ')';
    }
    
    url += ')';

    return url;
};