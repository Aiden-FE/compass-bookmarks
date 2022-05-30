import { createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress';
import {IS_PROD} from "~/config";

const Home = () => import('~/views/home/home.vue');
const User = () => import('~/views/user/user.vue');

const routes = [
  { path: '/', component: Home },
  { path: '/user', component: User },
];

const router = createRouter({
  history: createWebHistory(IS_PROD ? '/bookmarks/' : '/'),
  routes,
});

router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
