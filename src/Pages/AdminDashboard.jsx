import React, { useState, useEffect, useMemo } from 'react';
import '../styles/AdminDashboard.css';
import { BillsList } from '../Modals/Bills';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import {
  MdGridView, MdReceipt, MdLogout,
  MdTrendingUp, MdAccessTime, MdCheckCircle, MdCancel, MdPeople
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, Filler);

const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

function AdminDashboard() {
  const [activePage, setActivePage] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState([]);
  const [adminName, setAdminName] = useState('Admin');
  const navigate = useNavigate();

  // Vérification auth + chargement admin name
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/'); return; }

    const decoded = decodeJWT(token);
    if (!decoded) { navigate('/'); return; }

    const role = decoded.role || decoded.Role || '';
    if (role !== 'admin' && role !== 'Admin') { navigate('/dashboard'); return; }

    setAdminName(decoded.name || decoded.nom || decoded.email || 'Admin');
    setLoading(false);
  }, [navigate]);

  // Chargement des factures pour le dashboard
  useEffect(() => {
    if (loading) return;
    const fetchBills = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/bills`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setBills(Array.isArray(data) ? data : (data.bills || []));
        }
      } catch (e) {
        console.error('Erreur chargement bills admin:', e);
      }
    };
    fetchBills();
  }, [loading]);

  // Données calculées pour les graphiques et stats
  const stats = useMemo(() => {
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return d;
    });
    const labels = last7Days.map(d => dayNames[d.getDay()]);
    const amountByDay = new Array(7).fill(0);
    const countByDay = new Array(7).fill(0);

    bills.forEach(bill => {
      const billDate = new Date(bill.date);
      if (isNaN(billDate.getTime())) return;
      last7Days.forEach((d, i) => {
        if (billDate.getDate() === d.getDate() &&
          billDate.getMonth() === d.getMonth() &&
          billDate.getFullYear() === d.getFullYear()) {
          amountByDay[i] += bill.amount || 0;
          countByDay[i]++;
        }
      });
    });

    const totalAmount = bills.reduce((s, b) => s + (b.amount || 0), 0);
    const pending = bills.filter(b => b.status === 'Pending').length;
    const approved = bills.filter(b => b.status === 'Approved').length;
    const rejected = bills.filter(b => b.status === 'Rejected').length;
    const weeklyTotal = amountByDay.reduce((s, a) => s + a, 0);

    // Répartition par type
    const byType = {};
    bills.forEach(b => { byType[b.type] = (byType[b.type] || 0) + 1; });
    const typeLabels = Object.keys(byType);
    const typeCounts = typeLabels.map(t => byType[t]);

    return { labels, amountByDay, countByDay, totalAmount, weeklyTotal,
      pending, approved, rejected, totalCount: bills.length, typeLabels, typeCounts };
  }, [bills]);

  const lineData = {
    labels: stats.labels,
    datasets: [{
      label: 'Montant (€)',
      data: stats.amountByDay,
      fill: true,
      backgroundColor: 'rgba(139, 92, 246, 0.12)',
      borderColor: 'rgba(139, 92, 246, 1)',
      tension: 0.4,
      pointBackgroundColor: 'rgba(139, 92, 246, 1)',
      pointBorderColor: '#fff',
      pointRadius: 4,
    }],
  };

  const lineOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y.toFixed(2)} €` } } },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a3b3cc', callback: v => `${v}€` } },
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a3b3cc' } }
    },
  };

  const barData = {
    labels: stats.labels,
    datasets: [{
      label: 'Factures',
      data: stats.countByDay,
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  const barOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a3b3cc', stepSize: 1 } },
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a3b3cc' } }
    },
  };

  const DashboardContent = () => (
    <div className="admin-dashboard-content">
      {/* Stat cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: '#3366ff' }}><MdReceipt /></div>
          <div className="admin-stat-info"><h4>{stats.totalCount}</h4><p>Total Factures</p></div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: '#8b5cf6' }}><MdTrendingUp /></div>
          <div className="admin-stat-info"><h4>{stats.totalAmount.toFixed(0)}€</h4><p>Montant Total</p></div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: '#f59e0b' }}><MdAccessTime /></div>
          <div className="admin-stat-info"><h4>{stats.pending}</h4><p>En Attente</p></div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: '#10b981' }}><MdCheckCircle /></div>
          <div className="admin-stat-info"><h4>{stats.approved}</h4><p>Approuvées</p></div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: '#ef4444' }}><MdCancel /></div>
          <div className="admin-stat-info"><h4>{stats.rejected}</h4><p>Rejetées</p></div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="admin-charts-row">
        <div className="admin-chart-card">
          <div className="admin-chart-header">
            <h3>{stats.weeklyTotal.toFixed(0)}€</h3>
            <p>Montant — 7 derniers jours</p>
          </div>
          <div className="admin-chart-container">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
        <div className="admin-chart-card">
          <div className="admin-chart-header">
            <h3>Factures par jour</h3>
            <p>7 derniers jours</p>
          </div>
          <div className="admin-chart-container">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activePage) {
      case 'bills': return <BillsList userRole="admin" />;
      case 'dashboard': default: return <DashboardContent />;
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="logo">
            <span className="logo-g">G</span>
            <span className="logo-s">S</span>
            <span className="logo-b">B</span>
          </div>
        </div>

        <div className="admin-profile">
          <div className="admin-avatar">
            <MdPeople />
          </div>
          <div className="admin-profile-info">
            <h3>{adminName}</h3>
            <span className="admin-badge">Administrateur</span>
          </div>
        </div>

        <nav className="admin-nav">
          <ul>
            <li className={activePage === 'dashboard' ? 'active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('dashboard'); }}>
                <MdGridView /> Dashboard
              </a>
            </li>
            <li className={activePage === 'bills' ? 'active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('bills'); }}>
                <MdReceipt /> Toutes les factures
              </a>
            </li>
          </ul>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={() => {
            localStorage.removeItem('token');
            navigate('/');
          }}>
            <MdLogout /> Déconnexion
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="admin-main-content">
        <div className="admin-topbar">
          <h1>
            {activePage === 'dashboard' && 'Tableau de bord'}
            {activePage === 'bills' && 'Gestion des factures'}
          </h1>
          <div className="admin-topbar-search">
            <input type="text" placeholder="Rechercher..." />
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}

export default AdminDashboard;
