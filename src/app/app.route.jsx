import { createBrowserRouter, Navigate } from "react-router-dom";
import Protected from "../features/auth/components/Protected";
import GuestOnly from "../features/auth/components/GuestOnly";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import AppLayout from "../features/layout/AppLayout";
import Notes from "../features/notes/pages/Notes";
import NoteDetails from "../features/notes/pages/NoteDetails";
import NoteEditor from "../features/notes/pages/NoteEditor";
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import AdminNotes from "../features/admin/pages/AdminNotes";
import Posts from "../features/community/pages/Posts";
import UserPosts from "../features/community/pages/UserPosts";
import Interests from "../features/community/pages/Interests";
import Profile from "../features/profile/pages/Profile";
import NotFound from "./NotFound";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <GuestOnly>
        <Login />
      </GuestOnly>
    ),
  },
  {
    path: "/register",
    element: (
      <GuestOnly>
        <Register />
      </GuestOnly>
    ),
  },
  {
    path: "/",
    element: (
      <Protected>
        <AppLayout />
      </Protected>
    ),
    children: [
      { index: true, element: <Navigate to="/notes" replace /> },
      { path: "notes", element: <Notes /> },
      { path: "notes/new", element: <NoteEditor key="new" /> },
      { path: "notes/:id", element: <NoteDetails /> },
      { path: "notes/:id/edit", element: <NoteEditor key="edit" /> },
      { path: "community", element: <Posts /> },
      { path: "community/user/:userId", element: <UserPosts /> },
      { path: "interests", element: <Interests /> },
      { path: "profile", element: <Profile /> },
      {
        path: "admin",
        element: (
          <Protected role="admin">
            <AdminDashboard />
          </Protected>
        ),
      },
      {
        path: "admin/notes",
        element: (
          <Protected role="admin">
            <AdminNotes />
          </Protected>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
