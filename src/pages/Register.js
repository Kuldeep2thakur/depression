import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, collection, addDoc, getDoc, updateDoc } from 'firebase/firestore';
import styled from 'styled-components';
import OTPVerification from '../components/OTPVerification';
import { sendOTPEmail } from '../utils/emailService';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const RegisterForm = styled.form`
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

const SuccessMessage = styled.div`
  color: #00aa00;
  margin-top: 10px;
  text-align: center;
`;

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [verificationId, setVerificationId] = useState('');
  const navigate = useNavigate();

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOTP = async (email) => {
    const otp = generateOTP();
    
    try {
      // Store OTP in Firestore with timestamp
      const otpDoc = await addDoc(collection(db, "otpVerification"), {
        email,
        otp,
        createdAt: new Date().toISOString(),
        verified: false,
        attempts: 0
      });
      
      setVerificationId(otpDoc.id);

      // Send OTP via email
      const emailSent = await sendOTPEmail(email, otp);
      
      if (!emailSent) {
        throw new Error('Failed to send verification email');
      }

      // For development, still log the OTP
      if (process.env.NODE_ENV === 'development') {
        console.log('Development OTP:', otp);
      }
      
      return true;
    } catch (err) {
      console.error('Error sending OTP:', err);
      throw new Error('Failed to send verification code');
    }
  };

  const verifyOTP = async (enteredOTP) => {
    try {
      const otpRef = doc(db, "otpVerification", verificationId);
      const otpDoc = await getDoc(otpRef);
      
      if (!otpDoc.exists()) {
        setError('Invalid verification code');
        return false;
      }

      const otpData = otpDoc.data();
      
      // Check if OTP is expired (15 minutes validity)
      const createdAt = new Date(otpData.createdAt);
      const now = new Date();
      if ((now - createdAt) > 15 * 60 * 1000) {
        setError('Verification code expired');
        return false;
      }

      if (otpData.otp === enteredOTP) {
        await updateDoc(otpRef, { verified: true });
        return true;
      } else {
        await updateDoc(otpRef, { attempts: otpData.attempts + 1 });
        setError('Invalid verification code');
        return false;
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError('Error verifying code');
      return false;
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password should be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      if (!showOTP) {
        // First step: Send OTP
        const otpSent = await sendOTP(formData.email);
        if (otpSent) {
          setShowOTP(true);
          setSuccess('Verification code sent to your email');
        } else {
          throw new Error('Failed to send verification code');
        }
      }
      setLoading(false);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleOTPVerification = async (otp) => {
    setLoading(true);
    try {
      const isValid = await verifyOTP(otp);
      
      if (isValid) {
        // Create user in Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        // Update profile with display name
        await updateProfile(userCredential.user, {
          displayName: formData.name
        });

        // Store additional user data in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: formData.name,
          email: formData.email,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        });

        setSuccess('Registration successful! Redirecting...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.message);
    }
    setLoading(false);
  };

  const handleResendOTP = async () => {
    setLoading(true);
    await sendOTP(formData.email);
    setSuccess('New verification code sent');
    setLoading(false);
  };

  return (
    <RegisterContainer>
      <RegisterForm onSubmit={handleSubmit}>
        <Title>Create Account</Title>
        
        {!showOTP ? (
          <>
            <FormGroup>
              <Label htmlFor="name">Full Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </FormGroup>

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

            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <Button type="submit" disabled={loading}>
              {loading ? 'Sending Verification Code...' : 'Register'}
            </Button>
          </>
        ) : (
          <OTPVerification
            email={formData.email}
            onVerify={handleOTPVerification}
            onResendOTP={handleResendOTP}
          />
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
      </RegisterForm>
    </RegisterContainer>
  );
};

export default Register; 