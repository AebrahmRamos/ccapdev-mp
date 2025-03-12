import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// const PrivateRoute = ({ children }) => {
//   const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
//   return isLoggedIn ? children : <Navigate to="/login" />;
// };


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('userData');

  if (!token) {
    // Redirect to login if no token exists
    return <Navigate to="/login" replace />;
  }

  return children;
};


export default PrivateRoute;

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};