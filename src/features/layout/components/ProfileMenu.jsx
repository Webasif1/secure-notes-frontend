import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { LogOut, Moon, Sun, UserRound } from "lucide-react";
import Avatar from "../../shared/components/Avatar";
import Badge from "../../shared/components/Badge";
import { useAuth } from "../../auth/hooks/useAuth";
import { useTheme } from "../../shared/hooks/useTheme";

const itemClass =
  "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-text transition-colors hover:bg-subtle focus:bg-subtle focus:outline-none";

const ProfileMenu = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // close on outside click or Esc
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open profile menu"
        className="rounded-full transition-opacity hover:opacity-90"
      >
        <Avatar name={user.name} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-11 z-40 w-60 origin-top-right rounded-xl border border-border bg-surface p-1.5 shadow-xl"
          >
            <div className="flex items-center justify-between gap-2 px-2.5 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text">{user.name}</p>
                <p className="truncate text-xs text-muted">{user.email}</p>
              </div>
              <Badge tone={user.role === "admin" ? "primary" : "neutral"}>{user.role}</Badge>
            </div>
            <div className="my-1 h-px bg-border" />
            <Link role="menuitem" to="/profile" className={itemClass} onClick={() => setOpen(false)}>
              <UserRound size={16} className="text-muted" /> Profile settings
            </Link>
            <button role="menuitem" className={itemClass} onClick={toggleTheme}>
              {theme === "dark" ? <Sun size={16} className="text-muted" /> : <Moon size={16} className="text-muted" />}
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
            <div className="my-1 h-px bg-border" />
            <button role="menuitem" className={`${itemClass} text-danger`} onClick={logout}>
              <LogOut size={16} /> Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileMenu;
