import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import IntroView from '../views/IntroView.vue'

const routes: Array < RouteRecordRaw > = [{
        path: '/',
        name: 'IntroView',
        component: IntroView
    },
    {
        path: '/snake',
        name: 'GameView',
        component: () => import('../views/GameView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router