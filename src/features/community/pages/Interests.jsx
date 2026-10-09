import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Tags } from "lucide-react";
import PageTransition from "../../shared/components/PageTransition";
import PageHeader from "../../shared/components/PageHeader";
import Avatar from "../../shared/components/Avatar";
import Pagination from "../../shared/components/Pagination";
import { EmptyState, ErrorState, Skeleton } from "../../shared/components/States";
import { useFetch } from "../../shared/hooks/useFetch";
import { getInterestGroups } from "../services/community.api";

// aggregation scenario 1: users grouped by interests
const Interests = () => {
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useFetch(() => getInterestGroups({ page, limit: 12 }), [page]);
  const groups = data?.groups || [];

  return (
    <PageTransition>
      <PageHeader
        title="Interests"
        description="People grouped by what they're into. Add your own interests on your profile."
        actions={
          <Link
            to="/profile"
            className="inline-flex h-10 items-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text transition-colors hover:bg-subtle"
          >
            Edit my interests
          </Link>
        }
      />

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading && !data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-4 h-7 w-32" />
            </div>
          ))}
        </div>
      ) : groups.length === 0 ? (
        <EmptyState icon={Tags} title="No interests yet" description="Nobody has added interests to their profile yet." />
      ) : (
        <>
          <ul className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${loading ? "opacity-60" : ""}`}>
            {groups.map((group, i) => (
              <motion.li
                key={group.interest}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold capitalize text-text">#{group.interest}</h3>
                  <span className="text-xs text-muted">
                    {group.count} {group.count === 1 ? "person" : "people"}
                  </span>
                </div>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.users.map((u) => (
                    <li key={u._id}>
                      <Link
                        to={`/community/user/${u._id}`}
                        title={`Posts by ${u.name}`}
                        className="flex items-center gap-1.5 rounded-full border border-border py-0.5 pl-0.5 pr-2.5 text-xs text-text transition-colors hover:border-primary/40 hover:bg-primary-soft"
                      >
                        <Avatar name={u.name} size="sm" />
                        {u.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </ul>
          <Pagination pagination={data.pagination} onPageChange={setPage} />
        </>
      )}
    </PageTransition>
  );
};

export default Interests;
