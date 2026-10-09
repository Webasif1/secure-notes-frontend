import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FileText, Plus, SearchX } from "lucide-react";
import PageTransition from "../../shared/components/PageTransition";
import Button from "../../shared/components/Button";
import Pagination from "../../shared/components/Pagination";
import { EmptyState, ErrorState } from "../../shared/components/States";
import NoteGrid, { NoteGridSkeleton } from "../components/NoteGrid";
import ViewToggle from "../components/ViewToggle";
import { useViewMode } from "../hooks/useViewMode";
import { useFetch } from "../../shared/hooks/useFetch";
import { useDebounce } from "../../shared/hooks/useDebounce";
import { useAuth } from "../../auth/hooks/useAuth";
import { getMyNotes } from "../services/note.api";
import { greeting } from "../utils";

const PAGE_SIZE = 12;

const Notes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const search = useDebounce(params.get("q") || "");
  const [page, setPage] = useState(1);
  const [view, setView] = useViewMode();

  // new search -> back to page 1
  useEffect(() => setPage(1), [search]);

  const { data, loading, error, reload } = useFetch(
    () => getMyNotes({ page, limit: PAGE_SIZE, search }),
    [page, search],
  );

  const notes = data?.notes || [];
  const total = data?.pagination.total ?? 0;
  const firstName = user.name.split(" ")[0];

  const changePage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PageTransition>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted">
            {greeting()}, {firstName}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-text">
            {search ? `Results for "${search}"` : "All notes"}
          </h1>
          <p className="mt-1 text-sm text-muted" aria-live="polite">
            {loading && !data
              ? "Loading your notes..."
              : `${total} ${total === 1 ? "note" : "notes"}${search ? " found" : ""}`}
          </p>
        </div>
        <ViewToggle view={view} onChange={setView} />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading && !data ? (
        <NoteGridSkeleton view={view} />
      ) : notes.length === 0 ? (
        search ? (
          <EmptyState
            icon={SearchX}
            title="No matching notes"
            description={`Nothing in your notes matches "${search}". Try another word.`}
            action={
              <Button variant="secondary" onClick={() => navigate("/notes")}>
                Clear search
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={FileText}
            title="Write your first note"
            description="Capture ideas, to-dos or anything you want to keep safe. Only you (and admins) can see your notes."
            action={
              <Button onClick={() => navigate("/notes/new")}>
                <Plus size={16} /> Create a note
              </Button>
            }
          />
        )
      ) : (
        <div className={`transition-opacity duration-150 ${loading ? "opacity-60" : ""}`}>
          <NoteGrid notes={notes} view={view} />
          <Pagination pagination={data.pagination} onPageChange={changePage} />
        </div>
      )}
    </PageTransition>
  );
};

export default Notes;
