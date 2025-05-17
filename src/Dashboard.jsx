import React, { useState } from 'react';
import '../Styles/Dashboard.css';
import { Line, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { MdDashboard, MdReceipt, MdPerson, MdSettings, MdLogout, MdGridView, MdFilterList } from 'react-icons/md';

// Enregistrer les composants ChartJS nécessaires
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

// Composant Bills avec design mis à jour
const Bills = () => {
  return (
    <div className="bills-container">
      <div className="bills-header">
        <h2>Mes Factures</h2>
        <button className="filter-btn">
          <span className="filter-icon">≡</span> Filtrer
        </button>
      </div>
      <div className="bills-grid">
        <div className="bill-card">
          <div className="bill-card-header">
            <h3>Facture #12345</h3>
            <span className="bill-date">15/06/2023</span>
          </div>
          <div className="bill-card-content">
            <div className="bill-info">
              <div className="bill-label">Montant:</div>
              <div className="bill-value">450€</div>
            </div>
            <div className="bill-info">
              <div className="bill-label">Client:</div>
              <div className="bill-value">Pharmacie du Centre</div>
            </div>
            <div className="bill-info">
              <div className="bill-label">Statut:</div>
              <div className="bill-status paid">Payée</div>
            </div>
          </div>
          <div className="bill-actions-row">
            <button className="btn-voir">Voir</button>
            <button className="btn-telecharger">Télécharger</button>
          </div>
        </div>
        
        <div className="bill-card">
          <div className="bill-card-header">
            <h3>Facture #12346</h3>
            <span className="bill-date">22/06/2023</span>
          </div>
          <div className="bill-card-content">
            <div className="bill-info">
              <div className="bill-label">Montant:</div>
              <div className="bill-value">750€</div>
            </div>
            <div className="bill-info">
              <div className="bill-label">Client:</div>
              <div className="bill-value">Clinique Saint-Louis</div>
            </div>
            <div className="bill-info">
              <div className="bill-label">Statut:</div>
              <div className="bill-status pending">En attente</div>
            </div>
          </div>
          <div className="bill-actions-row">
            <button className="btn-voir">Voir</button>
            <button className="btn-telecharger">Télécharger</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant principal Dashboard
function Dashboard() {
  const [activePage, setActivePage] = useState('dashboard');

  // Données pour le graphique linéaire
  const lineData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Revenu',
        data: [800, 950, 1000, 1250, 1100, 1300, 1250],
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Données pour le graphique à barres
  const barData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Ventes',
        data: [20, 35, 25, 45, 30, 40, 50],
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Composant DashboardContent
  const DashboardContent = () => (
    <div className="dashboard-content">
      <div className="dashboard-card revenue-card">
        <div className="card-header">
          <h3>$1250</h3>
          <p className="card-subtitle">Revenu hebdomadaire</p>
        </div>
        <div className="chart-container">
          <Line data={lineData} options={lineOptions} />
        </div>
        <div className="card-footer">
          <button className="details-btn">Détails</button>
        </div>
      </div>

      <div className="dashboard-card performance-card">
        <div className="card-header">
          <h3>Sales Performance</h3>
        </div>
        <div className="chart-container">
          <Bar data={barData} options={barOptions} />
        </div>
        <div className="stats-info">
          <p><strong>20%</strong> d'augmentation des ventes par rapport à la semaine dernière</p>
        </div>
      </div>
    </div>
  );

  // Fonction pour rendre le contenu en fonction de la page active
  const renderContent = () => {
    switch(activePage) {
      case 'bills':
        return <Bills />;
      case 'profile':
        return <div className="profile-container"><h2>Page Profil</h2></div>;
      case 'settings':
        return <div className="settings-container"><h2>Page Paramètres</h2></div>;
      case 'dashboard':
      default:
        return <DashboardContent />;
    }
  };

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
            <svg 
              viewBox="0 0 24 24" 
              fill="currentColor" 
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </div>
          <div className="profile-info">
            <h3>Jean Dupont</h3>
            <p>Utilisateur</p>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li className={activePage === 'dashboard' ? 'active' : ''}>
              <a href="#" onClick={() => setActivePage('dashboard')}><MdGridView /> Dashboard</a>
            </li>
            <li className={activePage === 'bills' ? 'active' : ''}>
              <a href="#" onClick={() => { setActivePage('bills'); }}><MdReceipt /> Bills</a>
            </li>
            <li className={activePage === 'profile' ? 'active' : ''}>
              <a href="#" onClick={() => setActivePage('profile')}><MdPerson /> Profil</a>
            </li>
            <li className={activePage === 'settings' ? 'active' : ''}>
              <a href="#" onClick={() => setActivePage('settings')}><MdSettings /> Paramètres</a>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <button className="logout-btn"><MdLogout /> Déconnexion</button>
        </div>
      </div>

      <div className="main-content">
        <div className="dashboard-header">
          <h1>
            {activePage === 'dashboard' && 'Tableau de bord'}
            {activePage === 'bills' && 'Mes Factures'}
            {activePage === 'profile' && 'Mon Profil'}
            {activePage === 'settings' && 'Paramètres'}
          </h1>
          <div className="search-bar">
            <input type="text" placeholder="Rechercher..." />
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}

export default Dashboard; 