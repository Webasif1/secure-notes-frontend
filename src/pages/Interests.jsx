import { usePaged } from '../components/usePaged.js';
import Pagination from '../components/Pagination.jsx';

// Scenario 1: GET /api/users/interests (single aggregate() call)
export default function Interests() {
  const { data, meta, error, setPage } = usePaged('/users/interests', 'groups', 10);

  return (
    <>
      <h2>Users grouped by interest</h2>
      {error && <p className="error">{error}</p>}
      <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Interest</th>
            <th>Users</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {data.map((group) => (
            <tr key={group.interest}>
              <td>{group.interest}</td>
              <td>{group.users.map((u) => u.name).join(', ')}</td>
              <td>{group.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {meta?.total === 0 && <p>No interests yet. Add some on your profile.</p>}
      <Pagination meta={meta} onChange={setPage} />
    </>
  );
}
