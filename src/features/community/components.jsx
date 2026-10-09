import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Trash2 } from "lucide-react";
import Avatar from "../shared/components/Avatar";
import { Skeleton } from "../shared/components/States";
import { timeAgo, formatDate } from "../notes/utils";

export const PostCard = ({ post, author, canDelete, onDelete, index = 0 }) => (
  <motion.li
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.04, duration: 0.25 }}
    className="rounded-xl border border-border bg-surface p-5"
  >
    <div className="flex items-start gap-3">
      {author && <Avatar name={author.name} size="sm" />}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted">
          {author && (
            <Link to={`/community/user/${author._id}`} className="font-medium text-text hover:text-primary">
              {author.name}
            </Link>
          )}
          {author && <span aria-hidden="true">·</span>}
          <time dateTime={post.createdAt} title={formatDate(post.createdAt, true)}>
            {timeAgo(post.createdAt)}
          </time>
        </div>
        <h3 className="mt-1 break-words font-semibold text-text">{post.title}</h3>
        <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-muted">{post.body}</p>
      </div>
      {canDelete && (
        <button
          onClick={() => onDelete(post)}
          aria-label={`Delete post ${post.title}`}
          className="rounded-lg p-1.5 text-muted transition-colors hover:bg-danger-soft hover:text-danger"
        >
          <Trash2 size={15} />
        </button>
      )}
    </div>
  </motion.li>
);

export const PostListSkeleton = () => (
  <ul className="space-y-3" aria-busy="true">
    {[1, 2, 3].map((i) => (
      <li key={i} className="rounded-xl border border-border bg-surface p-5">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-3 h-4 w-1/2" />
        <Skeleton className="mt-2 h-3 w-full" />
      </li>
    ))}
  </ul>
);
