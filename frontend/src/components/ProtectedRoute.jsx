import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();
  const location = useLocation();

  const normalizedRole = user ? String(user.role).toLowerCase() : '';

  if (!user) {
    return <Navigate to={location.pathname.startsWith('/admin') ? '/admin/login' : '/login'} state={{ from: location }} replace />;
  }

  if (allowedRole && normalizedRole !== String(allowedRole).toLowerCase()) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-center text-white">
        <div className="max-w-md">
          <h1 className="text-3xl font-bold">Access Denied</h1>
          <p className="mt-3 text-slate-300">You are not authorized to access this page.</p>
          <Link to="/dashboard" className="mt-6 inline-flex rounded-lg bg-white px-4 py-2 font-semibold text-slate-900">Return to student dashboard</Link>
        </div>
      </main>
    );
  }

  return children;
}
