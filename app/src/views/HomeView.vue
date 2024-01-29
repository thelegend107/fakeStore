<script setup>
import Section from '@/components/Section.vue';
import ProductListCarousel from '@/components/ProductListCarousel.vue';
import { categories, bestBuy } from '@/bestBuy';
import svgIcon from '@jamescoyle/vue-icon';
import { mdiSale, mdiArrowTopRight } from '@mdi/js';
</script>

<template>
    <div class="home-container">
        <Section class="topDeals" :subtext="'BEST BUY'" :title="'TOP DEALS'" :mdiIconPath="mdiSale" :primary="true">
            <Suspense>
                <ProductListCarousel />
            </Suspense>
        </Section>
        <Section :subtext="'BEST BUY'" :title="'CATEGORIES'" :mdiIconPath="mdiArrowTopRight">
            <menu>
                <li @click="bestBuy.goToCategory(index); $router.push({name: 'shop', params: {categoryId: c.id} })" v-for="(c, index) in categories" :key="c.id">
                    <svg-icon class="icon" type="mdi" :path="c.iconPath" />
                    <p>{{ c.name }}</p>
                </li>
            </menu>
        </Section>
    </div>
</template>

<style lang="scss" scoped>
.home-container {
    min-height: calc(100vh - 50px);
    display: flex;
    flex-direction: column;

    menu {
        display: flex;
        justify-content: space-between;
        padding: 0;
        flex-wrap: wrap;
        text-align: center;
        gap: 10px;

        li {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            box-shadow: var(--box-shadow-1);
            border-radius: 15px;
            flex-grow: 1;
            background-color: rgba(var(--primaryC), 0.5);
            backdrop-filter: 5px;
            list-style: none;
            padding: 1.5dvi 2.65dvi;
            transition: all 0.3s ease;
        }

        li:hover {
            cursor: pointer;
            background-color: var(--primary);
        }
    }
}
</style>
