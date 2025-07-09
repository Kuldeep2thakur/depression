import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ResultContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Poppins', sans-serif;
  padding: 2rem;
`;

const Container = styled(motion.div)`
  max-width: 900px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  
  @media (max-width: 768px) {
    margin: 1rem;
    padding: 1.5rem;
  }
`;

const ResultHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
`;

const HeaderTitle = styled.h1`
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeaderDescription = styled.p`
  color: #7f8c8d;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const ErrorMessage = styled(motion.div)`
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  text-align: center;
  border: 1px solid #f5c6cb;
`;

const ScoreContainer = styled(motion.div)`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 3rem;
  border-radius: 20px;
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
    transform: translateX(-100%);
    animation: shimmer 3s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const ProgressRing = styled.div`
  width: 200px;
  height: 200px;
  margin: 0 auto 2rem;
  position: relative;
  
  svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }
  
  circle {
    fill: none;
    stroke-width: 8;
    stroke-linecap: round;
  }
  
  .bg {
    stroke: rgba(255, 255, 255, 0.3);
  }
  
  .progress {
    stroke: white;
    stroke-dasharray: 0 628;
    transition: stroke-dasharray 2s ease;
  }
`;

const ScoreNumber = styled.div`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const ScoreLabel = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
`;

const ScoreOutOf = styled.div`
  font-size: 1.1rem;
  opacity: 0.9;
  position: relative;
  z-index: 1;
`;

const InterpretationContainer = styled(motion.div)`
  background: white;
  border: 2px solid #e74c3c;
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const InterpretationHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const InterpretationIcon = styled.i`
  font-size: 2rem;
  margin-right: 1rem;
  color: #e74c3c;
`;

const InterpretationTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
`;

const InterpretationText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  margin-bottom: 1.5rem;
`;

const SeverityLevel = styled.span`
  display: inline-block;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &.severity-minimal {
    background: #d4edda;
    color: #155724;
  }
  
  &.severity-mild {
    background: #fff3cd;
    color: #856404;
  }
  
  &.severity-moderate {
    background: #f8d7da;
    color: #721c24;
  }
  
  &.severity-severe {
    background: #f5c6cb;
    color: #721c24;
  }
`;

const Recommendations = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    
    i {
      margin-right: 0.5rem;
    }
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    
    &:last-child {
      border-bottom: none;
    }
    
    i {
      margin-right: 0.5rem;
      color: #f093fb;
    }
  }
`;

const ActionButtons = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Button = styled(motion.button)`
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  &.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
    }
  }
  
  &.btn-secondary {
    background: #e74c3c;
    color: white;
    box-shadow: 0 10px 30px rgba(231, 76, 60, 0.3);
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 40px rgba(231, 76, 60, 0.4);
    }
  }
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
`;

