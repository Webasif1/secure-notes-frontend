import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <>
      <nav>
        <strong>SecureNotes</strong>
        <NavLink to="/posts">Posts</NavLink>
        {user && (
          <>
            <NavLink to="/notes">My Notes</NavLink>
            <NavLink to="/interests">Interests</NavLink>
            <NavLink to="/profile">Profile</NavLink>
          </>
        )}
        {user?.role === 'admin' && (
          <>
            <NavLink to="/admin/users">Admin: Users</NavLink>
            <NavLink to="/admin/notes">Admin: All Notes</NavLink>
          </>
        )}
        <span className="spacer" />
        {user ? (
          <>
            <span>
              {user.name} ({user.role})
            </span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}
