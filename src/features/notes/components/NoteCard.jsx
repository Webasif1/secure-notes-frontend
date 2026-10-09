import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Clock } from "lucide-react";
import { timeAgo, formatDate, isEdited } from "../utils";

export const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

const NoteCard = ({ note, view = "grid", showOwner = false, to }) => {
  const preview = note.content?.trim() || "No content";
  const list = view === "list";

  return (
    <motion.li variants={cardVariants} layout="position">
      <Link
        to={to || `/notes/${note._id}`}
        className={`group flex h-full rounded-xl border border-border bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-black/5 ${
          list ? "items-center gap-4 px-4 py-3.5" : "flex-col p-5"
        }`}
      >
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-text transition-colors group-hover:text-primary">{note.title}</h3>
          <p
            className={`mt-1.5 text-sm leading-relaxed ${note.content?.trim() ? "text-muted" : "italic text-muted/60"} ${
              list ? "truncate" : "line-clamp-3 whitespace-pre-line"
            }`}
          >
            {preview}
          </p>
        </div>
        <div
          className={`flex shrink-0 items-center gap-2 text-xs text-muted ${
            list ? "" : "mt-4 border-t border-border pt-3"
          }`}
        >
          {showOwner && note.owner && (
            <span className="truncate font-medium text-text">{note.owner.name} ·</span>
          )}
          <Clock size={12} />
          <time dateTime={note.updatedAt} title={formatDate(note.updatedAt, true)}>
            {isEdited(note) ? "Edited " : "Created "}
            {timeAgo(note.updatedAt)}
          </time>
        </div>
      </Link>
    </motion.li>
  );
};

export default NoteCard;
