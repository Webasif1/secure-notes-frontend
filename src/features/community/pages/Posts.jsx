import { useState } from "react";
import { Newspaper } from "lucide-react";
import PageTransition from "../../shared/components/PageTransition";
import PageHeader from "../../shared/components/PageHeader";
import Button from "../../shared/components/Button";
import { Field } from "../../shared/components/Field";
import Pagination from "../../shared/components/Pagination";
import ConfirmDialog from "../../shared/components/ConfirmDialog";
import { EmptyState, ErrorState } from "../../shared/components/States";
import { useToast } from "../../shared/components/Toast";
import { useFetch } from "../../shared/hooks/useFetch";
import { useAuth } from "../../auth/hooks/useAuth";
import FormError from "../../auth/components/FormError";
import { getErrorMessage } from "../../../lib/api";
import { createPost, deletePost, getPosts } from "../services/community.api";
import { PostCard, PostListSkeleton } from "../components";

const Posts = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ title: "", body: "" });
  const [formError, setFormError] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { data, loading, error, reload } = useFetch(() => getPosts({ page, limit: 10 }), [page]);
  const posts = data?.posts || [];

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      setFormError("Add a title and some text to publish.");
      return;
    }
    setPublishing(true);
    setFormError("");
    try {
      await createPost({ title: form.title.trim(), body: form.body.trim() });
      setForm({ title: "", body: "" });
      toast.success("Post published");
      if (page === 1) reload();
      else setPage(1);
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not publish the post"));
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletePost(toDelete._id);
      toast.success("Post deleted");
      setToDelete(null);
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete the post"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <PageTransition className="mx-auto max-w-3xl">
      <PageHeader title="Community posts" description="Posts are public. Everyone can read them." />

      <form onSubmit={handlePublish} noValidate className="mb-8 space-y-3 rounded-xl border border-border bg-surface p-5">
        <FormError message={formError} />
        <Field
          label="Title"
          value={form.title}
          maxLength={200}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="What's on your mind?"
        />
        <Field
          as="textarea"
          label="Post"
          rows={3}
          value={form.body}
          maxLength={20000}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          placeholder="Share something with everyone..."
        />
        <div className="flex justify-end">
          <Button type="submit" loading={publishing}>
            Publish
          </Button>
        </div>
      </form>

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading && !data ? (
        <PostListSkeleton />
      ) : posts.length === 0 ? (
        <EmptyState icon={Newspaper} title="No posts yet" description="Be the first one to share something." />
      ) : (
        <>
          <ul className={`space-y-3 transition-opacity ${loading ? "opacity-60" : ""}`}>
            {posts.map((post, i) => (
              <PostCard
                key={post._id}
                index={i}
                post={post}
                author={post.author}
                canDelete={user.role === "admin" || post.author?._id === user.id}
                onDelete={setToDelete}
              />
            ))}
          </ul>
          <Pagination pagination={data.pagination} onPageChange={setPage} />
        </>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this post?"
        description="It will be removed for everyone. This can't be undone."
        confirmText="Delete post"
      />
    </PageTransition>
  );
};

export default Posts;
