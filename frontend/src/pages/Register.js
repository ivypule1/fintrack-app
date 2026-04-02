import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', first_name: '', last_name: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authAPI.register(form);
      await login({ username: form.username, password: form.password });
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      setError(data?.username?.[0] || data?.password?.[0] || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">FinTrack</div>
        <div className="auth-tagline">Your money, clearly.</div>
        <div className="auth-title">Create account</div>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group">
              <label>First name</label>
              <input type="text" value={form.first_name} onChange={set('first_name')} placeholder="Mpho" />
            </div>
            <div className="form-group">
              <label>Last name</label>
              <input type="text" value={form.last_name} onChange={set('last_name')} placeholder="Pule" />
            </div>
          </div>
          <div className="form-group">
            <label>Username</label>
            <input type="text" value={form.username} onChange={set('username')} placeholder="mpho_pule" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="mpho@email.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={set('password')} placeholder="Min 8 characters" required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <div className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
