import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';
import { useAuth } from './contexts/AuthContext';

const AuthGuard = ({ children }) => {
  const { loggedIn } = useAuth();
  return loggedIn ? children : <Navigate to="/login" />;
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

// MoM
const Dashboard = lazy(() => import('./pages/MoMPages/dashboard'));
const Users = lazy(() => import('./pages/MoMPages/users'));
const NewPoints = lazy(() => import('./pages/MoMPages/mom'));
const ViewList = lazy(() => import('./pages/MoMPages/mom/viewList'));
const Attendance = lazy(() => import('./pages/MoMPages/mom/attendance'));
const Settings = lazy(() => import('./pages/MoMPages/settings'));

// Tracker
const userDashboard = lazy(() => import('./pages/TaskTracker/dashboard'));
const createDependencies = lazy(() => import('./pages/TaskTracker/createDependencies'));
const CreateTask = lazy(() => import('./pages/TaskTracker/createTask'));
const TaskAssignment = lazy(() => import('./pages/TaskTracker/taskAssignment'));
const TaskApproval = lazy(() => import('./pages/TaskTracker/taskApproval'));
const TaskReport = lazy(() => import('./pages/TaskTracker/taskReport'));
const Tasksetting = lazy(() => import('./pages/TaskTracker/settings'));

//Auth

const Login = lazy(() => import('./pages/auth/SignIn'));
const SignOut = lazy(() => import('./pages/auth/SignOut'));

//Common
const NotFound = lazy(() => import('./pages/NotFound'));

const routes = [
  {
    exact: true,
    path: '/',
    element: () => <Navigate to="/login" />
  },
  {
    exact: true,
    path: '/login',
    element: Login
  },
  {
    exact: true,
    path: '/logout',
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

      /// task tracker urls
      {
        exact: true,
        path: '/tasktracker/dashboard',
        element: userDashboard
      },
      {
        exact: true,
        path: '/tasktracker/users',
        element: Users
      },
      {
        exact: true,
        path: '/tasktracker/Create-Dependancies',
        element: createDependencies
      },
      {
        exact: true,
        path: '/tasktracker/Create-Task',
        element: CreateTask
      },
      {
        exact: true,
        path: '/tasktracker/Task-Approval',
        element: TaskApproval
      },
       {
        exact: true,
        path: '/tasktracker/Task-Assignment',
        element: TaskAssignment
      },
      {
        exact: true,
        path: '/tasktracker/Task-Report',
        element: TaskReport
      },
      {
        exact: true,
        path: '/tasktracker/masterSettings',
        element: Tasksetting
      },

      {
        path: '*',
        element: NotFound // <-- Set NotFound page for unknown routes
      }
    ]
  }
];

export default routes;
