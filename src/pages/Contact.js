import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { db, auth } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const ContactContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', sans-serif;
  color: #333;
  line-height: 1.6;
  position: relative;
`;

const Header = styled(motion.header)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 80px 0;
  position: relative;
  overflow: hidden;
`;

const HeaderTitle = styled.h1`
  font-family: 'Poppins', sans-serif;
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeaderDescription = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1.3rem;
  font-weight: 400;
  opacity: 0.9;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const Section = styled(motion.section)`
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
  
  @media (max-width: 768px) {
    margin: 20px;
    padding: 40px 20px;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
    background-size: 200% 100%;
    animation: gradientShift 3s ease-in-out infinite;
  }
`;

const SectionTitle = styled.h2`
  font-family: 'Poppins', sans-serif;
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 30px;
  color: #333;
  text-align: center;
  position: relative;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
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

const SectionDescription = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  margin-bottom: 20px;
  text-align: center;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const ContactInfo = styled(motion.div)`
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 30px 20px;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
  }
`;

const ContactItem = styled(motion.div)`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ContactIcon = styled.i`
  font-size: 2rem;
  color: #667eea;
  margin-right: 20px;
  min-width: 40px;
`;

const ContactContent = styled.div`
  h3 {
    font-family: 'Poppins', sans-serif;
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 5px;
    color: #2c3e50;
  }
  
  p {
    font-family: 'Inter', sans-serif;
    color: #666;
    line-height: 1.6;
  }
`;

const ContactForm = styled(motion.form)`
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
`;

const Label = styled.label`
  display: block;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  margin-bottom: 8px;
  color: #2c3e50;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  width: 100%;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
  }
`;

const FAQTitle = styled.h3`
  margin-bottom: 20px;
  color: #667eea;
  font-family: 'Poppins', sans-serif;
  font-size: 1.3rem;
  font-weight: 600;
`;

const FAQDescription = styled.p`
  font-family: 'Inter', sans-serif;
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;
`;

const Footer = styled.footer`
  background: rgba(0, 0, 0, 0.9);
  color: white;
  text-align: center;
  padding: 30px 20px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
