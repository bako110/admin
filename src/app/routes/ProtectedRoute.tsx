import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStore } from '../../store/auth.store';

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.user?.role);

  if (!isAuthenticated || (role !== 'admin' && role !== 'moderator')) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
