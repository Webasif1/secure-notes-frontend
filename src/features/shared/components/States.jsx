import { AlertTriangle, RotateCw } from "lucide-react";
import { motion } from "motion/react";
import Button from "./Button";

export const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-md bg-subtle ${className}`} />
);

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
    className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center"
  >
    {Icon && (
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icon size={22} />
      </div>
    )}
    <h3 className="text-base font-semibold text-text">{title}</h3>
    {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </motion.div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div
    role="alert"
    className="flex flex-col items-center rounded-2xl border border-border bg-surface px-6 py-12 text-center"
  >
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-danger-soft text-danger">
      <AlertTriangle size={22} />
    </div>
    <h3 className="text-base font-semibold text-text">Couldn't load this</h3>
    <p className="mt-1 max-w-sm text-sm text-muted">{message}</p>
    {onRetry && (
      <Button variant="secondary" size="sm" className="mt-5" onClick={onRetry}>
        <RotateCw size={14} /> Try again
      </Button>
    )}
  </div>
);
