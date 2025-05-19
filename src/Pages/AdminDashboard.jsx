import React, { useState } from 'react';
import '../Styles/AdminDashboard.css';
import { MdSearch, MdAdd, MdEdit, MdDelete, MdCheck, MdArrowBack } from 'react-icons/md';

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('bills');
  const [selectedBills, setSelectedBills] = useState({
    'Coca': false,
    'Big Mac': false,
    'Nuggets': false
  });

  const toggleBillSelection = (billName) => {
    setSelectedBills(prev => ({
      ...prev,
      [billName]: !prev[billName]
    }));
  };

  const renderBillsList = () => {
    return (
      <div className="bills-view">
        <div className="bills-header">
          <button className="back-button">
            <MdArrowBack />
          </button>
          <span>Bills</span>
        </div>
        
        <div className="bills-form">
          <div className="form-group">
            <label>Product Name</label>
            <input type="text" placeholder="Name" className="form-input" />
          </div>
          
          <div className="form-group">
            <label>ID of bills</label>
            <input type="text" placeholder="ID" className="form-input" />
          </div>
          
          <div className="form-group">
            <label>State</label>
            <input type="text" placeholder="Status" className="form-input" />
          </div>
        </div>

        <div className="action-button">
          <span>Button</span>
        </div>
      </div>
    );
  };

  const renderBillsDetail = () => {
    return (
      <div className="bills-detail">
        <div className="bills-detail-header">
          <h3>Macdo's Bills</h3>
          <p className="bills-subtitle"></p>
        </div>
        
        <div className="bills-items">
          {Object.keys(selectedBills).map((item) => (
            <div className="bill-item" key={item}>
              <div className="item-marker">A</div>
              <div className="item-name">{item}</div>
              <div className="item-dots">:</div>
              <div 
                className={`item-checkbox ${selectedBills[item] ? 'checked' : ''}`}
                onClick={() => toggleBillSelection(item)}
              >
                {selectedBills[item] && <MdCheck />}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="logo">
          <span className="logo-g">G</span>
          <span className="logo-s">S</span>
          <span className="logo-b">B</span>
          <span className="logo-dot">.</span>
        </div>
        
        <div className="search-container">
          <div className="search-bar">
            <MdSearch className="search-icon" />
            <input type="text" placeholder="Search..." />
          </div>
        </div>
        
        <div className="user-button">
          <button className="user-btn">User</button>
        </div>
      </div>
      
      <div className="admin-content">
        <div className="admin-sidebar">
          <button className="sidebar-btn add-btn">
            <MdAdd /> ADD BILLS
          </button>
          <button className="sidebar-btn update-btn">
            <MdEdit /> UPDATE BILLS
          </button>
          <button className="sidebar-btn delete-btn">
            <MdDelete /> DELETE
          </button>
        </div>
        
        <div className="admin-main">
          {renderBillsList()}
          {renderBillsDetail()}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 