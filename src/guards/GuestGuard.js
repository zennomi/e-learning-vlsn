import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default function GuestGuard({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate(-1);
  }

  return <>{children}</>;
}
