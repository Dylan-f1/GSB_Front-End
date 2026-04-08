import React, { useState, useEffect, useMemo } from 'react';
import '../styles/Dashboard.css';
import { BillsList } from '../Modals/Bills';
import ProfileModal from '../Modals/ProfileModal';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { MdReceipt, MdPerson, MdLogout, MdGridView, MdTrendingUp, MdAccessTime, MdCheckCircle } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erreur lors du décodage du JWT:', error);
    return null;
  }
};

function UserDashboard() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState([]);
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: 'User'
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const decodedToken = decodeJWT(token);
        if (decodedToken) {
          const userRole = decodedToken.role || decodedToken.Role;
          if (userRole === 'admin' || userRole === 'Admin') {
            navigate('/admin');
            return;
          }

          setUserData({
            name: decodedToken.name || decodedToken.nom || decodedToken.email || 'Utilisateur',
            email: decodedToken.email || 'email@example.com',
            role: userRole || 'User'
          });
        } else {
          localStorage.removeItem('token');
          navigate('/');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = decodeJWT(token);
          if (decodedToken) {
            setUserData({
              name: decodedToken.name || decodedToken.nom || decodedToken.email || 'Utilisateur',
              email: decodedToken.email || 'email@example.com',
              role: decodedToken.role || decodedToken.Role || 'User'
            });
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Récupérer les factures pour alimenter les graphiques
  useEffect(() => {
    if (loading) return;

    const fetchBillsForCharts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${API_URL}/bills`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setBills(Array.isArray(data) ? data : (data.bills || []));
        }
      } catch (error) {
        console.error('Erreur chargement factures pour graphiques:', error);
      }
    };

    fetchBillsForCharts();
  }, [loading]);

  // Calculer les données des graphiques à partir des factures réelles
  const chartData = useMemo(() => {
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const today = new Date();

    // Construire les 7 derniers jours
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      last7Days.push(d);
    }

    const labels = last7Days.map(d => dayNames[d.getDay()]);
    const amountByDay = new Array(7).fill(0);
    const countByDay = new Array(7).fill(0);

    bills.forEach(bill => {
      const billDate = new Date(bill.date);
      if (isNaN(billDate.getTime())) return;

      for (let i = 0; i < 7; i++) {
        const d = last7Days[i];
        if (
          billDate.getDate() === d.getDate() &&
          billDate.getMonth() === d.getMonth() &&
          billDate.getFullYear() === d.getFullYear()
        ) {
          amountByDay[i] += bill.amount || 0;
          countByDay[i]++;
          break;
        }
      }
    });

    const totalAmount = bills.reduce((sum, b) => sum + (b.amount || 0), 0);
    const weeklyTotal = amountByDay.reduce((sum, a) => sum + a, 0);
    const pendingCount = bills.filter(b => b.status === 'Pending').length;
    const approvedCount = bills.filter(b => b.status === 'Approved').length;

    return {
      labels,
      amountByDay,
      countByDay,
      totalAmount,
      weeklyTotal,
      pendingCount,
      approvedCount,
      totalCount: bills.length
    };
  }, [bills]);

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const handleUpdateUserData = (updatedUserData) => {
    setUserData(prev => ({ ...prev, ...updatedUserData }));
    closeProfileModal();
  };

  const lineData = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Montant (€)',
        data: chartData.amountByDay,
        fill: true,
        backgroundColor: 'rgba(51, 102, 255, 0.12)',
        borderColor: 'rgba(51, 102, 255, 1)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(51, 102, 255, 1)',
        pointBorderColor: '#fff',
        pointRadius: 4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y.toFixed(2)} €`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#a3b3cc', callback: (v) => `${v}€` }
      },
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#a3b3cc' }
      }
    },
  };

  const barData = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Factures',
        data: chartData.countByDay,
        backgroundColor: 'rgba(0, 200, 83, 0.7)',
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#a3b3cc', stepSize: 1 }
      },
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#a3b3cc' }
      }
    },
  };

  const DashboardContent = () => (
    <div className="dashboard-content">
      {/* Cartes statistiques */}
      <div className="stats-grid">
        <div className="stat-mini-card">
          <div className="stat-mini-icon bills-mini-icon">
            <MdReceipt />
          </div>
          <div className="stat-mini-info">
            <h4>{chartData.totalCount}</h4>
            <p>Total Factures</p>
          </div>
        </div>
        <div className="stat-mini-card">
          <div className="stat-mini-icon revenue-mini-icon">
            <MdTrendingUp />
          </div>
          <div className="stat-mini-info">
            <h4>{chartData.totalAmount.toFixed(0)}€</h4>
            <p>Montant Total</p>
          </div>
        </div>
        <div className="stat-mini-card">
          <div className="stat-mini-icon pending-mini-icon">
            <MdAccessTime />
          </div>
          <div className="stat-mini-info">
            <h4>{chartData.pendingCount}</h4>
            <p>En Attente</p>
          </div>
        </div>
        <div className="stat-mini-card">
          <div className="stat-mini-icon approved-mini-icon">
            <MdCheckCircle />
          </div>
          <div className="stat-mini-info">
            <h4>{chartData.approvedCount}</h4>
            <p>Approuvées</p>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="charts-row">
        <div className="dashboard-card revenue-card">
          <div className="card-header">
            <h3>{chartData.weeklyTotal.toFixed(0)}€</h3>
            <p className="card-subtitle">Montant — 7 derniers jours</p>
          </div>
          <div className="chart-container">
            <Line data={lineData} options={lineOptions} />
          </div>
          <div className="card-footer">
            <button className="details-btn" onClick={() => setActivePage('bills')}>
              Voir les factures
            </button>
          </div>
        </div>

        <div className="dashboard-card performance-card">
          <div className="card-header">
            <h3>Factures par jour</h3>
            <p className="card-subtitle">7 derniers jours</p>
          </div>
          <div className="chart-container">
            <Bar data={barData} options={barOptions} />
          </div>
          <div className="stats-info">
            <p>
              <strong>{chartData.pendingCount}</strong>{' '}
              facture{chartData.pendingCount !== 1 ? 's' : ''} en attente de validation
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activePage) {
      case 'bills':
        return <BillsList userRole={userData.role} />;
      case 'profile':
        if (!isProfileModalOpen) openProfileModal();
        return <DashboardContent />;
      case 'dashboard':
      default:
        return <DashboardContent />;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-g">G</span>
            <span className="logo-s">S</span>
            <span className="logo-b">B</span>
          </div>
        </div>

        <div className="user-profile">
          <div className="profile-avatar">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </div>
          <div className="profile-info">
            <h3>{userData.name}</h3>
            <p>{userData.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className={activePage === 'dashboard' ? 'active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('dashboard'); }}>
                <MdGridView /> Dashboard
              </a>
            </li>
            <li className={activePage === 'bills' ? 'active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('bills'); }}>
                <MdReceipt /> Bills
              </a>
            </li>
            <li className={activePage === 'profile' ? 'active' : ''}>
              <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('profile'); }}>
                <MdPerson /> Profil
              </a>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={() => {
            localStorage.removeItem('token');
            navigate('/');
          }}>
            <MdLogout /> Déconnexion
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="dashboard-header">
          <h1>
            {activePage === 'dashboard' && 'Tableau de bord'}
            {activePage === 'bills' && 'Mes Factures'}
            {activePage === 'profile' && 'Mon Profil'}
          </h1>
          <div className="search-bar">
            <input type="text" placeholder="Rechercher..." />
          </div>
        </div>

        {renderContent()}
      </div>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => {
          closeProfileModal();
          if (activePage === 'profile') setActivePage('dashboard');
        }}
        onSave={handleUpdateUserData}
        currentUser={userData}
      />
    </div>
  );
}

export default UserDashboard;
