import PropTypes from 'prop-types';
import { Container, Alert, AlertTitle } from '@mui/material';
// hooks
import useAuth from '../hooks/useAuth';
// components
import LoadingScreen from '../components/LoadingScreen';
// ----------------------------------------------------------------------

RoleBasedGuard.propTypes = {
  accessibleRoles: PropTypes.array, // Example ['admin', 'leader']
  children: PropTypes.node
};

export default function RoleBasedGuard({ accessibleRoles, children }) {
  const { user, isInitialized, isAuthenticated } = useAuth();

  if (!isInitialized) {
    return <LoadingScreen fullScreen />;
  }

  if (!isAuthenticated || (isAuthenticated && !accessibleRoles.includes(user.role))) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Tẹt tẹt</AlertTitle>
          Bạn không có quyền truy cập vào trang này.
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
}
