import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  FileText,
  Users,
  LayoutDashboard,
  Files,
  Newspaper,
  Tags,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import Logo from "./Logo";
import Avatar from "../../shared/components/Avatar";
import { useAuth } from "../../auth/hooks/useAuth";
import { getMyNotes } from "../../notes/services/note.api";

const NavItem = ({ to, icon: Icon, label, collapsed, end, onNavigate }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onNavigate}
    title={collapsed ? label : undefined}
    className={({ isActive }) =>
      `group flex h-9 items-center gap-3 rounded-lg px-2.5 text-sm font-medium transition-colors duration-150 ${
        isActive ? "bg-primary-soft text-primary" : "text-muted hover:bg-subtle hover:text-text"
      } ${collapsed ? "justify-center" : ""}`
    }
  >
    <Icon size={18} className="shrink-0" />
    {!collapsed && <span className="truncate">{label}</span>}
  </NavLink>
);

const SectionLabel = ({ children, collapsed }) =>
  collapsed ? (
    <div className="mx-auto my-3 h-px w-6 bg-border" />
  ) : (
    <p className="mb-1 mt-5 px-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted/80">{children}</p>
  );

// the 5 newest notes, refreshed when a note is created / edited / deleted
const RecentNotes = ({ onNavigate }) => {
  const [notes, setNotes] = useState(null);

  useEffect(() => {
    const load = () =>
      getMyNotes({ limit: 5 })
        .then((res) => setNotes(res.notes))
        .catch(() => setNotes([]));
    load();
    window.addEventListener("notes:changed", load);
    return () => window.removeEventListener("notes:changed", load);
  }, []);

  if (!notes) {
    return (
      <div className="space-y-2 px-2.5 py-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-3 animate-pulse rounded bg-subtle" style={{ width: `${90 - i * 15}%` }} />
        ))}
      </div>
    );
  }
  if (!notes.length) return <p className="px-2.5 text-xs text-muted">No notes yet</p>;

  return (
    <ul className="space-y-0.5">
      {notes.map((note) => (
        <li key={note._id}>
          <NavLink
            to={`/notes/${note._id}`}
            onClick={onNavigate}
            className={({ isActive }) =>
              `block truncate rounded-md px-2.5 py-1.5 text-[13px] transition-colors ${
                isActive ? "bg-subtle text-text" : "text-muted hover:bg-subtle hover:text-text"
              }`
            }
          >
            {note.title}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

const Sidebar = ({ collapsed = false, onToggleCollapse, onNavigate, mobile = false }) => {
  const { user, logout } = useAuth();
  const isAdmin = user.role === "admin";

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      initial={false}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="flex h-full flex-col border-r border-border bg-surface"
      aria-label="Sidebar"
    >
      <div className={`flex h-16 items-center ${collapsed ? "justify-center" : "justify-between px-4"}`}>
        <Link to="/notes" onClick={onNavigate} aria-label="SecureNotes home">
          <Logo collapsed={collapsed} />
        </Link>
        {!mobile && !collapsed && (
          <button
            onClick={onToggleCollapse}
            aria-label="Collapse sidebar"
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-subtle hover:text-text"
          >
            <PanelLeftClose size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {!mobile && collapsed && (
          <button
            onClick={onToggleCollapse}
            aria-label="Expand sidebar"
            className="mb-2 flex h-9 w-full items-center justify-center rounded-lg text-muted transition-colors hover:bg-subtle hover:text-text"
          >
            <PanelLeftOpen size={18} />
          </button>
        )}
        <SectionLabel collapsed={collapsed}>Workspace</SectionLabel>
        <NavItem to="/notes" icon={FileText} label="All Notes" collapsed={collapsed} onNavigate={onNavigate} end />

        {!collapsed && (
          <>
            <SectionLabel>Recent</SectionLabel>
            <RecentNotes onNavigate={onNavigate} />
          </>
        )}

        <SectionLabel collapsed={collapsed}>Community</SectionLabel>
        <NavItem to="/community" icon={Newspaper} label="Posts" collapsed={collapsed} onNavigate={onNavigate} />
        <NavItem to="/interests" icon={Tags} label="Interests" collapsed={collapsed} onNavigate={onNavigate} />

        {isAdmin && (
          <>
            <SectionLabel collapsed={collapsed}>Admin</SectionLabel>
            <NavItem to="/admin" icon={LayoutDashboard} label="Overview & Users" collapsed={collapsed} onNavigate={onNavigate} end />
            <NavItem to="/admin/notes" icon={Files} label="All Users' Notes" collapsed={collapsed} onNavigate={onNavigate} />
          </>
        )}
      </nav>

      <div className={`border-t border-border p-3 ${collapsed ? "flex flex-col items-center gap-2" : ""}`}>
        {collapsed ? (
          <>
            <Link to="/profile" onClick={onNavigate} aria-label="Profile" title={user.name}>
              <Avatar name={user.name} size="sm" />
            </Link>
            <button
              onClick={logout}
              aria-label="Log out"
              title="Log out"
              className="rounded-lg p-2 text-muted transition-colors hover:bg-subtle hover:text-danger"
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2.5">
            <Link
              to="/profile"
              onClick={onNavigate}
              className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg p-1.5 transition-colors hover:bg-subtle"
            >
              <Avatar name={user.name} size="sm" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-text">{user.name}</span>
                <span className="block truncate text-xs text-muted">{user.email}</span>
              </span>
            </Link>
            <button
              onClick={logout}
              aria-label="Log out"
              title="Log out"
              className="rounded-lg p-2 text-muted transition-colors hover:bg-subtle hover:text-danger"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
