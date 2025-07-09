import React, { useState } from 'react';
import styled from 'styled-components';

const OTPContainer = styled.div`
  margin-top: 20px;
`;

const OTPInput = styled.input`
  width: 50px;
  height: 50px;
  margin: 0 8px;
  font-size: 24px;
  text-align: center;
  border: 2px solid #ddd;
  border-radius: 8px;
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const OTPMessage = styled.div`
  margin-top: 10px;
  color: ${props => props.error ? '#ff0000' : '#00aa00'};
  text-align: center;
`;

const ResendButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 10px;
  &:disabled {
    color: #999;
    cursor: not-allowed;
  }
`;

const OTPVerification = ({ onVerify, onResendOTP, email }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(30);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to next input
    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }

    // If all digits are filled, verify OTP
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      onVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);

      // Move to previous input
      if (e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    }
  };

  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendOTP = () => {
    onResendOTP();
    setCountdown(30);
  };

  return (
    <OTPContainer>
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        Enter the verification code sent to {email}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {otp.map((digit, index) => (
          <OTPInput
            key={index}
            type="text"
            maxLength="1"
            value={digit}
            onChange={e => handleChange(e.target, index)}
            onKeyDown={e => handleKeyDown(e, index)}
            autoFocus={index === 0}
          />
        ))}
      </div>
      {error && <OTPMessage error>{error}</OTPMessage>}
      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        {countdown > 0 ? (
          <span>Resend code in {countdown}s</span>
        ) : (
          <ResendButton onClick={handleResendOTP}>
            Resend verification code
          </ResendButton>
        )}
      </div>
    </OTPContainer>
  );
};

export default OTPVerification; 