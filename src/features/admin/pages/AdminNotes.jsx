import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FileText, SearchX, X } from "lucide-react";
import PageTransition from "../../shared/components/PageTransition";
import PageHeader from "../../shared/components/PageHeader";
import SearchInput from "../../shared/components/SearchInput";
import Pagination from "../../shared/components/Pagination";
import { EmptyState, ErrorState } from "../../shared/components/States";
import { useFetch } from "../../shared/hooks/useFetch";
import { useDebounce } from "../../shared/hooks/useDebounce";
import NoteGrid, { NoteGridSkeleton } from "../../notes/components/NoteGrid";
import ViewToggle from "../../notes/components/ViewToggle";
import { useViewMode } from "../../notes/hooks/useViewMode";
import { getAllNotes } from "../services/admin.api";

const AdminNotes = () => {
  const [params, setParams] = useSearchParams();
  const owner = params.get("owner") || "";
  const ownerName = params.get("name") || "this user";
  const [searchText, setSearchText] = useState("");
  const search = useDebounce(searchText);
  const [page, setPage] = useState(1);
  const [view, setView] = useViewMode();

  useEffect(() => setPage(1), [search, owner]);

  const { data, loading, error, reload } = useFetch(
    () => getAllNotes({ page, limit: 12, search, owner }),
    [page, search, owner],
  );
  const notes = data?.notes || [];

  return (
    <PageTransition>
      <PageHeader
        breadcrumbs={[{ label: "Admin", to: "/admin" }, { label: "All users' notes" }]}
        title="All users' notes"
        description={data ? `${data.pagination.total} notes${search || owner ? " found" : " across all users"}` : " "}
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={searchText}
          onChange={setSearchText}
          placeholder="Search title or content..."
          label="Search all notes"
          className="flex-1 sm:max-w-sm"
        />
        {owner && (
          <span className="inline-flex h-8 items-center gap-1.5 self-start rounded-full bg-primary-soft pl-3 pr-1 text-sm text-primary sm:self-auto">
            Owner: {ownerName}
            <button
              onClick={() => setParams({})}
              aria-label="Remove owner filter"
              className="rounded-full p-1 hover:bg-primary/10"
            >
              <X size={14} />
            </button>
          </span>
        )}
        <div className="sm:ml-auto">
          <ViewToggle view={view} onChange={setView} />
        </div>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading && !data ? (
        <NoteGridSkeleton view={view} />
      ) : notes.length === 0 ? (
        <EmptyState
          icon={search ? SearchX : FileText}
          title={search ? "No matching notes" : "No notes yet"}
          description={search ? `No note matches "${search}".` : "Notes will show up here when users create them."}
        />
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
