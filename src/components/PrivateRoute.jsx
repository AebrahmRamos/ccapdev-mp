import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

const PrivateRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Small delay to ensure localStorage is checked after hydration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or a better loading component
  }

  const token = localStorage.getItem('userData');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};