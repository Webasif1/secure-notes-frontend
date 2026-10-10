import { motion } from "motion/react";
import { Pencil, Trash2 } from "lucide-react";
import Avatar from "../../shared/components/Avatar";
import Badge from "../../shared/components/Badge";
import { formatDate } from "../../notes/utils";

const IconAction = ({ label, onClick, danger, children }) => (
  <button
    onClick={onClick}
    aria-label={label}
    title={label}
    className={`flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors ${
      danger ? "hover:bg-danger-soft hover:text-danger" : "hover:bg-subtle hover:text-text"
    }`}
  >
    {children}
  </button>
);

const Actions = ({ u, currentUserId, onEdit, onDelete }) => (
  <div className="flex items-center justify-end gap-1">
    <IconAction label={`Edit ${u.name}`} onClick={() => onEdit(u)}>
      <Pencil size={15} />
    </IconAction>
    {u._id !== currentUserId && (
      <IconAction label={`Delete ${u.name}`} onClick={() => onDelete(u)} danger>
        <Trash2 size={15} />
      </IconAction>
    )}
  </div>
);

const Interests = ({ list }) =>
  list.length ? (
    <div className="flex flex-wrap gap-1">
      {list.slice(0, 3).map((i) => (
        <Badge key={i}>{i}</Badge>
      ))}
      {list.length > 3 && <Badge>+{list.length - 3}</Badge>}
    </div>
  ) : (
    <span className="text-muted">—</span>
  );

// table on desktop, cards on mobile (no horizontal scrolling)
const UsersTable = ({ users, currentUserId, onEdit, onDelete }) => (
  <>
    <div className="hidden overflow-hidden rounded-xl border border-border bg-surface md:block">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-subtle/50 text-xs uppercase tracking-wider text-muted">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">User</th>
            <th scope="col" className="px-4 py-3 font-medium">Role</th>
            <th scope="col" className="px-4 py-3 font-medium">Interests</th>
            <th scope="col" className="px-4 py-3 font-medium">Joined</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map((u, i) => (
            <motion.tr
              key={u._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="transition-colors hover:bg-subtle/40"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar name={u.name} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-text">
                      {u.name} {u._id === currentUserId && <span className="text-xs text-muted">(you)</span>}
                    </p>
                    <p className="truncate text-xs text-muted">{u.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge tone={u.role === "admin" ? "primary" : "neutral"}>{u.role}</Badge>
              </td>
              <td className="px-4 py-3">
                <Interests list={u.interests} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(u.createdAt)}</td>
              <td className="px-4 py-3">
                <Actions u={u} currentUserId={currentUserId} onEdit={onEdit} onDelete={onDelete} />
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>

    <ul className="space-y-2 md:hidden">
      {users.map((u) => (
        <li key={u._id} className="rounded-xl border border-border bg-surface p-4">
          <div className="flex items-start gap-3">
            <Avatar name={u.name} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium text-text">{u.name}</p>
                <Badge tone={u.role === "admin" ? "primary" : "neutral"}>{u.role}</Badge>
              </div>
              <p className="truncate text-xs text-muted">{u.email}</p>
              <div className="mt-2">
                <Interests list={u.interests} />
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-2">
            <span className="text-xs text-muted">Joined {formatDate(u.createdAt)}</span>
            <Actions u={u} currentUserId={currentUserId} onEdit={onEdit} onDelete={onDelete} />
          </div>
        </li>
      ))}
    </ul>
  </>
);

export const UsersTableSkeleton = () => (
  <div className="space-y-2 rounded-xl border border-border bg-surface p-4" aria-busy="true">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex items-center gap-3 py-2">
        <div className="h-7 w-7 animate-pulse rounded-full bg-subtle" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-40 animate-pulse rounded bg-subtle" />
          <div className="h-3 w-56 animate-pulse rounded bg-subtle" />
        </div>
      </div>
    ))}
  </div>
);

export default UsersTable;
