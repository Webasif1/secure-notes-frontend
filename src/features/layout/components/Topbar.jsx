import { useNavigate } from "react-router-dom";
import { Menu, Plus } from "lucide-react";
import Button from "../../shared/components/Button";
import ProfileMenu from "./ProfileMenu";

const Topbar = ({ onOpenMenu }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-bg/80 px-4 backdrop-blur-md sm:px-6">
      <button
        onClick={onOpenMenu}
        aria-label="Open navigation"
        className="-ml-1 rounded-lg p-2 text-muted transition-colors hover:bg-subtle hover:text-text lg:hidden"
      >
        <Menu size={20} />
      </button>

      <div className="ml-auto flex items-center gap-2">
        <Button size="sm" onClick={() => navigate("/notes/new")} className="h-9">
          <Plus size={16} />
          <span className="hidden sm:inline">New note</span>
        </Button>
        <ProfileMenu />
      </div>
    </header>
  );
};

export default Topbar;
