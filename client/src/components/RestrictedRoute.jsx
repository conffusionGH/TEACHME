import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function RestrictedRoute({ allowedRoles }) {
  const { currentUser } = useSelector((state) => state.user);
  
  if (!currentUser || !allowedRoles.includes(currentUser.roles)) {
    return <Navigate to="/" />;
  }
  
  return <Outlet />;
}