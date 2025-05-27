import React, { useState } from 'react';
import '../Styles/Login.css';
import { useNavigate } from 'react-router-dom';
import { MdEmail, MdLock } from 'react-icons/md';

localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MjM0ODc0YzBjMTk2MDUyNjg0ZjAyMCIsInJvbGUiOiJBZG1pbiIsImVtYWlsIjoiRHlsYW5AZ21haWwuY29tIiwiaWF0IjoxNzQ4MzQ3MDU3LCJleHAiOjE3NDg0MzM0NTd9.DEh3LgtbYUH4yigjFVRyBfGgBDOWsUxHAcwYfUYOokQ');

function Login({ onLogin }) {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Vérification des identifiants
    const user = users.find(user => user.email === formData.email && user.password === formData.password);

    if (user) {
      // Connexion réussie
      console.log('Données de connexion soumises:', formData);
      if (onLogin) {
        onLogin(user);
      }
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      // Échec de la connexion
      setError('Identifiants incorrects');
    }
  };

  const handleSignIn = () => {
    navigate('/sign-in');
  };

  return (
    <div className="login-container">
      
      <div className="login-form-container">
        <div className="avatar-container">
          <div className="avatar-circle">
            <img src="/user-icon.svg" alt="User Icon" className="avatar-icon" />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <div className="input-with-icon">
              <MdEmail className="input-icon" />
              <input
                type="email"
                id="login-email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="login-password">Mot de passe</label>
            <div className="input-with-icon">
              <MdLock className="input-icon" />
              <input
                type="password"
                id="login-password"
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <button onClick={handleSubmit} type="submit" className="login-btn">Connexion</button>
        </form>
        
        <button onClick={handleSignIn} className="signin-btn">Créer un compte</button>
      </div>
    </div>
  );
}

export default Login;