const Result = () => {
  const [score, setScore] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get score from localStorage
    const storedScore = parseInt(localStorage.getItem('quizScore'));
    
    if (storedScore === null || isNaN(storedScore)) {
      setHasError(true);
      return;
    }

    setScore(storedScore);
    
    // Calculate result data
    const maxScore = 40;
    const percentage = (storedScore / maxScore) * 100;
    const circumference = 2 * Math.PI * 90;
    const progress = (percentage / 100) * circumference;

    let severity, label, interpretation, recommendations;

    if (storedScore <= 4) {
      severity = 'minimal';
      label = 'Minimal Depression';
      interpretation = 'Your responses indicate minimal symptoms of depression. You appear to be experiencing normal mood fluctuations that are part of everyday life. Continue maintaining your current healthy lifestyle and coping strategies.';
      recommendations = [
        'Continue your current healthy lifestyle',
        'Maintain regular exercise and sleep patterns',
        'Stay connected with friends and family',
        'Practice stress management techniques',
        'Consider regular mental health check-ins'
      ];
    } else if (storedScore <= 9) {
      severity = 'mild';
      label = 'Mild Depression';
      interpretation = 'Your responses suggest mild symptoms of depression. While these symptoms are not severe, they may be affecting your daily life. Consider implementing some self-care strategies and monitoring your mood.';
      recommendations = [
        'Increase physical activity and exercise',
        'Improve sleep hygiene and routine',
        'Practice mindfulness and meditation',
        'Connect with supportive friends and family',
        'Consider talking to a counselor or therapist'
      ];
    } else if (storedScore <= 14) {
      severity = 'moderate';
      label = 'Moderate Depression';
      interpretation = 'Your responses indicate moderate symptoms of depression that are likely affecting your daily functioning. Professional help is recommended to develop effective coping strategies and treatment options.';
      recommendations = [
        'Seek professional mental health support',
        'Consider therapy or counseling sessions',
        'Talk to your doctor about treatment options',
        'Build a strong support network',
        'Practice self-care and stress reduction'
      ];
    } else if (storedScore <= 19) {
      severity = 'moderate';
      label = 'Moderately Severe Depression';
      interpretation = 'Your responses suggest moderately severe symptoms of depression that are significantly impacting your life. Professional intervention is strongly recommended to address these symptoms effectively.';
      recommendations = [
        'Seek immediate professional mental health help',
        'Consider medication evaluation with a psychiatrist',
        'Start therapy or counseling as soon as possible',
        'Inform trusted friends and family for support',
        'Develop a safety plan if needed'
      ];
    } else {
      severity = 'severe';
      label = 'Severe Depression';
      interpretation = 'Your responses indicate severe symptoms of depression that require immediate professional attention. Please reach out to a mental health professional or crisis hotline as soon as possible.';
      recommendations = [
        'Seek immediate professional mental health help',
        'Contact a crisis hotline if in distress',
        'Consider inpatient treatment if recommended',
        'Inform your doctor about your symptoms',
        'Build a comprehensive support network'
      ];
    }

    setResultData({
      percentage,
      progress,
      circumference,
      severity,
      label,
      interpretation,
      recommendations
    });

    // Update progress ring after component mounts
    setTimeout(() => {
      const progressCircle = document.querySelector('.progress');
      if (progressCircle) {
        progressCircle.style.strokeDasharray = `${progress} ${circumference}`;
      }
    }, 500);
  }, []);

  const handleRetakeQuiz = () => {
    localStorage.removeItem('quizScore');
    navigate('/quiz');
  };

  const handleGetHelp = () => {
    navigate('/contactus');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (hasError) {
    return (
      <ResultContainer>
        <Container
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <ResultHeader
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <HeaderTitle>
              <i className="fas fa-chart-line"></i> Your Assessment Results
            </HeaderTitle>
            <HeaderDescription>
              Based on your responses, here's your mental health assessment score
            </HeaderDescription>
          </ResultHeader>

          <ErrorMessage
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <i className="fas fa-exclamation-triangle"></i>
            <strong> No quiz data found!</strong> Please complete the quiz first.
          </ErrorMessage>

          <ActionButtons
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              className="btn btn-secondary"
              onClick={handleRetakeQuiz}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-redo"></i> Take Quiz
            </Button>
            <Button
              className="btn btn-primary"
              onClick={handleBackToHome}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-home"></i> Back to Home
            </Button>
          </ActionButtons>
        </Container>
      </ResultContainer>
    );
  }

  if (!resultData) {
    return (
      <ResultContainer>
        <Container>
          <ResultHeader>
            <HeaderTitle>Loading Results...</HeaderTitle>
          </ResultHeader>
        </Container>
      </ResultContainer>
    );
  }

  return (
    <ResultContainer>
      <Container
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <ResultHeader
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeaderTitle>
            <i className="fas fa-chart-line"></i> Your Assessment Results
          </HeaderTitle>
          <HeaderDescription>
            Based on your responses, here's your mental health assessment score
          </HeaderDescription>
        </ResultHeader>

        <ScoreContainer
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <ProgressRing>
            <svg>
              <circle className="bg" cx="100" cy="100" r="90"></circle>
              <circle className="progress" cx="100" cy="100" r="90"></circle>
            </svg>
          </ProgressRing>
          <ScoreNumber>{score}</ScoreNumber>
          <ScoreLabel>{resultData.label}</ScoreLabel>
          <ScoreOutOf>out of 40 points</ScoreOutOf>
        </ScoreContainer>

        <InterpretationContainer
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <InterpretationHeader>
            <InterpretationIcon className="fas fa-lightbulb"></InterpretationIcon>
            <InterpretationTitle>What This Means</InterpretationTitle>
          </InterpretationHeader>
          <InterpretationText>{resultData.interpretation}</InterpretationText>
          <SeverityLevel className={`severity-${resultData.severity}`}>
            {resultData.severity.toUpperCase()}
          </SeverityLevel>
        </InterpretationContainer>

        <Recommendations
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <h3>
            <i className="fas fa-heart"></i> Recommendations
          </h3>
          <ul>
            {resultData.recommendations.map((rec, index) => (
              <li key={index}>
                <i className="fas fa-check"></i> {rec}
              </li>
            ))}
          </ul>
        </Recommendations>

        <ActionButtons
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <Button
            className="btn btn-secondary"
            onClick={handleRetakeQuiz}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-redo"></i> Retake Quiz
          </Button>
          <Button
            className="btn btn-primary"
            onClick={handleGetHelp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-phone"></i> Get Help
          </Button>
          <Button
            className="btn btn-primary"
            onClick={handleBackToHome}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-home"></i> Back to Home
          </Button>
        </ActionButtons>
      </Container>
    </ResultContainer>
  );
};

export default Result; 