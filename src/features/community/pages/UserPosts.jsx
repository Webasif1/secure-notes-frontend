import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Newspaper, UserX } from "lucide-react";
import PageTransition from "../../shared/components/PageTransition";
import Avatar from "../../shared/components/Avatar";
import Pagination from "../../shared/components/Pagination";
import { EmptyState, ErrorState, Skeleton } from "../../shared/components/States";
import { useFetch } from "../../shared/hooks/useFetch";
import { getPostsByUser } from "../services/community.api";
import { PostCard, PostListSkeleton } from "../components";

// aggregation scenario 2: all posts of one user ($lookup)
const UserPosts = () => {
  const { userId } = useParams();
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useFetch(() => getPostsByUser(userId, { page, limit: 10 }), [userId, page]);

  if (error) {
    return /not found|invalid/i.test(error) ? (
      <EmptyState icon={UserX} title="User not found" description="This account doesn't exist anymore." />
    ) : (
      <ErrorState message={error} onRetry={reload} />
    );
  }

  return (
    <PageTransition className="mx-auto max-w-3xl">
      <Link to="/community" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-text">
        <ArrowLeft size={16} /> Community
      </Link>

      <div className="mb-8 mt-6 flex items-center gap-4">
        {data ? <Avatar name={data.user.name} size="lg" /> : <Skeleton className="h-12 w-12 rounded-full" />}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">
            {data ? `Posts by ${data.user.name}` : <Skeleton className="h-7 w-48" />}
          </h1>
          <p className="text-sm text-muted">Public posts</p>
        </div>
      </div>

      {loading && !data ? (
        <PostListSkeleton />
      ) : data.posts.length === 0 ? (
        <EmptyState icon={Newspaper} title="No posts yet" description={`${data.user.name} hasn't posted anything.`} />
      ) : (
        <>
          <ul className={`space-y-3 transition-opacity ${loading ? "opacity-60" : ""}`}>
            {data.posts.map((post, i) => (
              <PostCard key={post._id} index={i} post={post} />
            ))}
          </ul>
          <Pagination pagination={data.pagination} onPageChange={setPage} />
        </>
      )}
    </PageTransition>
  );
};

export default UserPosts;
