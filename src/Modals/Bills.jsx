import React, { useState, useEffect } from 'react';
import AddBillModal from './AddBillModal';
import '../Styles/Bills.css';

// Token pour l'authentification API
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MjM0ODc0YzBjMTk2MDUyNjg0ZjAyMCIsInJvbGUiOiJBZG1pbiIsImVtYWlsIjoiRHlsYW5AZ21haWwuY29tIiwiaWF0IjoxNzQ3NjQ3NDg0LCJleHAiOjE3NDc3MzM4ODR9.Se2JClCZcyV1QgCm-ld7i5PCRSCNsAR4eJsAkRv1gyo";

// Composant Bills avec design mis à jour
const Bills = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      (async () => {
        try{
          const response = await fetch('http://localhost:5000/api/bills',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });
          const data = await response.json();
          setBills(data);
        }catch(e){
          console.error('Erreur lors de la récupération des factures:', e);
        }
      })();
    }, []);

    const handleAddBill = () => {
      setShowAddModal(true);
    };

    const handleCloseModal = () => {
      setShowAddModal(false);
    };

    // Fonction pour ajouter une nouvelle facture
    const handleSaveBill = async (billData) => {
      try {
        const response = await fetch('http://localhost:5000/api/bills', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(billData)
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de l\'ajout de la facture');
        }
        
        // Récupérer les factures mises à jour
        fetchBills();
        
        // Fermer le modal
        setShowAddModal(false);
      } catch (e) {
        console.error('Erreur lors de l\'ajout de la facture:', e);
        alert('Impossible d\'ajouter la facture');
      }
    };

    // Fonction pour afficher le statut en français
    const getStatusLabel = (status) => {
      switch (status) {
        case 'pending': return 'En attente';
        case 'paid': return 'Payée';
        case 'cancelled': return 'Annulée';
        default: return status;
      }
    };

    return (
      <div className="bills-container">
        <div className="bills-header">
          <h2>Mes Factures</h2>
          <button className="add-bill-btn" onClick={handleAddBill}>Ajouter une facture</button>
        </div>

        {loading ? (
          <p>Chargement des factures...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="bills-grid">
            {bills.length === 0 ? (
              <p>Aucune facture trouvée</p>
            ) : (
              bills.map((bill) => (
                <div className="bill-card" key={bill._id}>
                  <div className="bill-card-header">
                    <h3>Facture #{bill._id ? bill._id.substring(0, 6) : 'N/A'}</h3>
                    <span className="bill-date">{bill.date}</span>
                  </div>
                  <div className="bill-card-content">
                    <div className="bill-info">
                      <div className="bill-label">Montant:</div>
                      <div className="bill-value">{bill.amount}€</div>
                    </div>
                    <div className="bill-info">
                      <div className="bill-label">Description:</div>
                      <div className="bill-value">{bill.description}</div>
                    </div>
                    <div className="bill-info">
                      <div className="bill-label">Type:</div>
                      <div className="bill-value">{bill.type === 'expense' ? 'Dépense' : 'Revenu'}</div>
                    </div>
                    <div className="bill-info">
                      <div className="bill-label">Statut:</div>
                      <div className={`bill-status ${bill.status}`}>{getStatusLabel(bill.status)}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal pour ajouter une facture */}
        <AddBillModal 
          isOpen={showAddModal} 
          onClose={handleCloseModal}
          onSave={handleSaveBill}
        />
      </div>
    );
};

export default Bills;