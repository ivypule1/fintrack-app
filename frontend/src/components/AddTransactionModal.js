import { useState } from 'react';
import { transactionAPI } from '../utils/api';

const CATEGORIES = [
  'food', 'transport', 'bills', 'entertainment',
  'health', 'education', 'shopping', 'salary', 'freelance', 'other'
];

export default function AddTransactionModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    transaction_type: 'expense',
    category: 'other',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await transactionAPI.create(form);
      onSuccess();
      onClose();
    } catch {
      setError('Failed to save transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">Add transaction</div>
        {error && <div className="error-msg">{error}</div>}

        <div className="type-toggle">
          <button
            type="button"
            className={`type-btn expense ${form.transaction_type === 'expense' ? 'active' : ''}`}
            onClick={() => setForm({ ...form, transaction_type: 'expense' })}
          >
            Expense
          </button>
          <button
            type="button"
            className={`type-btn income ${form.transaction_type === 'income' ? 'active' : ''}`}
            onClick={() => setForm({ ...form, transaction_type: 'income' })}
          >
            Income
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input type="text" value={form.title} onChange={set('title')} placeholder="e.g. Woolworths groceries" required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group">
              <label>Amount (R)</label>
              <input type="number" step="0.01" min="0" value={form.amount} onChange={set('amount')} placeholder="0.00" required />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={form.date} onChange={set('date')} required />
            </div>
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={form.category} onChange={set('category')}>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Note (optional)</label>
            <input type="text" value={form.note} onChange={set('note')} placeholder="Any extra details..." />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 2 }}>
              {loading ? 'Saving...' : 'Save transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
