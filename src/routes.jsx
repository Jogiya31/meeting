import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';
import { useAuth } from './contexts/AuthContext';

const AuthGuard = ({ children }) => {
  const { loggedIn } = useAuth();
  return loggedIn ? children : <Navigate to="/meetings/login" />;
};

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            exact={route.exact}
            key={i}
            path={route.path}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const Dashboard = lazy(() => import('./pages/dashboard'));
const Users = lazy(() => import('./pages/users'));
const Settings = lazy(() => import('./pages/settings'));
const NewPoints = lazy(() => import('./pages/mom'));
const DraftMeeting = lazy(() => import('./pages/mom/draftMeeting'));
const ViewList = lazy(() => import('./pages/mom/viewList'));
const Attendance = lazy(() => import('./pages/mom/attendance'));
const Login = lazy(() => import('./pages/auth/SignIn'));
const SignOut = lazy(() => import('./pages/auth/SignOut'));
const NotFound = lazy(() => import('./pages/NotFound'));

const routes = [
  {
    exact: true,
    path: '/',
    element: () => <Navigate to="/meetings/login" />
  },
  {
    exact: true,
    path: '/meetings/login',
    element: Login
  },
  {
    exact: true,
    path: '/meetings/logout',
    element: SignOut
  },
  {
    path: '*',
    layout: AdminLayout,
    guard: AuthGuard,
    routes: [
      {
        exact: true,
        path: '/meetings',
        element: Dashboard
      },
      {
        exact: true,
        path: '/meetings/dashboard',
        element: Dashboard
      },
      {
        exact: true,
        path: '/meetings/users',
        element: Users
      },
      {
        exact: true,
        path: '/meetings/draft',
        element: DraftMeeting
      },
      {
        exact: true,
        path: '/meetings/new',
        element: NewPoints
      },
      {
        exact: true,
        path: '/meetings/view',
        element: ViewList
      },
      {
        exact: true,
        path: '/meetings/meeting-attendance',
        element: Attendance
      },
      {
        exact: true,
        path: '/meetings/masterSettings',
        element: Settings
      },
      {
        path: '*',
        element: NotFound // <-- Set NotFound page for unknown routes
      }
    ]
  }
];

export default routes;
