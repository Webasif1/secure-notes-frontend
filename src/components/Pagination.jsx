export default function Pagination({ meta, onChange }) {
  if (!meta) return null;
  const hasNext = meta.hasNextPage ?? meta.page < meta.totalPages;
  return (
    <div className="pagination">
      <button disabled={meta.page <= 1} onClick={() => onChange(meta.page - 1)}>
        Prev
      </button>
      <span>
        Page {meta.page}
        {meta.totalPages ? ` of ${meta.totalPages}` : ''}
        {meta.total !== undefined ? ` (${meta.total} total)` : ''}
      </span>
      <button disabled={!hasNext} onClick={() => onChange(meta.page + 1)}>
        Next
      </button>
    </div>
  );
}
