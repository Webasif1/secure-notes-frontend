import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';

/** Loads a paginated endpoint. `path` may already contain a query string. */
export function usePaged(path, limit = 10) {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ data: [], meta: null });
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    try {
      const sep = path.includes('?') ? '&' : '?';
      const res = await api(`${path}${sep}page=${page}&limit=${limit}`);
      setResult(res);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, [path, page, limit]);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => setPage(1), [path]);

  return { ...result, error, page, setPage, reload };
}
