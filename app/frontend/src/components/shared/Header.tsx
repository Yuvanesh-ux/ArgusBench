import { Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b">
      <Link to="/" className="text-xl font-semibold text-primary-600">TaskFlow</Link>
      <nav className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button className="px-3 py-1.5 rounded bg-primary-600 text-white" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-primary-600">Login</Link>
            <Link to="/register" className="text-sm text-primary-600">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}


