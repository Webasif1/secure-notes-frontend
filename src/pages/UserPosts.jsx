import { Link, useParams } from 'react-router-dom';
import { usePaged } from '../components/usePaged.js';
import Pagination from '../components/Pagination.jsx';

// Scenario 2: GET /api/posts/user/:userId (single aggregation with $lookup)
export default function UserPosts() {
  const { userId } = useParams();
  const { data, meta, error, setPage } = usePaged(`/posts/user/${userId}`, 5);

  return (
    <>
      <p>
        <Link to="/posts">&larr; All posts</Link>
      </p>
      <h2>Posts by {data?.user?.name ?? '...'}</h2>
      {error && <p className="error">{error}</p>}
      <ul className="list">
        {data?.posts?.map((post) => (
          <li className="card" key={post._id}>
            <h3>{post.title}</h3>
            <p className="pre">{post.body}</p>
            <small>{new Date(post.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
      {data?.posts?.length === 0 && <p>This user has no posts.</p>}
      <Pagination meta={meta} onChange={setPage} />
    </>
  );
}
