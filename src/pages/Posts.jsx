import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import { usePaged } from '../components/usePaged.js';
import Pagination from '../components/Pagination.jsx';

export default function Posts() {
  const { user } = useAuth();
  const { data, meta, error, setPage, reload } = usePaged('/posts', 'posts', 5);
  const [form, setForm] = useState({ title: '', body: '' });
  const [actionError, setActionError] = useState('');

  const create = async (e) => {
    e.preventDefault();
    try {
      await api('/posts', { method: 'POST', body: form });
      setForm({ title: '', body: '' });
      setActionError('');
      setPage(1);
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this post?')) return;
    try {
      await api(`/posts/${id}`, { method: 'DELETE' });
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <>
      <h2>Public Posts</h2>
      {user ? (
        <form className="card" onSubmit={create}>
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea placeholder="Write something..." value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required />
          <button type="submit">Publish post</button>
        </form>
      ) : (
        <p>
          <Link to="/login">Log in</Link> to write a post.
        </p>
      )}
      {(error || actionError) && <p className="error">{error || actionError}</p>}
      <ul className="list">
        {data.map((post) => (
          <li className="card" key={post._id}>
            <h3>{post.title}</h3>
            <p className="pre">{post.body}</p>
            <small>
              by{' '}
              {post.author ? <Link to={`/users/${post.author._id}/posts`}>{post.author.name}</Link> : 'deleted user'} ·{' '}
              {new Date(post.createdAt).toLocaleString()}
            </small>
            {user && (user.role === 'admin' || user.id === post.author?._id) && (
              <div>
                <button onClick={() => remove(post._id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <Pagination meta={meta} onChange={setPage} />
    </>
  );
}
