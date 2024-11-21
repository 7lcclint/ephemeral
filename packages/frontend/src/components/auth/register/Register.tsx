import React, { useState } from 'react';
import './RegisterStyle.css';
import facebookIcon from '../../../assets/icon/facebook.svg';
import facebookWhiteIcon from '../../../assets/icon/facebook-white.svg';
import googleIcon from '../../../assets/icon/google.svg';

interface RegisterProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const Register: React.FC<RegisterProps> = ({ isOpen, onRequestClose }) => {
  const [facebookHovered, setFacebookHovered] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('http://localhost:3456/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password, 
        }),
      });

      if (response.ok) {
        console.log('Registration successful!');
        onRequestClose();
      } else {
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="modal-login-overlay" onClick={onRequestClose}>
      <div className="modal-login-content" onClick={(e) => e.stopPropagation()}>
        <div className="register-container">
          <h1>Ephemeral</h1>
          <h4>Create your Ephemeral account</h4>
          <form onSubmit={handleSubmit}> 
            <div className="name-row">
              <div className="input-group name-group">
                <input 
                  type="text" 
                  id="first_name" 
                  placeholder=" " 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                />
                <label htmlFor="first_name">First Name</label>
              </div>
              <div className="input-group name-group">
                <input 
                  type="text" 
                  id="last_name" 
                  placeholder=" " 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                />
                <label htmlFor="last_name">Last Name</label>
              </div>
            </div>
            <div className="input-group">
              <input 
                type="email" 
                id="email" 
                placeholder=" " 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
              <label htmlFor="email">Email</label>
            </div>
            <div className="input-group">
              <input
                type="password"
                id="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="password">Password</label>
            </div>
            <div className="input-group">
              <input 
                type="password" 
                id="cf-password" 
                placeholder=" " 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
              />
              <label htmlFor="cf-password">Confirm Password</label>
            </div>
            <button type="submit">Register</button>
          </form>
          <div className="other-register-btn">
            <button type="button"> 
              <img src={googleIcon} alt="Google icon" />
              Continue with Google
            </button>
            <button
              type="button"
              onMouseEnter={() => setFacebookHovered(true)}
              onMouseLeave={() => setFacebookHovered(false)}
            >
              <img src={facebookHovered ? facebookWhiteIcon : facebookIcon} alt="Facebook icon" />
              Continue with Facebook
            </button>
          </div>
          <div className="have-account">
            <span>
              Already have an account? <a href="#" onClick={onRequestClose}>Login</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;