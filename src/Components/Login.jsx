import React, { useState } from 'react';
import '../Styles/Login.css';
import { useNavigate } from 'react-router-dom';
import { MdEmail, MdLock } from 'react-icons/md';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

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
    console.log('Données de connexion soumises:', formData);
    navigate('/Dashboard');
  };

  return (
    <div className="login-container">
      
      <div className="login-form-container">
        <div className="avatar-container">
          <div className="avatar-circle">
            <img src="/user-icon.svg" alt="User Icon" className="avatar-icon" />
          </div>
        </div>

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
              />
            </div>
          </div>
          
          <button type="submit" className="login-btn">Connexion</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
