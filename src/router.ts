import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    name: 'notFound',
    path: '/:path(.*)+',
    redirect: {
      name: 'error',
    },
  },
  {
    name: 'error',
    path: '/error',
    component: () => import('@/view/error/index.vue'),
    meta: {
      title: 'notFound',
    },
  },
  {
    path: '/',
    redirect: {
      name: 'home',
    },
  },
  {
    name: 'home',
    path: '/home',
    component: () => import('@/view/home/index.vue'),
    meta: {
      title: '首页',
    },
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(import.meta.env.VITE_APP_BASE_URL),
});

router.beforeEach((to, from, next) => {
  const title = to?.meta?.title;
  if (title) {
    document.title = title as string;
  }
  next();
});

export default router;
