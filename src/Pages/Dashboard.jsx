import React, { useState } from 'react';
import '../Styles/Dashboard.css';
import Bills from '../Modals/Bills';
import ProfileModal from '../Modals/ProfileModal';
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
import { MdDashboard, MdReceipt, MdPerson, MdLogout, MdGridView, MdFilterList } from 'react-icons/md';

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

// Composant principal Dashboard
function Dashboard() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Données utilisateur (fictives pour le moment)
  const currentUser = {
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com'
  };

  // Ouvrir le modal de profil
  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  // Fermer le modal de profil
  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

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
        // Au lieu d'afficher la page profil, on ouvre le modal
        // et on affiche le dashboard
        if (!isProfileModalOpen) {
          openProfileModal();
        }
        return <DashboardContent />;
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
              <a href="#" onClick={() => { setActivePage('profile'); }}><MdPerson /> Profil</a>
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
          </h1>
          <div className="search-bar">
            <input type="text" placeholder="Rechercher..." />
          </div>
        </div>

        {renderContent()}
      </div>
      
      {/* Modal pour éditer le profil */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => {
          closeProfileModal();
          // Retourner au dashboard si on était sur la page profil
          if (activePage === 'profile') {
            setActivePage('dashboard');
          }
        }} 
        currentUser={currentUser} 
      />
    </div>
  );
}

export default Dashboard;
