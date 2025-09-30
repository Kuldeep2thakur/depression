import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';

const HomeContainer = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

const HeaderSection = styled.header`
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  overflow: hidden;
`;

const VideoBackground = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%);
  z-index: 2;
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 4;
  max-width: 800px;
  padding: 0 20px;
`;

const Title = styled(motion.h1)`
  font-family: 'Poppins', sans-serif;
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 700;
  margin-bottom: 40px;
  line-height: 1.2;
`;

const Subtitle = styled(motion.p)`
  font-family: 'Inter', sans-serif;
  font-size: clamp(1.1rem, 2.5vw, 1.3rem);
  font-weight: 400;
  opacity: 0.9;
  margin-bottom: 50px;
  line-height: 1.6;
`;

const CTAButton = styled(motion.a)`
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 30px;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
  }
`;

const MainSection = styled.section`
  padding: 60px 20px;
  margin: 40px auto;
  max-width: 1200px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
`;

const SectionTitle = styled(motion.h2)`
  font-family: 'Poppins', sans-serif;
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 600;
  margin-bottom: 30px;
  color: #333;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    border-radius: 2px;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
`;

const FeatureCard = styled(motion.div)`
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  &:hover::before {
    transform: scaleX(1);
  }
`;

const FeatureIcon = styled.i`
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 20px;
`;

const FeatureTitle = styled.h3`
  font-family: 'Poppins', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const features = [
  {
    icon: 'fas fa-shield-alt',
    title: 'Professional & Secure',
    description: 'Our assessments are based on clinically validated methods and your privacy is our top priority.'
  },
  {
    icon: 'fas fa-clock',
    title: 'Quick & Easy',
    description: 'Complete your assessment in just 10 minutes and get instant, personalized results.'
  },
  {
    icon: 'fas fa-chart-line',
    title: 'Detailed Analysis',
    description: 'Receive comprehensive insights about your mental health status with actionable recommendations.'
  },
  {
    icon: 'fas fa-heart',
    title: 'Supportive Guidance',
    description: 'Get personalized recommendations and resources to support your mental health journey.'
  },
  {
    icon: 'fas fa-mobile-alt',
    title: 'Accessible Anywhere',
    description: 'Take your assessment on any device, anytime, anywhere - your mental health matters 24/7.'
  },
  {
    icon: 'fas fa-users',
    title: 'Expert Support',
    description: 'Connect with mental health professionals and get the support you need when you need it.'
  }
];

const Home = () => {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadeddata', () => setVideoLoaded(true));
      video.addEventListener('error', (e) => console.error('Video error:', e));
      
      return () => {
        video.removeEventListener('loadeddata', () => setVideoLoaded(true));
        video.removeEventListener('error', (e) => console.error('Video error:', e));
      };
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <HomeContainer>
      <HeaderSection>
        <VideoBackground
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/naturevideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </VideoBackground>
        <Overlay />
        <HeaderContent>
          <Title
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Welcome to Mental Health Assessment
          </Title>
          <Subtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Take control of your mental well-being with our comprehensive assessment tools
          </Subtitle>
          <CTAButton
            href="/quiz"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-play"></i> Start Assessment
          </CTAButton>
        </HeaderContent>
      </HeaderSection>

      <MainSection ref={ref}>
        <SectionTitle
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Why Choose Our Assessment?
        </SectionTitle>
        
        <FeaturesGrid
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <FeatureIcon className={feature.icon} />
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </MainSection>

      <MainSection>
        <SectionTitle
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Ready to Begin Your Journey?
        </SectionTitle>
        <motion.p
          style={{
            textAlign: 'center',
            fontSize: '1.2rem',
            marginBottom: '30px',
            color: '#666'
          }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Take the first step towards better mental health today. Our assessment will help you understand your current state and provide guidance for improvement.
        </motion.p>
        <motion.div
          style={{ textAlign: 'center' }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <CTAButton
            href="/quiz"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-clipboard-list"></i> Start Your Assessment
          </CTAButton>
        </motion.div>
      </MainSection>
    </HomeContainer>
  );
};

export default Home; 