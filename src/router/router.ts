import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import Manche1 from '../components/Manche1.vue';
import Manche3 from '../components/Manche3.vue';
import Manche4 from '../components/Manche4.vue';
import Manche5 from '../components/Manche5.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: Home,
        },
        {
            path: '/manche1',
            name: 'Manche 1',
            component: Manche1,
        },
        {
            path: '/manche3',
            name: 'Sabotage',
            component: Manche3,
        },
        {
            path: '/manche4',
            name: '4 à la suite',
            component: Manche4,
        },
        {
            path: '/manche5',
            name: 'Finale',
            component: Manche5,
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/',
        },
    ],
});

export default router;