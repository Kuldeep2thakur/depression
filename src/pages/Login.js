import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';
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

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <RegisterLink>
          Don't have an account? <Link to="/register">Register here</Link>
        </RegisterLink>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login; 