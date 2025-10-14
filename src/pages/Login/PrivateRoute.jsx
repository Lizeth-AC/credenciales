import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem('token');
  const expiry = localStorage.getItem('token_expiry');

  const isExpired = expiry && new Date() > new Date(expiry);

  if (!token || isExpired) {
    localStorage.clear();
    sessionStorage.clear();
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;