import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const icons = {
  dashboard: '◈',
  transactions: '⇄',
  logout: '⎋',
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user
    ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || user.username[0].toUpperCase()
    : '?';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">FinTrack</div>

      <nav>
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span>{icons.dashboard}</span> Dashboard
        </NavLink>
        <NavLink to="/transactions" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span>{icons.transactions}</span> Transactions
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <div className="user-chip" style={{ marginBottom: '8px' }}>
          <div className="user-avatar">{initials}</div>
          <div>
            <div className="user-name">{user?.first_name || user?.username}</div>
            <div className="user-role">Free plan</div>
          </div>
        </div>
        <button className="nav-item btn-ghost" style={{ width: '100%', cursor: 'pointer', border: 'none' }} onClick={handleLogout}>
          <span>{icons.logout}</span> Sign out
        </button>
      </div>
    </aside>
  );
}
