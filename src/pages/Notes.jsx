import { useState } from 'react';
import { api } from '../api.js';
import { usePaged } from '../components/usePaged.js';
import Pagination from '../components/Pagination.jsx';

function NoteItem({ note, onChanged }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: note.title, content: note.content });
  const [error, setError] = useState('');

  const save = async () => {
    try {
      await api(`/notes/${note._id}`, { method: 'PATCH', body: form });
      setEditing(false);
      onChanged();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async () => {
    if (!confirm('Delete this note?')) return;
    try {
      await api(`/notes/${note._id}`, { method: 'DELETE' });
      onChanged();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <li className="card">
      {editing ? (
        <>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <button onClick={save}>Save</button> <button onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{note.title}</h3>
          <p className="pre">{note.content}</p>
          <small>{new Date(note.updatedAt).toLocaleString()}</small>
          <div>
            <button onClick={() => setEditing(true)}>Edit</button> <button onClick={remove}>Delete</button>
          </div>
        </>
      )}
      {error && <p className="error">{error}</p>}
    </li>
  );
}

export default function Notes() {
  const { data, meta, error, setPage, reload } = usePaged('/notes', 'notes', 5);
  const [form, setForm] = useState({ title: '', content: '' });
  const [formError, setFormError] = useState('');

  const create = async (e) => {
    e.preventDefault();
    try {
      await api('/notes', { method: 'POST', body: form });
      setForm({ title: '', content: '' });
      setFormError('');
      setPage(1);
      reload();
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <>
      <h2>My Notes</h2>
      <form className="card" onSubmit={create}>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        {formError && <p className="error">{formError}</p>}
        <button type="submit">Add note</button>
      </form>
      {error && <p className="error">{error}</p>}
      <ul className="list">
        {data.map((note) => (
          <NoteItem key={note._id + note.updatedAt} note={note} onChanged={reload} />
        ))}
      </ul>
      {meta?.total === 0 && <p>No notes yet.</p>}
      <Pagination meta={meta} onChange={setPage} />
    </>
  );
}
