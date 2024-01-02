import { createRouter, createWebHistory } from 'vue-router'
import HomeApp from '../HomeApp.vue'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import ShopView from '@/views/ShopView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: HomeApp,
            children: [
                { path: '/', name: 'home', component: HomeView, props: true },
                { path: '/shop', name: 'shop', component: ShopView, props: true },
                { path: '/about', name: 'about', component: AboutView }
            ]
        }
    ]
})

export default router
