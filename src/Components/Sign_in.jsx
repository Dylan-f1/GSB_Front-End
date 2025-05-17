import React, { useState } from 'react';
import '../Styles/Sign_in.css';
import { useNavigate } from 'react-router-dom';
import { MdPerson, MdEmail } from 'react-icons/md';
import { FaUser, FaLock } from 'react-icons/fa';

function SignIn() {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
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
    console.log('Données soumises:', formData);
    navigate('/Login');
  };

  return (
    <div className="sign-in-container">
      
      <div className="form-container">
        <div className="avatar-container">
          <div className="avatar-circle">
            <img src="/user-icon.svg" alt="User Icon" className="avatar-icon" />
          </div>
        </div>
        
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
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="signin-surname">Nom</label>
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <input
                type="text"
                id="signin-surname"
                name="surname"
                placeholder="Nom"
                value={formData.surname}
                onChange={handleChange}
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
              />
            </div>
          </div>
          
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
