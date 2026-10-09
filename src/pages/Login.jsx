import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { splitList } from '../api.js';

export default function AuthPage({ mode }) {
  const { user, login, register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', interests: '' });
  const [error, setError] = useState('');
  const isRegister = mode === 'register';

  if (user) return <Navigate to="/notes" replace />;

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await register({ ...form, interests: splitList(form.interests) });
      } else {
        await login({ email: form.email, password: form.password });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="card narrow" onSubmit={submit}>
      <h2>{isRegister ? 'Create account' : 'Login'}</h2>
      {isRegister && <input placeholder="Name" value={form.name} onChange={set('name')} required />}
      <input type="email" placeholder="Email" value={form.email} onChange={set('email')} required />
      <input
        type="password"
        placeholder="Password (min 8 characters)"
        value={form.password}
        onChange={set('password')}
        required
      />
      {isRegister && (
        <input
          placeholder="Interests, comma separated (e.g. chess, reading)"
          value={form.interests}
          onChange={set('interests')}
        />
      )}
      {error && <p className="error">{error}</p>}
      <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      <p>
        {isRegister ? (
          <>
            Have an account? <Link to="/login">Login</Link>
          </>
        ) : (
          <>
            No account? <Link to="/register">Register</Link>
          </>
        )}
      </p>
    </form>
  );
}
