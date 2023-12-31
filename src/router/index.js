import { createRouter, createWebHistory } from 'vue-router'
import HomeApp from '../HomeApp.vue'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: HomeApp,
            children: [
                { path: '/', name: 'home', component: HomeView, props: true },
                { path: '/about', name: 'about', component: AboutView }
            ]
        }
    ]
})

export default router
