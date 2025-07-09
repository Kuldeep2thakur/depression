import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const NavContainer = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
`;

const Logo = styled(Link)`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: rgba(255, 255, 255, 0.9);
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(motion(Link))`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background: rgba(255,255,255,0.2);
    transform: translateY(-2px);
  }
  
  &.active {
    background: rgba(255,255,255,0.3);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 1rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
`;

const MobileNavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 1rem;
  border-radius: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255,255,255,0.2);
  }
  
  &.active {
    background: rgba(255,255,255,0.3);
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const AuthButton = styled(motion(Link))`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  background: ${props => props.primary ? 'rgba(255,255,255,0.2)' : 'transparent'};
  
  &:hover {
    background: rgba(255,255,255,0.3);
    transform: translateY(-2px);
  }
`;

const LogoutButton = styled(motion.button)`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    background: rgba(255,255,255,0.3);
    transform: translateY(-2px);
  }
`;

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/quiz', label: 'Quiz' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/contact', label: 'Contact' }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <NavContainer
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Logo to="/">
        <i className="fas fa-brain"></i>
        Mental Health Assessment
      </Logo>

      <NavLinks>
        {navItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={isActive(item.path) ? 'active' : ''}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {item.label}
          </NavLink>
        ))}
      </NavLinks>

      <AuthButtons>
        {user ? (
          <>
            <span style={{ color: 'white' }}>Welcome, {user.displayName || user.email}</span>
            <LogoutButton
              onClick={handleLogout}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </LogoutButton>
          </>
        ) : (
          <>
            <AuthButton to="/login" whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
              Login
            </AuthButton>
            <AuthButton to="/register" primary whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
              Register
            </AuthButton>
          </>
        )}
      </AuthButtons>

      <MobileMenuButton
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        whileTap={{ scale: 0.95 }}
      >
        <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </MobileMenuButton>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navItems.map((item) => (
              <MobileNavLink
                key={item.path}
                to={item.path}
                className={isActive(item.path) ? 'active' : ''}
              >
                {item.label}
              </MobileNavLink>
            ))}
            {user ? (
              <MobileNavLink as="button" onClick={handleLogout}>
                Logout
              </MobileNavLink>
            ) : (
              <>
                <MobileNavLink to="/login">Login</MobileNavLink>
                <MobileNavLink to="/register">Register</MobileNavLink>
              </>
            )}
          </MobileMenu>
        )}
      </AnimatePresence>
    </NavContainer>
  );
};

export default Navigation; 