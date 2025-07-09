import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';

const ServicesContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Poppins', sans-serif;
  padding: 2rem;
`;

const Container = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
`;

const ServicesHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 4rem;
`;

const HeaderTitle = styled.h1`
  color: #2c3e50;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeaderDescription = styled.p`
  color: #7f8c8d;
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
`;

const Section = styled(motion.section)`
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
`;

const SectionDescription = styled.p`
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 2rem;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const ServiceCard = styled(motion.div)`
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
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
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
  
  &:hover::before {
    transform: scaleX(1);
  }
`;

const ServiceIcon = styled.i`
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 1.5rem;
`;

const ServiceTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2c3e50;
`;

const ServiceDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const ServiceFeatures = styled.ul`
  list-style: none;
  margin-bottom: 1.5rem;
`;

const ServiceFeature = styled.li`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #555;
  margin: 8px 0;
  padding-left: 20px;
  position: relative;
  
  &::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #667eea;
    font-weight: bold;
  }
`;

const Footer = styled.footer`
  background: rgba(0, 0, 0, 0.9);
  color: white;
  text-align: center;
  padding: 30px 20px;
  margin-top: 40px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
  border-radius: 10px;
  
  &:hover {
    background: rgba(0, 0, 0, 0.95);
  }
`;

const services = [
  {
    id: 1,
    icon: 'fas fa-brain',
    title: 'Mental Health Assessment',
    description: 'Comprehensive depression screening using scientifically validated tools to help you understand your mental health status.',
    features: [
      'PHQ-9 validated assessment',
      'Instant results and analysis',
      'Personalized recommendations',
      'Confidential and secure'
    ]
  },
  {
    id: 2,
    icon: 'fas fa-chart-line',
    title: 'Progress Tracking',
    description: 'Monitor your mental health journey over time with detailed progress reports and trend analysis.',
    features: [
      'Regular assessment reminders',
      'Progress visualization',
      'Trend analysis',
      'Goal setting support'
    ]
  },
  {
    id: 3,
    icon: 'fas fa-book-medical',
    title: 'Educational Resources',
    description: 'Access to comprehensive mental health education materials, coping strategies, and self-help resources.',
    features: [
      'Mental health articles',
      'Coping strategies',
      'Self-help guides',
      'Expert insights'
    ]
  },
  {
    id: 4,
    icon: 'fas fa-hands-helping',
    title: 'Support Resources',
    description: 'Connect with professional mental health resources and support networks in your area.',
    features: [
      'Professional referrals',
      'Support group connections',
      'Crisis resources',
      'Community support'
    ]
  },
  {
    id: 5,
    icon: 'fas fa-mobile-alt',
    title: 'Mobile Accessibility',
    description: 'Access your mental health assessment and resources anywhere, anytime with our mobile-friendly platform.',
    features: [
      'Mobile-optimized interface',
      'Offline capabilities',
      'Push notifications',
      'Cross-platform sync'
    ]
  },
  {
    id: 6,
    icon: 'fas fa-shield-alt',
    title: 'Privacy & Security',
    description: 'Your privacy and data security are our top priorities with enterprise-grade protection measures.',
    features: [
      'End-to-end encryption',
      'HIPAA compliance',
      'Anonymous assessments',
      'Data protection'
    ]
  }
];

const Services = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <ServicesContainer>
      <Container
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <ServicesHeader
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeaderTitle>Our Services</HeaderTitle>
          <HeaderDescription>
            Comprehensive mental health support and assessment tools designed for your well-being
          </HeaderDescription>
        </ServicesHeader>

        <Section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <SectionTitle>What We Offer</SectionTitle>
          <SectionDescription>
            We provide a range of mental health services designed to support your journey to better mental well-being. Our evidence-based approach ensures you receive reliable, confidential, and compassionate care.
          </SectionDescription>
          
          <ServicesGrid>
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <ServiceIcon className={service.icon} />
                <ServiceTitle>{service.title}</ServiceTitle>
                <ServiceDescription>{service.description}</ServiceDescription>
                <ServiceFeatures>
                  {service.features.map((feature, featureIndex) => (
                    <ServiceFeature key={featureIndex}>
                      {feature}
                    </ServiceFeature>
                  ))}
                </ServiceFeatures>
              </ServiceCard>
            ))}
          </ServicesGrid>
        </Section>

        <Section
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SectionTitle>How Our Services Help</SectionTitle>
          <SectionDescription>
            Our comprehensive suite of mental health services is designed to provide you with the tools, knowledge, and support you need to take control of your mental well-being. Whether you're looking for an initial assessment, ongoing monitoring, or educational resources, we're here to support your mental health journey.
          </SectionDescription>
          <SectionDescription>
            Each service is carefully designed to complement the others, creating a holistic approach to mental health care that addresses your unique needs and circumstances.
          </SectionDescription>
        </Section>

        <Footer>
          <p>&copy; 2024 Mental Health Assessment. All rights reserved.</p>
        </Footer>
      </Container>
    </ServicesContainer>
  );
};

export default Services; 