import { createRouter, createWebHistory } from 'vue-router'

import HomeApp from '@/HomeApp.vue'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import ShopView from '@/views/ShopView.vue'

import AccountView from '@/views/AccountView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import AccountMessageComponent from '@/components/AccountMessage.vue'


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: HomeApp,
            children: [
                { path: '/', name: 'home', component: HomeView },
                { path: '/shop/:categoryId?', name: 'shop', component: ShopView },
                { path: '/about', name: 'about', component: AboutView },
                { path: '/account', name: 'account', component: AccountView },
                { path: '/account/login', name: 'login', component: LoginView }, 
                { path: '/account/register', name: 'register', component: RegisterView },
                { path: '/account/confirmed', name: 'confirmed', component: AccountMessageComponent }
            ]
        }
    ]
})

export default router
