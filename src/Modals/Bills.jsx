import React from 'react';

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
                <div className="bill-label">Description:</div >
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
                <div className="bill-label">Description:</div>
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

export default Bills;