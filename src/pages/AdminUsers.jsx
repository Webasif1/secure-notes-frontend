import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, splitList } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import { usePaged } from '../components/usePaged.js';
import Pagination from '../components/Pagination.jsx';

const emptyForm = { name: '', email: '', password: '', role: 'user', interests: '' };

export default function AdminUsers() {
  const { user: me } = useAuth();
  const { data, meta, error, setPage, reload } = usePaged('/users', 'users', 10);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const startEdit = (u) => {
    setEditingId(u._id);
    setForm({ name: u.name, email: u.email, password: '', role: u.role, interests: u.interests.join(', ') });
    setFormError('');
  };

  const reset = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    const body = { ...form, interests: splitList(form.interests) };
    if (editingId && !body.password) delete body.password;
    try {
      await api(editingId ? `/users/${editingId}` : '/users', { method: editingId ? 'PATCH' : 'POST', body });
      reset();
      reload();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const remove = async (u) => {
    if (!confirm(`Delete ${u.email}? Their notes and posts will be removed too.`)) return;
    try {
      await api(`/users/${u._id}`, { method: 'DELETE' });
      reload();
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <>
      <h2>Manage Users</h2>
      <form className="card" onSubmit={submit}>
        <h3>{editingId ? 'Edit user' : 'Add user'}</h3>
        <div className="row">
          <input placeholder="Name" value={form.name} onChange={set('name')} required />
          <input type="email" placeholder="Email" value={form.email} onChange={set('email')} required />
          <input
            type="password"
            placeholder={editingId ? 'New password (optional)' : 'Password'}
            value={form.password}
            onChange={set('password')}
            required={!editingId}
          />
          <select value={form.role} onChange={set('role')}>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          <input placeholder="Interests, comma separated" value={form.interests} onChange={set('interests')} />
        </div>
        {formError && <p className="error">{formError}</p>}
        <button type="submit">{editingId ? 'Save changes' : 'Add user'}</button>{' '}
        {editingId && (
          <button type="button" onClick={reset}>
            Cancel
          </button>
        )}
      </form>

      {error && <p className="error">{error}</p>}
      <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Interests</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.interests.join(', ')}</td>
              <td>
                <button onClick={() => startEdit(u)}>Edit</button>{' '}
                {u._id !== me.id && <button onClick={() => remove(u)}>Delete</button>}{' '}
                <Link to={`/admin/notes?owner=${u._id}`}>Notes</Link>{' '}
                <Link to={`/users/${u._id}/posts`}>Posts</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <Pagination meta={meta} onChange={setPage} />
    </>
  );
}
