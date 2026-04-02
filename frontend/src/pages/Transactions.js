import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import AddTransactionModal from '../components/AddTransactionModal';
import { transactionAPI } from '../utils/api';

const fmt = (n) => `R ${Number(n).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;

const CATEGORIES = ['', 'food', 'transport', 'bills', 'entertainment', 'health', 'education', 'shopping', 'salary', 'freelance', 'other'];

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({ type: '', category: '', month: '', year: '' });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadTransactions = async () => {
    setLoading(true);
    const params = {};
    if (filters.type) params.type = filters.type;
    if (filters.category) params.category = filters.category;
    if (filters.month) params.month = filters.month;
    if (filters.year) params.year = filters.year;
    const { data } = await transactionAPI.getAll(params);
    setTransactions(data.results || data);
    setLoading(false);
  };

  useEffect(() => { loadTransactions(); }, [filters]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    await transactionAPI.delete(id);
    loadTransactions();
  };

  const setFilter = (field) => (e) => setFilters({ ...filters, [field]: e.target.value });

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-title">Transactions</div>
        <div className="page-subtitle">All your income and expenses in one place.</div>

        <div className="filters-row">
          <select value={filters.type} onChange={setFilter('type')}>
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select value={filters.category} onChange={setFilter('category')}>
            <option value="">All categories</option>
            {CATEGORIES.filter(c => c).map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
          <select value={filters.month} onChange={setFilter('month')}>
            <option value="">All months</option>
            {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Year e.g. 2025"
            value={filters.year}
            onChange={setFilter('year')}
            style={{ width: 140 }}
          />
          <button className="btn btn-primary" style={{ marginLeft: 'auto', padding: '8px 18px', fontSize: 13 }} onClick={() => setShowModal(true)}>
            + Add transaction
          </button>
        </div>

        <div className="transactions-card">
          {loading ? (
            <div className="empty-state">Loading...</div>
          ) : transactions.length === 0 ? (
            <div className="empty-state">No transactions found. Try adjusting your filters.</div>
          ) : (
            <table className="tx-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{tx.title}</div>
                      {tx.note && <div style={{ fontSize: 12, color: '#7a84a0' }}>{tx.note}</div>}
                    </td>
                    <td>
                      <span className={`tx-type-badge ${tx.transaction_type}`}>
                        {tx.transaction_type}
                      </span>
                    </td>
                    <td><span className="category-tag">{tx.category}</span></td>
                    <td style={{ color: '#7a84a0', fontSize: 13 }}>{tx.date}</td>
                    <td>
                      <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 14, color: tx.transaction_type === 'income' ? 'var(--income)' : 'var(--expense)' }}>
                        {tx.transaction_type === 'expense' ? '-' : '+'}{fmt(tx.amount)}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-danger" onClick={() => handleDelete(tx.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} onSuccess={loadTransactions} />}
    </div>
  );
}
