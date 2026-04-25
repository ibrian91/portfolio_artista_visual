import React, { useState } from 'react';
import './PasswordPopup.css';

const PasswordPopup = ({ onSubmit }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <div className="password-popup-overlay">
      <div className="password-popup">
        <form onSubmit={handleSubmit}>
          <h2>Ingresar Contraseña</h2>
          <p>Por favor, ingresa la contraseña para acceder al formulario.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />
          <button type="submit">Acceder</button>
        </form>
      </div>
    </div>
  );
};

export default PasswordPopup;
