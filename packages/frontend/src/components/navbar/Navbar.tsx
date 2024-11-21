import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NavbarStyle.css';
import Login from '../auth/login/Login';

interface MenuItem {
  label: string;
  link: string;
}

const menuItems: MenuItem[] = [
  { label: 'Home', link: '/' },
  { label: 'About', link: '/about' },
  { label: 'Services', link: '/services' },
  { label: 'Login', link: '#' }
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsMenuOpen(false);
        setIsClosing(false);
      }, 300);
    } else {
      setIsMenuOpen(true);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="navbar">
      <nav>
        <div className="home-icon">
          <Link to="/">EPHEMERAL</Link>
        </div>
        {isDesktop ? (
          <ul className="menu-items">
            {menuItems.map((item) => (
              <li key={item.link}>
                {item.label === 'Login' ? (
                  <Link to={"/"} onClick={openModal}>{item.label}</Link>
                ) : (
                  <Link to={item.link}>{item.label}</Link>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <>
            <button className="menu-toggle" onClick={toggleMenu}>
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="close-icon"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="menu-icon"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
            <div className={`menu-overlay ${isMenuOpen ? 'open' : ''} ${isClosing ? 'closing' : ''}`}>
              <ul className="menu-items">
                {menuItems.map((item) => (
                  <li key={item.link}>
                    {item.label === 'Login' ? (
                      <Link to={"/"} onClick={openModal}>{item.label}</Link>
                    ) : (
                      <Link to={item.link} onClick={() => setIsMenuOpen(false)}>
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </nav>
      <Login isOpen={isModalOpen} onRequestClose={closeModal} /> 
    </div>
  );
};

export default Navbar;