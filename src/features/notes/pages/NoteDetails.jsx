import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, FileQuestion, Pencil, PenLine, Trash2, UserRound } from "lucide-react";
import PageTransition from "../../shared/components/PageTransition";
import Button from "../../shared/components/Button";
import ConfirmDialog from "../../shared/components/ConfirmDialog";
import { EmptyState, ErrorState, Skeleton } from "../../shared/components/States";
import { useToast } from "../../shared/components/Toast";
import { useFetch } from "../../shared/hooks/useFetch";
import { useAuth } from "../../auth/hooks/useAuth";
import { getErrorMessage } from "../../../lib/api";
import { deleteNote, getNote } from "../services/note.api";
import { formatDate, isEdited } from "../utils";

const NoteDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data, loading, error, reload } = useFetch(() => getNote(id), [id]);
  const note = data?.note;
  const isOwner = note && note.owner?._id === user.id;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteNote(id);
      toast.success("Note deleted");
      navigate("/notes", { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete the note"));
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl" aria-busy="true">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-6 h-8 w-2/3" />
        <Skeleton className="mt-3 h-4 w-1/3" />
        <div className="mt-8 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    );
  }

  if (error) {
    const notFound = /not found|invalid id/i.test(error);
    return notFound ? (
      <EmptyState
        icon={FileQuestion}
        title="Note not found"
        description="It may have been deleted, or it isn't yours."
        action={
          <Button variant="secondary" onClick={() => navigate("/notes")}>
            Back to notes
          </Button>
        }
      />
    ) : (
      <ErrorState message={error} onRetry={reload} />
    );
  }

  return (
    <PageTransition className="mx-auto max-w-3xl">
      <Link
        to={isOwner ? "/notes" : "/admin/notes"}
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-text"
      >
        <ArrowLeft size={16} /> {isOwner ? "All notes" : "All users' notes"}
      </Link>

      <article className="mt-6 rounded-2xl border border-border bg-surface p-6 sm:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <h1 className="break-words text-2xl font-semibold tracking-tight text-text sm:text-3xl">{note.title}</h1>
          {isOwner && (
            <div className="flex shrink-0 gap-2">
              <Button variant="secondary" size="sm" onClick={() => navigate(`/notes/${id}/edit`)}>
                <Pencil size={14} /> Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hover:!bg-danger-soft hover:!text-danger"
                onClick={() => setConfirmOpen(true)}
              >
                <Trash2 size={14} /> Delete
              </Button>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-b border-border pb-6 text-xs text-muted">
          {!isOwner && note.owner && (
            <span className="flex items-center gap-1.5">
              <UserRound size={13} /> {note.owner.name} ({note.owner.email})
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <CalendarDays size={13} /> Created {formatDate(note.createdAt, true)}
          </span>
          {isEdited(note) && (
            <span className="flex items-center gap-1.5">
              <PenLine size={13} /> Edited {formatDate(note.updatedAt, true)}
            </span>
          )}
        </div>

        {note.content?.trim() ? (
          <div className="mt-6 whitespace-pre-wrap break-words text-[15px] leading-7 text-text">{note.content}</div>
        ) : (
          <p className="mt-6 italic text-muted">This note has no content.</p>
        )}
      </article>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this note?"
        description={`"${note.title}" will be permanently deleted. This can't be undone.`}
        confirmText="Delete note"
      />
    </PageTransition>
  );
};

export default NoteDetails;
