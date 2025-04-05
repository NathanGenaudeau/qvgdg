import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import Manche1_2 from '../components/Manche1-2.vue';
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
            path: '/manche1-2',
            name: 'Manche 1-2',
            component: Manche1_2,
        },
        {
            path: '/manche3',
            name: 'Manche 3',
            component: Manche3,
        },
        {
            path: '/manche4',
            name: 'Manche 4',
            component: Manche4,
        },
        {
            path: '/manche5',
            name: 'Manche 5',
            component: Manche5,
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/',
        },
    ],
});

export default router;