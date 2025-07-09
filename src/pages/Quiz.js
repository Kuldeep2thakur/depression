import React, { useState } from 'react';
import styled from 'styled-components';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const phq9Questions = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
  'Trouble concentrating on things, such as reading the newspaper or watching television',
  'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
  'Thoughts that you would be better off dead or of hurting yourself in some way',
];

const options = [
  { label: 'Not at all', value: 0 },
  { label: 'Several days', value: 1 },
  { label: 'More than half the days', value: 2 },
  { label: 'Nearly every day', value: 3 },
];

const Container = styled.div`
  max-width: 600px;
  margin: 40px auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(102, 126, 234, 0.15);
  padding: 32px 24px;
  font-family: 'Inter', sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  color: #667eea;
  margin-bottom: 24px;
`;

const Question = styled.div`
  margin-bottom: 32px;
`;

const QuestionText = styled.p`
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 12px;
`;

const OptionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const OptionLabel = styled.label`
  background: #f7f8fa;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  border: 1px solid #eaeaea;
  transition: background 0.2s, border 0.2s;
  &:hover, &.selected {
    background: #e0e7ff;
    border-color: #667eea;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 16px;
  transition: background 0.2s;
  &:hover {
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  }
`;

const ResultBox = styled.div`
  background: #f7f8fa;
  border-radius: 12px;
  padding: 24px;
  margin-top: 32px;
  text-align: center;
  font-size: 1.1rem;
`;

const Disclaimer = styled.div`
  font-size: 0.95rem;
  color: #888;
  margin-top: 24px;
  text-align: center;
`;

const ResourcesBox = styled.div`
  background: #e0e7ff;
  border-radius: 10px;
  padding: 20px;
  margin-top: 32px;
  font-size: 1rem;
`;

function interpretScore(score) {
  if (score <= 4) return { level: 'Minimal depression', color: '#4caf50' };
  if (score <= 9) return { level: 'Mild depression', color: '#8bc34a' };
  if (score <= 14) return { level: 'Moderate depression', color: '#ffc107' };
  if (score <= 19) return { level: 'Moderately severe depression', color: '#ff9800' };
  return { level: 'Severe depression', color: '#f44336' };
}

const mentalHealthResources = [
  {
    name: 'National Suicide Prevention Lifeline (US)',
    url: 'https://988lifeline.org/',
    desc: '24/7, free and confidential support for people in distress.'
  },
  {
    name: 'Find a Therapist (Psychology Today)',
    url: 'https://www.psychologytoday.com/us/therapists',
    desc: 'Search for mental health professionals near you.'
  },
  {
    name: 'MentalHealth.gov',
    url: 'https://www.mentalhealth.gov/',
    desc: 'US government resource for mental health information.'
  },
  {
    name: 'International Helplines',
    url: 'https://www.opencounseling.com/suicide-hotlines',
    desc: 'List of suicide hotlines and mental health resources worldwide.'
  },
  {
    name: 'Crisis Text Line',
    url: 'https://www.crisistextline.org/',
    desc: 'Text HOME to 741741 to connect with a Crisis Counselor.'
  },
];

const Quiz = () => {
  const [answers, setAnswers] = useState(Array(phq9Questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleOptionChange = (qIdx, value) => {
    const newAnswers = [...answers];
    newAnswers[qIdx] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (answers.some(a => a === null)) {
      alert('Please answer all questions.');
      return;
    }
    const total = answers.reduce((sum, val) => sum + Number(val), 0);
    setScore(total);
    setSubmitted(true);
    setSaving(true);
    setSaveError('');
    // Save result to Firestore
    try {
      const user = auth.currentUser;
      await addDoc(collection(db, 'quizResults'), {
        answers,
        score: total,
        result: interpretScore(total).level,
        createdAt: new Date().toISOString(),
        userId: user ? user.uid : null,
        email: user ? user.email : null,
      });
      setSaving(false);
    } catch (err) {
      setSaveError('Failed to save your result.');
      setSaving(false);
    }
  };

  const { level, color } = interpretScore(score);

  return (
    <Container>
      <Title>Depression Self-Assessment (PHQ-9)</Title>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          {phq9Questions.map((q, idx) => (
            <Question key={idx}>
              <QuestionText>{idx + 1}. {q}</QuestionText>
              <OptionGroup>
                {options.map(opt => (
                  <OptionLabel
                    key={opt.value}
                    className={answers[idx] === opt.value ? 'selected' : ''}
                  >
                    <input
                      type="radio"
                      name={`q${idx}`}
                      value={opt.value}
                      checked={answers[idx] === opt.value}
                      onChange={() => handleOptionChange(idx, opt.value)}
                      style={{ marginRight: 8 }}
                    />
                    {opt.label}
                  </OptionLabel>
                ))}
              </OptionGroup>
            </Question>
          ))}
          <SubmitButton type="submit">Submit</SubmitButton>
        </form>
      ) : (
        <>
          <ResultBox>
            <div style={{ fontWeight: 600, fontSize: '1.2rem', color }}>Your Score: {score}</div>
            <div style={{ margin: '12px 0', fontSize: '1.1rem', color }}>{level}</div>
            <div>
              {level === 'Minimal depression' && 'Your responses suggest minimal or no depression. If you have concerns, consider talking to a professional.'}
              {level === 'Mild depression' && 'Your responses suggest mild depression. Monitor your symptoms and consider reaching out to a professional if they persist.'}
              {level === 'Moderate depression' && 'Your responses suggest moderate depression. It may be helpful to talk to a mental health professional.'}
              {level === 'Moderately severe depression' && 'Your responses suggest moderately severe depression. Please consider seeking help from a mental health professional.'}
              {level === 'Severe depression' && 'Your responses suggest severe depression. It is strongly recommended to seek help from a mental health professional as soon as possible.'}
            </div>
            {saving && <div style={{ marginTop: 16, color: '#888' }}>Saving your result...</div>}
            {saveError && <div style={{ marginTop: 16, color: 'red' }}>{saveError}</div>}
          </ResultBox>
          <ResourcesBox>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Helpful Mental Health Resources:</div>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {mentalHealthResources.map((res, idx) => (
                <li key={idx} style={{ marginBottom: 8 }}>
                  <a href={res.url} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea', fontWeight: 500 }}>{res.name}</a>
                  <span style={{ color: '#555', marginLeft: 6 }}>{res.desc}</span>
                </li>
              ))}
            </ul>
          </ResourcesBox>
        </>
      )}
      <Disclaimer>
        <strong>Disclaimer:</strong> This self-assessment is for informational purposes only and is not a substitute for professional diagnosis or treatment. If you are in crisis, please seek help immediately.
      </Disclaimer>
    </Container>
  );
};

export default Quiz; 