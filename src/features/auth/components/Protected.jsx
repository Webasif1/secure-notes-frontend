import { Navigate, useLocation } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import FullPageLoader from "./FullPageLoader";
import { EmptyState } from "../../shared/components/States";

// frontend guard only for UX, the backend checks every request again
const Protected = ({ children, role }) => {
  const { user, initializing, loggedOut } = useAuth();
  const location = useLocation();

  if (initializing) return <FullPageLoader />;

  if (!user) {
    // remember the page so we can come back after login (not after a normal logout)
    return <Navigate to="/login" replace state={loggedOut ? null : { from: location.pathname + location.search }} />;
  }

  if (role && user.role !== role) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="Admins only"
        description="You don't have permission to view this page."
      />
    );
  }

  return children;
};

export default Protected;