`;

const contactInfo = [
  {
    id: 1,
    icon: 'fas fa-envelope',
    title: 'Email',
    content: 'kuldeepsengar5678@gmail.com'
  },
  {
    id: 2,
    icon: 'fas fa-phone',
    title: 'Phone',
    content: '7451042310'
  },
  {
    id: 3,
    icon: 'fas fa-clock',
    title: 'Support Hours',
    content: 'Monday - Friday: 9:00 AM - 6:00 PM'
  },
  {
    id: 4,
    icon: 'fas fa-map-marker-alt',
    title: 'Location',
    content: 'B72 Panchshell Colony\nLalkaun, Ghaziabad\nUttar Pradesh, India'
  }
];

const faqs = [
  {
    id: 1,
    question: 'How confidential is my assessment?',
    answer: 'Your privacy is our top priority. All assessments are completely anonymous and we do not store any personal identifying information. Your results are for your personal use only.'
  },
  {
    id: 2,
    question: 'Is this assessment a substitute for professional help?',
    answer: 'No, our assessment is designed to be a screening tool and should not replace professional medical advice. If you\'re experiencing severe symptoms, please consult with a mental health professional.'
  },
  {
    id: 3,
    question: 'How accurate are the results?',
    answer: 'Our assessment uses the PHQ-9, a scientifically validated screening tool used by healthcare professionals worldwide. However, it\'s important to discuss any concerns with a qualified mental health professional.'
  },
  {
    id: 4,
    question: 'Can I retake the assessment?',
    answer: 'Yes, you can retake the assessment as often as you\'d like. Many people find it helpful to track their mental health over time by taking regular assessments.'
  }
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState("");
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Auto-populate email field with logged-in user's email
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.email) {
        setFormData(prev => ({
          ...prev,
          email: user.email
        }));
      } else {
        // Clear email if user is not logged in
        setFormData(prev => ({
          ...prev,
          email: ''
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setStatus("Please log in to send a message.");
      return;
    }

    // Check if the entered email matches the logged-in user's email
    if (formData.email !== currentUser.email) {
      setStatus("The email address must match your registered email address.");
      return;
    }

    setStatus("Sending...");
    try {
      await addDoc(collection(db, "contacts"), {
        ...formData,
        userId: currentUser.uid,
        created: Timestamp.now()
      });
      setStatus("Thank you for your message! We will get back to you soon.");
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus("Error sending message. Please try again later.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <ContactContainer>
      <Header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <HeaderTitle>Get In Touch</HeaderTitle>
        <HeaderDescription>
          We're here to help and answer any questions you might have
        </HeaderDescription>
      </Header>

      <Section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <SectionTitle>Contact Information</SectionTitle>
        <SectionDescription>
          Reach out to us through any of the following channels. We're committed to providing you with the support and information you need.
        </SectionDescription>
        
        <ContactGrid>
          <ContactInfo
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            {contactInfo.map((item, index) => (
              <ContactItem
                key={item.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ContactIcon className={item.icon} />
                <ContactContent>
                  <h3>{item.title}</h3>
                  <p style={{ whiteSpace: 'pre-line' }}>{item.content}</p>
                </ContactContent>
              </ContactItem>
            ))}
          </ContactInfo>

          <ContactForm
            onSubmit={handleSubmit}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            {!auth.currentUser && (
              <div style={{ 
                backgroundColor: '#fff3cd', 
                border: '1px solid #ffeaa7', 
                borderRadius: '5px', 
                padding: '15px', 
                marginBottom: '20px',
                color: '#856404'
              }}>
                <i className="fas fa-info-circle"></i> Please log in to send a message. Your email address will be automatically filled with your registered email.
              </div>
            )}
            <FormGroup>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="email">Email Address * (Your registered email)</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email || (auth.currentUser ? 'Loading...' : 'Please log in')}
                onChange={handleInputChange}
                required
                readOnly
                style={{ 
                  backgroundColor: auth.currentUser ? '#f5f5f5' : '#ffe6e6', 
                  cursor: 'not-allowed',
                  color: auth.currentUser ? '#333' : '#999'
                }}
                placeholder={auth.currentUser ? 'Loading your email...' : 'Please log in to see your email'}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="subject">Subject *</Label>
              <Select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="technical">Technical Support</option>
                <option value="assessment">Assessment Questions</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Please describe your inquiry or concern..."
                required
              />
            </FormGroup>
            
            <SubmitButton
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className="fas fa-paper-plane"></i> Send Message
            </SubmitButton>
            {status && <div style={{ marginTop: '1rem', color: status.startsWith('Thank') ? 'green' : 'red' }}>{status}</div>}
          </ContactForm>
        </ContactGrid>
      </Section>

      <Section
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <SectionTitle>Frequently Asked Questions</SectionTitle>
        <SectionDescription>
          Find quick answers to common questions about our mental health assessment services.
        </SectionDescription>
        
        <ContactGrid>
          {faqs.slice(0, 2).map((faq, index) => (
            <ContactInfo
              key={faq.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2 }}
            >
              <FAQTitle>{faq.question}</FAQTitle>
              <FAQDescription>{faq.answer}</FAQDescription>
            </ContactInfo>
          ))}
        </ContactGrid>
        
        <ContactGrid>
          {faqs.slice(2, 4).map((faq, index) => (
            <ContactInfo
              key={faq.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: (index + 2) * 0.2 }}
            >
              <FAQTitle>{faq.question}</FAQTitle>
              <FAQDescription>{faq.answer}</FAQDescription>
            </ContactInfo>
          ))}
        </ContactGrid>
      </Section>

      <Footer>
        <p>&copy; 2024 Mental Health Assessment. All rights reserved.</p>
      </Footer>
    </ContactContainer>
  );
};

export default Contact; 