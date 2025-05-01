import { lazy } from 'react';

const routes = [
  {
    path: '/',
    component: lazy(() => import('../pages/Home')),
    exact: true,
  },
  {
    path: '/auth/*',
    component: lazy(() => import('../features/auth/AuthRoutes')),
  },
  // Add other routes
];

export default routes;