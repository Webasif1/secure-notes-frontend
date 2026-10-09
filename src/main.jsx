import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext.jsx';
import Layout from './components/Layout.jsx';
import Guard from './components/Guard.jsx';
import AuthPage from './pages/Login.jsx';
import Notes from './pages/Notes.jsx';
import Posts from './pages/Posts.jsx';
import UserPosts from './pages/UserPosts.jsx';
import Interests from './pages/Interests.jsx';
import Profile from './pages/Profile.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import AdminNotes from './pages/AdminNotes.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/notes" replace />} />
            <Route path="login" element={<AuthPage mode="login" />} />
            <Route path="register" element={<AuthPage mode="register" />} />
            <Route path="posts" element={<Posts />} />
            <Route path="users/:userId/posts" element={<UserPosts />} />
            <Route path="notes" element={<Guard><Notes /></Guard>} />
            <Route path="interests" element={<Guard><Interests /></Guard>} />
            <Route path="profile" element={<Guard><Profile /></Guard>} />
            <Route path="admin/users" element={<Guard role="admin"><AdminUsers /></Guard>} />
            <Route path="admin/notes" element={<Guard role="admin"><AdminNotes /></Guard>} />
            <Route path="*" element={<p>Page not found.</p>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
