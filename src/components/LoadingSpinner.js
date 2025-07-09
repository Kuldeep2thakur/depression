import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Spinner = styled(motion.div)`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
`;

const LoadingText = styled(motion.p)`
  color: white;
  font-size: 1.2rem;
  margin-top: 20px;
  font-family: 'Inter', sans-serif;
`;

const LoadingSpinner = () => {
  return (
    <SpinnerContainer>
      <div style={{ textAlign: 'center' }}>
        <Spinner
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <LoadingText
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Loading...
        </LoadingText>
      </div>
    </SpinnerContainer>
  );
};

export default LoadingSpinner; 