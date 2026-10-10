import { useState } from "react";
import { FileText } from "lucide-react";
import PageTransition from "../../shared/components/PageTransition";
import PageHeader from "../../shared/components/PageHeader";
import Pagination from "../../shared/components/Pagination";
import { EmptyState, ErrorState } from "../../shared/components/States";
import { useFetch } from "../../shared/hooks/useFetch";
import NoteGrid, { NoteGridSkeleton } from "../../notes/components/NoteGrid";
import ViewToggle from "../../notes/components/ViewToggle";
import { useViewMode } from "../../notes/hooks/useViewMode";
import { getAllNotes } from "../services/admin.api";

const AdminNotes = () => {
  const [page, setPage] = useState(1);
  const [view, setView] = useViewMode();

  const { data, loading, error, reload } = useFetch(() => getAllNotes({ page, limit: 12 }), [page]);
  const notes = data?.notes || [];

  return (
    <PageTransition>
      <PageHeader
        breadcrumbs={[{ label: "Admin", to: "/admin" }, { label: "All users' notes" }]}
        title="All users' notes"
        description={data ? `${data.pagination.total} notes across all users` : " "}
        actions={<ViewToggle view={view} onChange={setView} />}
      />

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading && !data ? (
        <NoteGridSkeleton view={view} />
      ) : notes.length === 0 ? (
        <EmptyState icon={FileText} title="No notes yet" description="Notes will show up here when users create them." />
      ) : (
        <div className={`transition-opacity ${loading ? "opacity-60" : ""}`}>
          <NoteGrid notes={notes} view={view} showOwner />
          <Pagination pagination={data.pagination} onPageChange={setPage} />
        </div>
      )}
    </PageTransition>
  );
};

export default AdminNotes;
