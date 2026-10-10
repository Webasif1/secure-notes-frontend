import { useState } from "react";
import { FileText, UserPlus, Users } from "lucide-react";
import PageTransition from "../../shared/components/PageTransition";
import PageHeader from "../../shared/components/PageHeader";
import Button from "../../shared/components/Button";
import Pagination from "../../shared/components/Pagination";
import ConfirmDialog from "../../shared/components/ConfirmDialog";
import { EmptyState, ErrorState } from "../../shared/components/States";
import { useToast } from "../../shared/components/Toast";
import { useFetch } from "../../shared/hooks/useFetch";
import { useAuth } from "../../auth/hooks/useAuth";
import { getErrorMessage } from "../../../lib/api";
import StatCard from "../components/StatCard";
import UsersTable, { UsersTableSkeleton } from "../components/UsersTable";
import UserFormModal from "../components/UserFormModal";
import { deleteUser, getOverview, getUsers } from "../services/admin.api";

const AdminDashboard = () => {
  const { user: me, setUser } = useAuth();
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const overview = useFetch(getOverview, []);
  const users = useFetch(() => getUsers({ page, limit: 10 }), [page]);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (u) => {
    setEditing(u);
    setFormOpen(true);
  };

  const handleSaved = (savedUser, isEdit) => {
    toast.success(isEdit ? "User updated" : "User added");
    // admin edited his own account -> update the name in the sidebar too
    if (savedUser._id === me.id) setUser(savedUser);
    users.reload();
    if (!isEdit) overview.reload();
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteUser(toDelete._id);
      toast.success(`${toDelete.name} was removed`);
      setToDelete(null);
      // if the last user on this page was deleted, go back one page
      if (users.data.users.length === 1 && page > 1) setPage(page - 1);
      else users.reload();
      overview.reload();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete the user"));
    } finally {
      setDeleting(false);
    }
  };

  const list = users.data?.users || [];

  return (
    <PageTransition>
      <PageHeader
        breadcrumbs={[{ label: "Admin" }, { label: "Overview" }]}
        title="Overview"
        description="Manage accounts and keep an eye on the workspace."
        actions={
          <Button onClick={openAdd}>
            <UserPlus size={16} /> Add user
          </Button>
        }
      />

      {overview.error ? (
        <p className="mb-6 text-sm text-danger" role="alert">
          Couldn't load the overview: {overview.error}
        </p>
      ) : (
        <div className="mb-10 grid grid-cols-2 gap-3 sm:gap-4">
          <StatCard index={0} icon={Users} label="Users" value={overview.data?.users} loading={overview.loading} />
          <StatCard index={1} icon={FileText} label="Notes" value={overview.data?.notes} loading={overview.loading} />
        </div>
      )}

      <section aria-labelledby="users-heading">
        <div className="mb-4">
          <h2 id="users-heading" className="text-lg font-semibold text-text">
            Users
          </h2>
          <p className="text-sm text-muted">
            {users.data ? `${users.data.pagination.total} in total` : " "}
          </p>
        </div>

        {users.error ? (
          <ErrorState message={users.error} onRetry={users.reload} />
        ) : users.loading && !users.data ? (
          <UsersTableSkeleton />
        ) : list.length === 0 ? (
          <EmptyState icon={Users} title="No users yet" description="Add the first user with the button above." />
        ) : (
          <div className={`transition-opacity ${users.loading ? "opacity-60" : ""}`}>
            <UsersTable users={list} currentUserId={me.id} onEdit={openEdit} onDelete={setToDelete} />
            <Pagination pagination={users.data.pagination} onPageChange={setPage} />
          </div>
        )}
      </section>

      <UserFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        user={editing}
        currentUserId={me.id}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title={`Remove ${toDelete?.name}?`}
        description="Their account, notes and posts will be permanently deleted. This can't be undone."
        confirmText="Remove user"
      />
    </PageTransition>
  );
};

export default AdminDashboard;
