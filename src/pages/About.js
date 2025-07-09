import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';

const AboutContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Poppins', sans-serif;
  color: #333;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const HeroSection = styled(motion.div)`
  text-align: center;
  padding: 4rem 0;
  color: white;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroDescription = styled.p`
  font-size: 1.3rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ContentSection = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 3rem;
  margin: 2rem 0;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    padding: 2rem;
    margin: 1rem;
  }
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const MissionVisionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MissionCard = styled(motion.div)`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const CardDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const ValueItem = styled(motion.div)`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ValueIcon = styled.i`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const ValueTitle = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const ValueDescription = styled.p`
  font-size: 0.9rem;
`;

const TeamSection = styled.div`
  text-align: center;
  margin: 3rem 0;
`;

const TeamDescription = styled.p`
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 2rem;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const TeamMember = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }
`;

const MemberAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  margin: 0 auto 1rem;
`;

const MemberName = styled.h4`
  color: #2c3e50;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
`;

const MemberRole = styled.p`
  color: #7f8c8d;
  font-size: 1rem;
`;

const teamMembers = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    role: 'Clinical Psychologist',
    icon: 'fas fa-user-md'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Technology Lead',
    icon: 'fas fa-laptop-code'
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    role: 'Mental Health Counselor',
    icon: 'fas fa-heart'
  }
];

const values = [
  {
    id: 1,
    icon: 'fas fa-shield-alt',
    title: 'Privacy',
    description: 'Your data is secure and confidential'
  },
  {
    id: 2,
    icon: 'fas fa-handshake',
    title: 'Compassion',
    description: 'We care about your mental well-being'
  },
  {
    id: 3,
    icon: 'fas fa-lightbulb',
    title: 'Innovation',
    description: 'Using technology for better mental health'
  },
  {
    id: 4,
    icon: 'fas fa-users',
    title: 'Accessibility',
    description: 'Available to everyone, anywhere'
  }
];

const About = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
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
      transition: { duration: 0.5 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 }
    }
  };

  const valueVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <AboutContainer>
      <Container>
        <HeroSection
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroTitle>
            <i className="fas fa-users"></i> About Us
          </HeroTitle>
          <HeroDescription>
            Dedicated to providing accessible mental health assessment and support to everyone who needs it.
          </HeroDescription>
        </HeroSection>

        <ContentSection
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SectionTitle>
            <i className="fas fa-heart"></i> Our Mission & Vision
          </SectionTitle>
          
          <MissionVisionGrid>
            <MissionCard
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <CardTitle>
                <i className="fas fa-bullseye"></i> Our Mission
              </CardTitle>
              <CardDescription>
                To provide accessible, accurate, and compassionate mental health assessments that help individuals understand their mental well-being and guide them toward appropriate support and resources.
              </CardDescription>
            </MissionCard>
            
            <MissionCard
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <CardTitle>
                <i className="fas fa-eye"></i> Our Vision
              </CardTitle>
              <CardDescription>
                A world where mental health awareness is universal, stigma is eliminated, and everyone has access to the tools and support they need for optimal mental well-being.
              </CardDescription>
            </MissionCard>
          </MissionVisionGrid>
        </ContentSection>

        <ContentSection
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SectionTitle>
            <i className="fas fa-star"></i> Our Values
          </SectionTitle>
          
          <ValuesGrid>
            {values.map((value, index) => (
              <ValueItem
                key={value.id}
                variants={valueVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <ValueIcon className={value.icon} />
                <ValueTitle>{value.title}</ValueTitle>
                <ValueDescription>{value.description}</ValueDescription>
              </ValueItem>
            ))}
          </ValuesGrid>
        </ContentSection>

        <ContentSection
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <TeamSection>
            <SectionTitle>
              <i className="fas fa-user-friends"></i> Our Team
            </SectionTitle>
            <TeamDescription>
              Meet the dedicated professionals behind our mental health assessment platform.
            </TeamDescription>
            
            <TeamGrid>
              {teamMembers.map((member, index) => (
                <TeamMember
                  key={member.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  transition={{ delay: index * 0.2 }}
                >
                  <MemberAvatar>
                    <i className={member.icon}></i>
                  </MemberAvatar>
                  <MemberName>{member.name}</MemberName>
                  <MemberRole>{member.role}</MemberRole>
                </TeamMember>
              ))}
            </TeamGrid>
          </TeamSection>
        </ContentSection>
      </Container>
    </AboutContainer>
  );
};

export default About; 