import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import Game1 from '../components/Game1.vue';
import Game2 from '../components/Game2.vue';
import Configuration from '../components/Configuration.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: Home,
        },
        {
            path: '/game1',
            name: 'Sabotage',
            component: Game1,
        },
        {
            path: '/game2',
            name: 'Finale',
            component: Game2,
        },
        {
            path: '/config',
            name: 'Configuration',
            component: Configuration,
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/',
        },
    ],
});

export default router;