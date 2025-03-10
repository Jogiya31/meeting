import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

import { BASE_URL } from './config/constant';

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes = [
  {
    exact: 'true',
    path: '/login',
    element: lazy(() => import('./pages/auth/SignIn'))
  },
  {
    exact: 'true',
    path: '/logout',
    element: lazy(() => import('./pages/auth/SignOut'))
  },
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        exact: 'true',
        path: '/dashboard',
        element: lazy(() => import('./pages/dashboard'))
      },

      {
        exact: 'true',
        path: '/users',
        element: lazy(() => import('./pages/users'))
      },
      {
        exact: 'true',
        path: '/newPoints',
        element: lazy(() => import('./pages/mom'))
      },
      {
        exact: 'true',
        path: '/viewPoints',
        element: lazy(() => import('./pages/mom/viewList'))
      },
      {
        exact: 'true',
        path: '/meeting-attendance',
        element: lazy(() => import('./pages/mom/attendance'))
      },
      {
        exact: 'true',
        path: '/settings',
        element: lazy(() => import('./pages/settings'))
      },
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default routes;
