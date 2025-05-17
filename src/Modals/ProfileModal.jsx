import React, { useState } from 'react';
import { MdArrowBack } from 'react-icons/md';
import '../Styles/ProfileModal.css';

const ProfileModal = ({ isOpen, onClose, currentUser }) => {
  // États pour les champs du formulaire
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, vous pourriez ajouter la logique pour sauvegarder les informations
    console.log('Profil mis à jour:', { name, email, password });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="profile-modal">
        <div className="profile-header">
          <button className="back-button" onClick={onClose}>
            <MdArrowBack />
          </button>
          <h2>Edit Profile</h2>
        </div>

        <div className="profile-content">
          <div className="profile-avatar-container">
            <div className="profile-avatar-large">
              {/* Placeholder pour l'avatar */}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Mail</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="youremail@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>

            <div className="profile-actions">
              <button type="submit" className="save-button">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal; 