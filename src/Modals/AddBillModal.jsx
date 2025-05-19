import React, { useState } from 'react';
import { MdCalendarToday, MdClose, MdCheck } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../Styles/AddBillModal.css';

const AddBillModal = ({ isOpen, onClose, onSave }) => {
  const [billData, setBillData] = useState({
    date: new Date(),
    amount: '',
    description: '',
    status: 'pending',
    type: 'expense'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setBillData(prev => ({
      ...prev,
      date: date
    }));
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Formatage exact des données pour correspondre au format attendu par l'API
    const formattedData = {
      date: formatDate(billData.date),
      amount: Number(billData.amount),
      description: billData.description,
      status: billData.status,
      type: billData.type
    };
    
    console.log('Données formatées envoyées:', formattedData);
    
    try {
      await onSave(formattedData);
      onClose();  // Fermer le modal seulement si l'opération réussit
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      // Ne pas fermer le modal en cas d'erreur
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target.className === 'modal-overlay') onClose();
    }}>
      <div className="add-bill-modal">
        <div className="add-bill-header">
          <h2>Ajouter une facture</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="add-bill-form">
          <div className="form-group date-group">
            <DatePicker
              selected={billData.date}
              onChange={handleDateChange}
              placeholderText="Date"
              className="date-input"
              dateFormat="dd-MM-yyyy"
              required
            />
            <div className="date-icon">
              <MdCalendarToday />
            </div>
          </div>
          
          <div className="form-group">
            <input 
              type="number" 
              name="amount" 
              placeholder="Montant" 
              value={billData.amount}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <textarea 
              name="description" 
              placeholder="Description de la facture" 
              value={billData.description}
              onChange={handleChange}
              rows={4}
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <select 
              name="status" 
              value={billData.status}
              onChange={handleChange}
              required
            >
              <option value="pending">En attente</option>
              <option value="paid">Payée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>
          
          <div className="form-group">
            <select 
              name="type" 
              value={billData.type}
              onChange={handleChange}
              required
            >
              <option value="expense">Dépense</option>
              <option value="income">Revenu</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler <MdClose />
            </button>
            <button 
              type="submit" 
              className="save-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'} {!isSubmitting && <MdCheck />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBillModal; 