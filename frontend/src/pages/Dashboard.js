import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title
} from 'chart.js';
import Sidebar from '../components/Sidebar';
import AddTransactionModal from '../components/AddTransactionModal';
import { transactionAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const CATEGORY_COLORS = [
  '#4f8ef7','#00c9a7','#ff5c7c','#ffb347','#a78bfa','#34d399','#fb923c','#f472b6','#60a5fa','#94a3b8'
];

const fmt = (n) => `R ${Number(n).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [recentTx, setRecentTx] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const now = new Date();

  const loadData = async () => {
    const [sumRes, txRes] = await Promise.all([
      transactionAPI.getSummary({ month: now.getMonth() + 1, year: now.getFullYear() }),
      transactionAPI.getAll({ page_size: 5 }),
    ]);
    setSummary(sumRes.data);
    setRecentTx(txRes.data.results || txRes.data);
  };

  useEffect(() => { loadData(); }, []);

  const doughnutData = summary ? {
    labels: summary.by_category.map(c => c.category.charAt(0).toUpperCase() + c.category.slice(1)),
    datasets: [{
      data: summary.by_category.map(c => c.total),
      backgroundColor: CATEGORY_COLORS,
      borderWidth: 0,
    }],
  } : null;

  const barData = summary ? {
    labels: MONTH_NAMES,
    datasets: [
      {
        label: 'Income',
        data: summary.monthly_trend.map(m => m.income),
        backgroundColor: 'rgba(0,201,167,0.7)',
        borderRadius: 4,
      },
      {
        label: 'Expenses',
        data: summary.monthly_trend.map(m => m.expense),
        backgroundColor: 'rgba(255,92,124,0.7)',
        borderRadius: 4,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: '#7a84a0', font: { size: 12 } } } },
    scales: {
      x: { ticks: { color: '#7a84a0' }, grid: { color: 'rgba(255,255,255,0.04)' } },
      y: { ticks: { color: '#7a84a0' }, grid: { color: 'rgba(255,255,255,0.04)' } },
    },
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-title">Good {now.getHours() < 12 ? 'morning' : now.getHours() < 18 ? 'afternoon' : 'evening'}, {user?.first_name || user?.username} 👋</div>
        <div className="page-subtitle">{MONTH_NAMES[now.getMonth()]} {now.getFullYear()} overview</div>

        {summary && (
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-label">Total income</div>
              <div className="summary-amount income">{fmt(summary.total_income)}</div>
            </div>
            <div className="summary-card">
              <div className="summary-label">Total expenses</div>
              <div className="summary-amount expense">{fmt(summary.total_expenses)}</div>
            </div>
            <div className="summary-card">
              <div className="summary-label">Balance</div>
              <div className={`summary-amount ${summary.balance >= 0 ? 'income' : 'expense'}`}>
                {fmt(summary.balance)}
              </div>
            </div>
          </div>
        )}

        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-title">Spending by category</div>
            {doughnutData && doughnutData.labels.length > 0
              ? <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#7a84a0', font: { size: 11 }, padding: 12 } } } }} />
              : <div className="empty-state">No expense data this month</div>
            }
          </div>
          <div className="chart-card">
            <div className="chart-title">Monthly trend</div>
            {barData && <Bar data={barData} options={chartOptions} />}
          </div>
        </div>

        <div className="transactions-card">
          <div className="transactions-header">
            <span style={{ fontWeight: 500, fontSize: 15 }}>Recent transactions</span>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => setShowModal(true)}>
                + Add
              </button>
              <Link to="/transactions" className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: 13, textDecoration: 'none' }}>
                View all
              </Link>
            </div>
          </div>
          {recentTx.length === 0 ? (
            <div className="empty-state">No transactions yet. Add your first one!</div>
          ) : (
            <table className="tx-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTx.slice(0, 5).map(tx => (
                  <tr key={tx.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{tx.title}</div>
                      {tx.note && <div style={{ fontSize: 12, color: '#7a84a0' }}>{tx.note}</div>}
                    </td>
                    <td><span className="category-tag">{tx.category}</span></td>
                    <td style={{ color: '#7a84a0', fontSize: 13 }}>{tx.date}</td>
                    <td>
                      <span className={`summary-amount ${tx.transaction_type}`} style={{ fontSize: 15 }}>
                        {tx.transaction_type === 'expense' ? '-' : '+'}{fmt(tx.amount)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} onSuccess={loadData} />}
    </div>
  );
}
