import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, updateDoc, collection, addDoc, setDoc } from 'firebase/firestore';
import styled from 'styled-components';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const LoginForm = styled.form`
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  color: #333;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #666;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff0000;
  margin-top: 10px;
  text-align: center;
`;

const RegisterLink = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #666;
  a {
    color: #667eea;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: #666;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #ddd;
  }
  
  span {
    padding: 0 15px;
    font-size: 14px;
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  padding: 12px;
  background: white;
  color: #333;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  &:hover {
    background: #f8f9fa;
    border-color: #adb5bd;
  }
  
  &:disabled {
    background: #f8f9fa;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const GoogleIcon = styled.i`
  color: #4285f4;
  font-size: 18px;
`;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Sign in user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update last login in users collection
      await updateDoc(doc(db, "users", userCredential.user.uid), {
        lastLogin: new Date().toISOString()
      });

      // Add login history
      await addDoc(collection(db, "loginHistory"), {
        userId: userCredential.user.uid,
        email: formData.email,
        timestamp: new Date().toISOString(),
        success: true
      });

      navigate('/'); // Redirect to home page after successful login
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password');
      
      // Log failed login attempt
      await addDoc(collection(db, "loginHistory"), {
        email: formData.email,
        timestamp: new Date().toISOString(),
        success: false,
        error: err.message
      });
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in our database
      const userDoc = doc(db, "users", user.uid);
      
      // Add or update user data in Firestore
      await setDoc(userDoc, {
        name: user.displayName || 'Google User',
        email: user.email,
        photoURL: user.photoURL,
        provider: 'google',
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }, { merge: true });

      // Add login history
      await addDoc(collection(db, "loginHistory"), {
        userId: user.uid,
        email: user.email,
        timestamp: new Date().toISOString(),
        success: true,
        provider: 'google'
      });

      navigate('/'); // Redirect to home page after successful login
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError('Failed to sign in with Google. Please try again.');
      
      // Log failed login attempt
      await addDoc(collection(db, "loginHistory"), {
        email: 'google_signin_attempt',
        timestamp: new Date().toISOString(),
        success: false,
        error: err.message,
        provider: 'google'
      });
    }

    setLoading(false);
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <Title>Login</Title>
        
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <Button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        <Divider>
          <span>or</span>
        </Divider>

        <GoogleButton 
          type="button" 
          onClick={handleGoogleSignIn} 
          disabled={loading}
        >
          <GoogleIcon className="fab fa-google"></GoogleIcon>
          {loading ? 'Signing in...' : 'Continue with Google'}
        </GoogleButton>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <RegisterLink>
          Don't have an account? <Link to="/register">Register here</Link>
        </RegisterLink>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login; 