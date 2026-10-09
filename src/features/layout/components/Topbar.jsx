import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Menu, Plus, Search } from "lucide-react";
import Button from "../../shared/components/Button";
import ProfileMenu from "./ProfileMenu";

// the search box always searches "my notes" (it opens /notes?q=...)
const Topbar = ({ onOpenMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const onNotesPage = location.pathname === "/notes";
  const [query, setQuery] = useState(onNotesPage ? params.get("q") || "" : "");
  const inputRef = useRef(null);

  // keep the box in sync when the url changes
  useEffect(() => {
    setQuery(onNotesPage ? params.get("q") || "" : "");
  }, [onNotesPage, params]);

  // press "/" to focus search
  useEffect(() => {
    const onKey = (e) => {
      const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleChange = (value) => {
    setQuery(value);
    navigate(value ? `/notes?q=${encodeURIComponent(value)}` : "/notes", { replace: onNotesPage });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-bg/80 px-4 backdrop-blur-md sm:px-6">
      <button
        onClick={onOpenMenu}
        aria-label="Open navigation"
        className="-ml-1 rounded-lg p-2 text-muted transition-colors hover:bg-subtle hover:text-text lg:hidden"
      >
        <Menu size={20} />
      </button>

      <div className="relative max-w-md flex-1">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          ref={inputRef}
          type="search"
          aria-label="Search your notes"
          placeholder="Search your notes..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-10 text-sm text-text placeholder:text-muted/70 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-border px-1.5 text-[10px] text-muted sm:block">
          /
        </kbd>
      </div>

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
