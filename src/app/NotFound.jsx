import { useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";
import Button from "../features/shared/components/Button";
import { EmptyState } from "../features/shared/components/States";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <EmptyState
      icon={Compass}
      title="Page not found"
      description="The page you're looking for doesn't exist."
      action={<Button onClick={() => navigate("/notes")}>Go to my notes</Button>}
    />
  );
};

export default NotFound;
