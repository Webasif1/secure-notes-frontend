import { useState } from 'react';
import { api, splitList } from '../api.js';
import { useAuth } from '../AuthContext.jsx';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, interests: user.interests.join(', '), password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const save = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const body = { name: form.name, interests: splitList(form.interests) };
      if (form.password) body.password = form.password;
      const res = await api('/auth/me', { method: 'PATCH', body });
      setUser(res.data);
      setForm({ ...form, password: '' });
      setMessage('Profile saved.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="card narrow" onSubmit={save}>
      <h2>My Profile</h2>
      <p>
        {user.email} · role: <b>{user.role}</b>
      </p>
      <label>Name</label>
      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <label>Interests (comma separated)</label>
      <input value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} />
      <label>New password (leave empty to keep)</label>
      <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <button type="submit">Save</button>
    </form>
  );
}
