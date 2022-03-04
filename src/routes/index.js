import { Suspense, lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
import RoleBasedGuard from '../guards/RoleBasedGuard';
// components
import LoadingScreen from '../components/LoadingScreen';
// paths
import { PATH_LEARNING } from './paths';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        // {
        //   path: 'register',
        //   element: (
        //     <GuestGuard>
        //       <Register />
        //     </GuestGuard>
        //   ),
        // },
      ],
    },
    {
      path: PATH_LEARNING.test.do,
      element: <AuthGuard><TestDoing /></AuthGuard>
    },
    {
      path: '/demo',
      element: <Demo />
    },
    {
      path: '/loading',
      element: <LoadingScreen fullScreen />
    },
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to={PATH_LEARNING.question.root} replace />, index: true },
        { path: PATH_LEARNING.root, element: <Navigate to={PATH_LEARNING.question.root} replace />, index: true },
        { path: PATH_LEARNING.question.root, element: <Questions /> },
        { path: PATH_LEARNING.question.id, element: <Question /> },
        { path: PATH_LEARNING.question.edit, element: <RoleBasedGuard accessibleRoles={['admin', 'mod']}><EditQuestion /></RoleBasedGuard> },
        { path: PATH_LEARNING.question.create, element: <RoleBasedGuard accessibleRoles={['admin', 'mod']}><NewQuestion /></RoleBasedGuard> },
        { path: PATH_LEARNING.test.root, element: <Tests /> },
        { path: PATH_LEARNING.test.id, element: <Test /> },
        { path: PATH_LEARNING.test.detail, element: <RoleBasedGuard accessibleRoles={['admin', 'mod']}><TestDetail /></RoleBasedGuard> },
        { path: PATH_LEARNING.test.edit, element: <RoleBasedGuard accessibleRoles={['admin', 'mod']}><EditTest /></RoleBasedGuard> },
      ],
    },
    {
      path: '/',
      element: <Navigate to={PATH_LEARNING.root} replace />
    },
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// Authentication
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
// Learning
const Questions = Loadable(lazy(() => import('../pages/learning/Questions')));
const Question = Loadable(lazy(() => import('../pages/learning/Question')));
const NewQuestion = Loadable(lazy(() => import('../pages/learning/NewQuestion')));
const EditQuestion = Loadable(lazy(() => import('../pages/learning/EditQuestion')));
const Tests = Loadable(lazy(() => import('../pages/learning/Tests')));
const Test = Loadable(lazy(() => import('../pages/learning/Test')));
const EditTest = Loadable(lazy(() => import('../pages/learning/EditTest')));
const TestDoing = Loadable(lazy(() => import('../pages/learning/TestDoing')));
const TestDetail = Loadable(lazy(() => import('../pages/learning/TestDetail')));
// Dashboard
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
const Demo = Loadable(lazy(() => import('../pages/Demo')));
