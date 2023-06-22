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
import { PATH_ADMIN, PATH_LEARNING, PATH_PAGE } from './paths';

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
      ],
    },
    {
      path: PATH_LEARNING.test.do(":id"),
      element: (
        <AuthGuard>
          <TestDoing replace />
        </AuthGuard>
      ),
    },
    {
      path: PATH_LEARNING.test.pdf,
      element: (
        <AuthGuard>
          <TestViewPDF replace />
        </AuthGuard>
      ),
    },
    {
      path: '/demo',
      element: <Demo />,
    },
    {
      path: '/loading',
      element: <LoadingScreen fullScreen />,
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to={PATH_LEARNING.test.root} replace />, index: true },
        {
          path: PATH_ADMIN.root,
          element: (
            <RoleBasedGuard accessibleRoles={['admin', 'mod']}>
              <Admin />
            </RoleBasedGuard>
          ),
        },
        {
          path: PATH_ADMIN.importTest,
          element: (
            <RoleBasedGuard accessibleRoles={['admin', 'mod']}>
              <ImportTest />
            </RoleBasedGuard>
          ),
        },
        {
          path: '/profile',
          element: (
            <AuthGuard>
              <Profile />
            </AuthGuard>
          ),
        },
        // question
        { path: PATH_LEARNING.root, element: <Navigate to={PATH_LEARNING.question.root} replace />, index: true },
        { path: PATH_LEARNING.question.root, element: <Questions /> },
        {
          path: PATH_LEARNING.question.edit,
          element: (
            <RoleBasedGuard accessibleRoles={['admin', 'mod']}>
              <EditQuestion />
            </RoleBasedGuard>
          ),
        },
        {
          path: PATH_LEARNING.question.create,
          element: (
            <RoleBasedGuard accessibleRoles={['admin', 'mod']}>
              <NewQuestion />
            </RoleBasedGuard>
          ),
        },
        { path: PATH_LEARNING.question.id, element: <Question /> },
        // test
        { path: PATH_LEARNING.test.root, element: <Tests /> },
        {
          path: PATH_LEARNING.test.create,
          element: (
            <RoleBasedGuard accessibleRoles={['admin', 'mod']}>
              <NewTest />
            </RoleBasedGuard>
          ),
        },
        {
          path: PATH_LEARNING.test.autoCreate,
          element: (
            <RoleBasedGuard accessibleRoles={['admin', 'mod']}>
              <AutoCreateTest />
            </RoleBasedGuard>
          ),
        },
        { path: PATH_LEARNING.test.id, element: <Test /> },
        {
          path: PATH_LEARNING.test.detail,
          element: (
            <AuthGuard>
              <TestDetail />
            </AuthGuard>
          ),
        },
        {
          path: PATH_LEARNING.test.edit,
          element: (
            <RoleBasedGuard accessibleRoles={['admin', 'mod']}>
              <EditTest />
            </RoleBasedGuard>
          ),
        },
      ],
    },
    {
      path: '/',
      element: <Navigate to={PATH_LEARNING.root} replace />,
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
// const Register = Loadable(lazy(() => import('../pages/auth/Register')));
// Learning
// - Question
const Questions = Loadable(lazy(() => import('../pages/learning/question/Questions')));
const Question = Loadable(lazy(() => import('../pages/learning/question/Question')));
const NewQuestion = Loadable(lazy(() => import('../pages/learning/question/NewQuestion')));
const EditQuestion = Loadable(lazy(() => import('../pages/learning/question/EditQuestion')));
// - Test
const Tests = Loadable(lazy(() => import('../pages/learning/test/Tests')));
const Test = Loadable(lazy(() => import('../pages/learning/test/Test')));
const NewTest = Loadable(lazy(() => import('../pages/learning/test/NewTest')));
const EditTest = Loadable(lazy(() => import('../pages/learning/test/EditTest')));
const AutoCreateTest = Loadable(lazy(() => import('../pages/learning/test/AutoCreateTest')));
const TestDoing = Loadable(lazy(() => import('../pages/learning/test/TestDoing')));
const TestDetail = Loadable(lazy(() => import('../pages/learning/test/TestDetail')));
const TestViewPDF = Loadable(lazy(() => import('../pages/learning/test/TestViewPDF')));
// Page
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
const Demo = Loadable(lazy(() => import('../pages/Demo')));
const Admin = Loadable(lazy(() => import('../pages/admin/Admin')));
const ImportTest = Loadable(lazy(() => import('../pages/admin/ImportTest')));
const Profile = Loadable(lazy(() => import('../pages/Profile')));
