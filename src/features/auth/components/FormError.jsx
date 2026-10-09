import { AnimatePresence, motion } from "motion/react";
import { AlertCircle } from "lucide-react";

const FormError = ({ message }) => (
  <AnimatePresence>
    {message && (
      <motion.div
        role="alert"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="flex items-start gap-2 rounded-lg border border-danger/20 bg-danger-soft px-3 py-2.5 text-sm text-danger">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {message}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default FormError;
