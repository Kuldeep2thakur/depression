import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import LoadingSpinner from './components/LoadingSpinner';
import Chatbot from './components/Chatbot';
import Login from './pages/Login';
import Register from './pages/Register';
import { auth } from './firebase';

// Lazy load components for better performance
const Home = lazy(() => import('./pages/Home'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Result = lazy(() => import('./pages/Result'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));

function ProtectedRoute({ children }) {
  const user = auth.currentUser;
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <div className="App">
      <Navigation />
      <AnimatePresence mode="wait">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route 
              path="/" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Home />
                </motion.div>
              } 
            />
            <Route 
              path="/quiz" 
              element={
                <ProtectedRoute>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Quiz />
                  </motion.div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/result" 
              element={
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Result />
                </motion.div>
              } 
            />
            <Route 
              path="/about" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <About />
                </motion.div>
              } 
            />
            <Route 
              path="/services" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Services />
                </motion.div>
              } 
            />
            <Route 
              path="/contact" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Contact />
                </motion.div>
              } 
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
      <Chatbot />
    </div>
  );
}

export default App; 