import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import FullPageLoader from "./FullPageLoader";

// login / register pages: if already logged in go to the app
const GuestOnly = ({ children }) => {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) return <FullPageLoader />;
  if (user) return <Navigate to={location.state?.from || "/notes"} replace />;

  return children;
};

export default GuestOnly;
