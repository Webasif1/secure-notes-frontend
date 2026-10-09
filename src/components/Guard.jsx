import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Guard({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <p className="error">Admins only.</p>;
  return children;
}
