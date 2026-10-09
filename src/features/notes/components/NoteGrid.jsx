import { motion } from "motion/react";
import NoteCard from "./NoteCard";
import { Skeleton } from "../../shared/components/States";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const layoutClass = (view) =>
  view === "list" ? "flex flex-col gap-2" : "grid gap-4 sm:grid-cols-2 xl:grid-cols-3";

export const NoteGridSkeleton = ({ view = "grid", count = 6 }) => (
  <ul className={layoutClass(view)} aria-busy="true" aria-label="Loading notes">
    {Array.from({ length: count }).map((_, i) => (
      <li key={i} className={`rounded-xl border border-border bg-surface ${view === "list" ? "p-4" : "p-5"}`}>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-3 h-3 w-full" />
        {view !== "list" && (
          <>
            <Skeleton className="mt-2 h-3 w-5/6" />
            <Skeleton className="mt-5 h-3 w-1/3" />
          </>
        )}
      </li>
    ))}
  </ul>
);

const NoteGrid = ({ notes, view = "grid", showOwner = false }) => (
  <motion.ul
    // key makes the stagger animation run again for each new page / search
    key={notes.map((n) => n._id).join()}
    variants={container}
    initial="hidden"
    animate="show"
    className={layoutClass(view)}
  >
    {notes.map((note) => (
      <NoteCard key={note._id} note={note} view={view} showOwner={showOwner} />
    ))}
  </motion.ul>
);

export default NoteGrid;
