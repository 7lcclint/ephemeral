  import React, { useState } from 'react';
  import './loginStyle.css';
  import googleIcon from '../../../assets/icon/google.svg';
  import facebookIcon from '../../../assets/icon/facebook.svg'
  import facebookWhiteIcon from '../../../assets/icon/facebook-white.svg'
  import Register from '../register/Register';
  import axios from 'axios';
  //import { useNavigate } from 'react-router-dom';
  

  interface LoginModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
  }

  const Login: React.FC<LoginModalProps> = ({ isOpen, onRequestClose }) => {
    const [isFacebookHovered, setIsFacebookHovered] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //const navigate = useNavigate();

    if (!isOpen) return null;
    if (showRegister) {
      return (
        <Register 
          isOpen={showRegister} 
          onRequestClose={() => setShowRegister(false)}
        />
      );
    }

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        const response = await axios.post('http://localhost:3456/login', 
          { email, password }
        );
  
        if (response.status === 200) {
          console.log('Login successful:', response.data);
          setEmail('');
          setPassword('');
  
          const user = response.data;
          console.log('User:', user.email);
          localStorage.setItem('user', JSON.stringify(user));
          //navigate('/');
          onRequestClose();
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    };  

    return (
      <div className="modal-login-overlay" onClick={onRequestClose}>
      <div className="modal-login-content" onClick={(e) => e.stopPropagation()}>
        <div className="login">
          <div className="login-content">
            <h1>EPHEMERAL</h1>
            <h4>Welcome back...</h4>
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <input
                  type="text"
                  name="email"
                  id="email"
                  className="input-email"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="email">Email</label>
              </div>
              <div className="input-group">
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="input-passwd"
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="password">Password</label>
              </div>
              <div className="btn-login">
                <a href="#">Forgot password?</a>
                <button type="submit">Login</button>
              </div>
            </form>
            <div className="or-line">
              <div className="line-or"></div>
              <span>or</span>
              <div className="line-or"></div>
            </div>
            <div className="other-login-btn">
              <button type="submit">
                <img src={googleIcon} alt="Google icon" />
                Login with Google
              </button>
              <button
                type="submit"
                onMouseEnter={() => setIsFacebookHovered(true)}
                onMouseLeave={() => setIsFacebookHovered(false)}
              >
                <img src={isFacebookHovered ? facebookWhiteIcon : facebookIcon} alt="Facebook icon" />
                Login with Facebook
              </button>
            </div>
            <div className="sign-up">
              <span>Don't have an account? <a href="#" onClick={() => setShowRegister(true)}>Sign up</a></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }

  export default Login;