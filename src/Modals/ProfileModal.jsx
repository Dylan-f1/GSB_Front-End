import React, { useState, useEffect } from 'react';
import { MdSave, MdClose, MdPerson, MdEmail, MdLock, MdCheckCircle, MdError } from 'react-icons/md';
import '../styles/ProfileModal.css';

const ProfileModal = ({ isOpen, onClose, onSave, currentUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', message }
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPassword('');
      setConfirmPassword('');
      setFeedback(null);
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (password && password !== confirmPassword) {
      setFeedback({ type: 'error', message: 'Les mots de passe ne correspondent pas.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const body = {
        name,
        newEmail: email,
        role: currentUser.role
      };
      if (password) body.password = password;

      const response = await fetch(`${API_URL}/users?email=${encodeURIComponent(currentUser.email)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || `Erreur ${response.status}`);
      }

      setFeedback({ type: 'success', message: 'Profil mis à jour avec succès !' });

      if (onSave) {
        onSave({ name, email, role: currentUser.role });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: error.message || 'Erreur lors de la mise à jour.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pm-overlay" onClick={onClose}>
      <div className="pm-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="pm-header">
          <h2>Modifier le profil</h2>
          <button className="pm-close-btn" onClick={onClose} aria-label="Fermer">
            <MdClose />
          </button>
        </div>

        {/* Avatar + infos actuelles */}
        <div className="pm-avatar-section">
          <div className="pm-avatar">
            <MdPerson />
          </div>
          <div className="pm-avatar-info">
            <strong>{currentUser?.name || 'Utilisateur'}</strong>
            <span className="pm-role-badge">
              {currentUser?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
            </span>
            <span className="pm-email">{currentUser?.email}</span>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`pm-feedback pm-feedback--${feedback.type}`}>
            {feedback.type === 'success' ? <MdCheckCircle /> : <MdError />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="pm-form">
          <div className="pm-field">
            <label htmlFor="pm-name">
              <MdPerson className="pm-field-icon" /> Nom
            </label>
            <input
              id="pm-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom"
              required
            />
          </div>

          <div className="pm-field">
            <label htmlFor="pm-email">
              <MdEmail className="pm-field-icon" /> Email
            </label>
            <input
              id="pm-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />
          </div>

          <div className="pm-divider">
            <span>Changer le mot de passe (optionnel)</span>
          </div>

          <div className="pm-field">
            <label htmlFor="pm-password">
              <MdLock className="pm-field-icon" /> Nouveau mot de passe
            </label>
            <input
              id="pm-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Laisser vide pour ne pas changer"
            />
          </div>

          <div className="pm-field">
            <label htmlFor="pm-confirm">
              <MdLock className="pm-field-icon" /> Confirmer le mot de passe
            </label>
            <input
              id="pm-confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Répéter le mot de passe"
            />
          </div>

          <div className="pm-actions">
            <button
              type="button"
              className="pm-btn pm-btn--cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="pm-btn pm-btn--save"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="pm-spinner"></span>
              ) : (
                <><MdSave /> Enregistrer</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
