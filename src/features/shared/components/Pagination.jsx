import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";

// works with both pagination formats from the API:
// { page, totalPages, total } and { page, hasNextPage }
const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination) return null;
  const { page, totalPages, hasNextPage } = pagination;
  const hasNext = hasNextPage ?? page < totalPages;
  if (page === 1 && !hasNext) return null;

  return (
    <nav aria-label="Pagination" className="mt-6 flex items-center justify-between gap-4">
      <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        <ChevronLeft size={16} /> Previous
      </Button>
      <span className="text-sm text-muted">
        Page <span className="font-medium text-text">{page}</span>
        {totalPages ? ` of ${totalPages}` : ""}
      </span>
      <Button variant="secondary" size="sm" disabled={!hasNext} onClick={() => onPageChange(page + 1)}>
        Next <ChevronRight size={16} />
      </Button>
    </nav>
  );
};

export default Pagination;
