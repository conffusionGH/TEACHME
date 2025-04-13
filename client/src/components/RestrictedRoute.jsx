import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function RestrictedRoute({ allowedRoles }) {
  const { currentUser } = useSelector((state) => state.user);
  
  // If no user or user's role isn't in allowedRoles, redirect
  if (!currentUser || !allowedRoles.includes(currentUser.roles)) {
    return <Navigate to="/" />;
  }
  
  return <Outlet />;
}