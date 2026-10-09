import { Link, useSearchParams } from 'react-router-dom';
import { usePaged } from '../components/usePaged.js';
import Pagination from '../components/Pagination.jsx';

export default function AdminNotes() {
  const [params] = useSearchParams();
  const owner = params.get('owner');
  const { data, meta, error, setPage } = usePaged(owner ? `/notes/all?owner=${owner}` : '/notes/all', 'notes', 10);

  return (
    <>
      <h2>All Notes {owner && data[0] ? `of ${data[0].owner?.name}` : ''}</h2>
      {owner && (
        <p>
          <Link to="/admin/notes">Show everyone's notes</Link>
        </p>
      )}
      {error && <p className="error">{error}</p>}
      <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Owner</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {data.map((note) => (
            <tr key={note._id}>
              <td>{note.title}</td>
              <td className="pre">{note.content}</td>
              <td>{note.owner ? `${note.owner.name} (${note.owner.email})` : 'deleted user'}</td>
              <td>{new Date(note.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {meta?.total === 0 && <p>No notes.</p>}
      <Pagination meta={meta} onChange={setPage} />
    </>
  );
}
