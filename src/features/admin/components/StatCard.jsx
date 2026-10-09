import { motion } from "motion/react";
import { Skeleton } from "../../shared/components/States";

const StatCard = ({ icon: Icon, label, value, loading, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.25 }}
    className="rounded-xl border border-border bg-surface p-4 sm:p-5"
  >
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-muted">{label}</p>
      <span className="hidden h-8 w-8 sm:flex items-center justify-center rounded-lg bg-primary-soft text-primary">
        <Icon size={16} />
      </span>
    </div>
    {loading ? (
      <Skeleton className="mt-3 h-8 w-16" />
    ) : (
      <p className="mt-2 text-2xl font-semibold sm:text-3xl tracking-tight text-text">{value ?? "—"}</p>
    )}
  </motion.div>
);

export default StatCard;
