import { useEffect, useRef, useState } from "react";
import { Link, useBlocker, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileQuestion } from "lucide-react";
import PageTransition from "../../shared/components/PageTransition";
import Button from "../../shared/components/Button";
import ConfirmDialog from "../../shared/components/ConfirmDialog";
import { EmptyState, Skeleton } from "../../shared/components/States";
import FormError from "../../auth/components/FormError";
import { useToast } from "../../shared/components/Toast";
import { useAuth } from "../../auth/hooks/useAuth";
import { getErrorMessage } from "../../../lib/api";
import { createNote, getNote, updateNote } from "../services/note.api";

const TITLE_MAX = 200;
const CONTENT_MAX = 20000;

// same page for "new note" (/notes/new) and "edit note" (/notes/:id/edit)
const NoteEditor = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [form, setForm] = useState({ title: "", content: "" });
  const [original, setOriginal] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [titleError, setTitleError] = useState("");
  const savedRef = useRef(false);
  const textareaRef = useRef(null);

  // load the note when editing
  useEffect(() => {
    if (!isEdit) return;
    getNote(id)
      .then((res) => {
        if (res.note.owner?._id !== user.id) {
          setLoadError("You can only edit your own notes.");
          return;
        }
        const values = { title: res.note.title, content: res.note.content || "" };
        setForm(values);
        setOriginal(values);
      })
      .catch((err) => setLoadError(getErrorMessage(err, "Note not found")))
      .finally(() => setLoading(false));
  }, [id, isEdit, user.id]);

  // textarea grows with the text
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, 320)}px`;
  }, [form.content, loading]);

  const dirty = form.title !== original.title || form.content !== original.content;

  // warn before leaving with unsaved changes (inside the app...)
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    return dirty && !savedRef.current && currentLocation.pathname !== nextLocation.pathname;
  });

  // ...and when closing / reloading the tab
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const handleSave = async (e) => {
    e?.preventDefault();
    const title = form.title.trim();
    if (!title) {
      setTitleError("Give your note a title");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = isEdit ? await updateNote(id, { ...form, title }) : await createNote({ ...form, title });
      savedRef.current = true;
      toast.success(isEdit ? "Changes saved" : "Note created");
      navigate(`/notes/${res.note._id}`, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Could not save the note"));
      setSaving(false);
    }
  };

  // Ctrl/Cmd + S saves
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (!saving && !loading) handleSave();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  const cancel = () => navigate(isEdit ? `/notes/${id}` : "/notes");

  if (loadError) {
    return (
      <EmptyState
        icon={FileQuestion}
        title="Can't edit this note"
        description={loadError}
        action={
          <Button variant="secondary" onClick={() => navigate("/notes")}>
            Back to notes
          </Button>
        }
      />
    );
  }

  return (
    <PageTransition className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between gap-3">
        <Link
          to={isEdit ? `/notes/${id}` : "/notes"}
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-text"
        >
          <ArrowLeft size={16} /> {isEdit ? "Back to note" : "All notes"}
        </Link>
        <span className="text-xs text-muted" aria-live="polite">
          {dirty ? "Unsaved changes" : isEdit ? "No changes" : ""}
        </span>
      </div>

      <form onSubmit={handleSave} noValidate className="mt-6 rounded-2xl border border-border bg-surface">
        {loading ? (
          <div className="space-y-4 p-6 sm:p-10" aria-busy="true">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : (
          <div className="p-6 sm:p-10">
            <FormError message={error} />
            <label htmlFor="note-title" className="sr-only">
              Title
            </label>
            <input
              id="note-title"
              autoFocus={!isEdit}
              value={form.title}
              maxLength={TITLE_MAX}
              onChange={(e) => {
                setForm({ ...form, title: e.target.value });
                setTitleError("");
              }}
              placeholder="Untitled note"
              aria-invalid={Boolean(titleError)}
              aria-describedby={titleError ? "title-error" : undefined}
              className="mt-2 w-full bg-transparent text-2xl font-semibold tracking-tight text-text placeholder:text-muted/50 focus:outline-none focus-visible:outline-none sm:text-3xl"
            />
            {titleError && (
              <p id="title-error" className="mt-1 text-xs text-danger">
                {titleError}
              </p>
            )}
            <div className="my-5 h-px bg-border" />
            <label htmlFor="note-content" className="sr-only">
              Content
            </label>
            <textarea
              id="note-content"
              ref={textareaRef}
              value={form.content}
              maxLength={CONTENT_MAX}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Start writing..."
              className="w-full resize-none bg-transparent text-[15px] leading-7 text-text placeholder:text-muted/50 focus:outline-none focus-visible:outline-none"
            />
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p className="text-xs text-muted">
            {form.content.length.toLocaleString()} / {CONTENT_MAX.toLocaleString()} characters
            <span className="hidden sm:inline">
              {" "}
              · <kbd className="font-sans">Ctrl</kbd> + <kbd className="font-sans">S</kbd> to save
            </span>
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={cancel} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" loading={saving} disabled={loading || (isEdit && !dirty)}>
              {isEdit ? "Save changes" : "Create note"}
            </Button>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={blocker.state === "blocked"}
        onClose={() => blocker.reset?.()}
        onConfirm={() => blocker.proceed?.()}
        title="Discard unsaved changes?"
        description="You have changes that haven't been saved. If you leave now they will be lost."
        confirmText="Discard changes"
      />
    </PageTransition>
  );
};

export default NoteEditor;
