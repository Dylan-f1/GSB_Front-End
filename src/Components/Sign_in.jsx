import React, { useState } from 'react';
import '../styles/Sign_in.css';
import { useNavigate } from 'react-router-dom';
import { MdPerson, MdEmail } from 'react-icons/md';
import { FaLock } from 'react-icons/fa';

function SignIn() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('https://gsb-back-end.onrender.com/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Compte créé avec succès ! Redirection vers la connexion...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(data.message || 'Erreur lors de la création du compte');
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/');
  };

  return (
    <div className="sign-in-container">
      <div className="form-container">
        <div className="avatar-container">
          <div className="avatar-circle">
            <img src="/user-icon.svg" alt="User Icon" className="avatar-icon" />
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="signin-name">Prénom</label>
            <div className="input-with-icon">
              <MdPerson className="input-icon" />
              <input
                type="text"
                id="signin-name"
                name="name"
                placeholder="Prénom"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="signin-email">Email</label>
            <div className="input-with-icon">
              <MdEmail className="input-icon" />
              <input
                type="email"
                id="signin-email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="signin-password">Mot de passe</label>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                type="password"
                id="signin-password"
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>
          </div>
          
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Création en cours...' : 'Créer le compte'}
          </button>
        </form>

        <button onClick={handleLoginRedirect} className="login-redirect-btn">
          Déjà un compte ? Se connecter
        </button>
      </div>
    </div>
  );
}

export default SignIn;
