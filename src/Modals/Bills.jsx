import { useEffect, useRef, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import AddBillModal from './AddBillModal';
import '../Styles/Bills.css';

// Composant pour afficher la liste des factures
export function BillsList() {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const openModal = (bill) => {
    setSelectedBill(bill);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };
  
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };
  
  const handleSaveBill = async (billData) => {
    try {
      // Générer un ID unique pour la nouvelle facture
      const newId = bills.length > 0 
        ? String(Math.max(...bills.map(b => parseInt(b.id))) + 1).padStart(4, '0')
        : '1001';
      
      const newBill = {
        id: newId,
        ...billData
      };
      
      // Ajouter la nouvelle facture à la liste
      setBills(prevBills => [newBill, ...prevBills]);
      
      console.log('Nouvelle facture ajoutée:', newBill);
      
      // Fermer le modal
      closeAddModal();
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la facture:', error);
      throw error;
    }
  };
  
  return (
    <div className="bills-container">
      <div className="bills-header">
        <h2 className="bills-title">Mes Factures</h2>
        <button 
          className="add-bill-button"
          onClick={openAddModal}
        >
          <MdAdd /> Ajouter une facture
        </button>
      </div>
      
      {bills.length === 0 ? (
        <p className="no-bills-message">Aucune facture disponible</p>
      ) : (
        <div className="bills-list">
          {bills.map(bill => (
            <div 
              key={bill.id} 
              className="bill-item"
              onClick={() => openModal(bill)}
            >
              <div className="bill-header">
                <span className="bill-id">#{bill.id}</span>
                <span className={`bill-status status-${bill.status.toLowerCase()}`}>
                  {bill.status}
                </span>
              </div>
              
              <div className="bill-info">
                <div className="bill-type">{bill.type}</div>
                <div className="bill-date">{new Date(bill.date).toLocaleDateString()}</div>
              </div>
              
              <div className="bill-amount">${bill.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}
      
      {selectedBill && (
        <BillModal 
          bill={selectedBill} 
          isOpen={isModalOpen} 
          onClose={closeModal} 
        />
      )}
      
      {/* Modal d'ajout de facture */}
      <AddBillModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSave={handleSaveBill}
      />
    </div>
  );
}

// Composant modal existant
export default function BillModal({ bill, isOpen, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    // Handle escape key press
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    // Handle click outside modal
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Don't render anything if modal is closed or no bill data
  if (!isOpen || !bill) return null;

  // Function to determine status badge color
  const getStatusClasses = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="modal-container" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="modal-wrapper">
        {/* Backdrop with blur effect */}
        <div 
          className="modal-backdrop" 
          aria-hidden="true"
          onClick={onClose}
        ></div>
        
        <span className="modal-alignment-helper" aria-hidden="true">&#8203;</span>
        
        {/* Modal content */}
        <div 
          ref={modalRef}
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-body">
            <div className="modal-header">
              <div className="modal-title-container">
                <div className="modal-title-wrapper">
                  <h3 className="modal-title">Bill Details</h3>
                  <span className={`status-badge ${getStatusClasses(bill.status)}`}>
                    {bill.status}
                  </span>
                </div>
                
                <div className="bill-details">
                  <div className="details-grid">
                    <div className="detail-item">
                      <p className="detail-label">Bill ID</p>
                      <p className="detail-value">#{bill.id}</p>
                    </div>
                    <div className="detail-item">
                      <p className="detail-label">Date</p>
                      <p className="detail-value">{new Date(bill.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <p className="detail-label">Type</p>
                    <p className="detail-value">{bill.type}</p>
                  </div>
                  
                  <div className="detail-item">
                    <p className="detail-label">Amount</p>
                    <p className="detail-value amount">${bill.amount.toFixed(2)}</p>
                  </div>
                  
                  {bill.description && (
                    <div className="detail-item">
                      <p className="detail-label">Description</p>
                      <p className="detail-value">{bill.description}</p>
                    </div>
                  )}
                  
                  {bill.receipt && (
                    <div className="detail-item">
                      <p className="detail-label">Receipt</p>
                      <div className="receipt-link">
                        <svg className="receipt-icon" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
                        </svg>
                        <span className="receipt-text">View Receipt</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button
              type="button"
              className="close-button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 