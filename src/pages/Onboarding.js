import React, { useState, useEffect } from 'react';
import { ref, set } from 'firebase/database';
import { database, auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--background-gradient);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
  color: white;
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const StepIndicator = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.active ? 'var(--secondary-color)' : props.completed ? '#4CAF50' : '#e0e0e0'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: all 0.3s ease;
`;

const ProgressLine = styled.div`
  height: 2px;
  background: #e0e0e0;
  flex: 1;
  max-width: 50px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: var(--secondary-color);
    width: ${props => props.progress}%;
    transition: width 0.5s ease;
  }
`;

const ClarityIndicator = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 10px 20px;
  color: white;
  font-size: 14px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ClarityBar = styled.div`
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    background: linear-gradient(90deg, #FFD700, #FFA500);
    width: ${props => props.clarity}%;
    transition: width 0.5s ease;
  }
`;


const Card = styled.div`
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 40px;
  width: 100%;
  max-width: 500px;
  position: relative;
  transition: all 0.3s ease;

  &.slide-in {
    opacity: 1;
    transform: translateX(0);
  }

  &.slide-out {
    opacity: 0;
    transform: translateX(-50px);
  }
`;

const QuestionTitle = styled.h2`
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 15px;
  font-size: 1.8em;
  font-weight: 700;
`;

const QuestionSubtitle = styled.p`
  color: #666;
  text-align: center;
  margin-bottom: 30px;
  font-size: 1em;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
`;

const NavButton = styled.button`
  flex: 1;
  padding: 12px 20px;
  background: ${props => props.primary ? 'var(--secondary-color)' : 'transparent'};
  color: ${props => props.primary ? 'white' : 'var(--secondary-color)'};
  border: 2px solid var(--secondary-color);
  border-radius: var(--border-radius);
  font-size: 16px;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.primary ? '#5a4fcf' : 'rgba(108, 92, 231, 0.1)'};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: var(--border-radius);
  font-size: 16px;
  font-family: 'Montserrat', sans-serif;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--secondary-color);
  }

  &::placeholder {
    color: #999;
  }
`;

const BackLink = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: transparent;
  border: none;
  color: var(--secondary-color);
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    text-decoration: underline;
  }
`;

const questions = [
  {
    id: 'businessName',
    title: '🏢 What\'s Your Business Called?',
    subtitle: 'Let\'s start with something simple - your business name!',
    placeholder: 'e.g., Urban Threads, TechHub, GreenLife',
    emoji: '🚀',
    funFact: 'Great names are memorable and tell a story!'
  },
  {
    id: 'category',
    title: '📦 What Do You Sell?',
    subtitle: 'Fashion, tech, food, or something totally unique?',
    placeholder: 'e.g., Fashion & Apparel, Electronics, Home & Garden',
    emoji: '🎯',
    funFact: 'Your category helps us craft the perfect content!'
  },
  {
    id: 'audience',
    title: '👥 Who\'s Your Dream Customer?',
    subtitle: 'Describe the people who love your products!',
    placeholder: 'e.g., Young adults 18-30, Working professionals, Families',
    emoji: '🎭',
    funFact: 'Knowing your audience is key to amazing marketing!'
  },
  {
    id: 'tone',
    title: '🎭 What\'s Your Brand Voice?',
    subtitle: 'How do you want to sound to your customers?',
    placeholder: 'e.g., Trendy & Informal, Professional, Friendly & Approachable',
    emoji: '💬',
    funFact: 'Your tone sets the mood for all your content!'
  },
  {
    id: 'region',
    title: '🌍 Where\'s Your Market?',
    subtitle: 'Local, national, or ready to conquer the world?',
    placeholder: 'e.g., Pakistan, UAE, Global, North America',
    emoji: '🗺️',
    funFact: 'Location influences culture and buying habits!'
  },
  {
    id: 'brandStyle',
    title: '🎨 What\'s Your Visual Style?',
    subtitle: 'Bold and minimal, or colorful and vibrant?',
    placeholder: 'e.g., Bold & Minimal, Colorful & Vibrant, Elegant & Sophisticated',
    emoji: '🎨',
    funFact: 'Visual style makes your brand instantly recognizable!'
  }
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    audience: '',
    tone: '',
    region: '',
    brandStyle: '',
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Add loading effect to ensure component is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Small delay to ensure smooth loading

    return () => clearTimeout(timer);
  }, []);

  const currentQuestion = questions[currentStep];
  const clarity = Math.min(100, (Object.values(formData).filter(v => v.trim()).length / questions.length) * 100);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (user) {
      setIsSubmitting(true);
      try {
        const profileRef = ref(database, `profiles/${user.uid}`);
        await set(profileRef, formData);
        navigate('/dashboard');
      } catch (error) {
        console.error('Error saving profile:', error);
        // For now, just navigate to dashboard - we'll handle offline mode
        console.log('Saving failed, proceeding to dashboard anyway');
        navigate('/dashboard');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '2em', marginBottom: '20px' }}>🌙</div>
          <div>Loading onboarding...</div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <BackLink onClick={() => window.history.back()}>
        ← Back
      </BackLink>

      <Header>
        <h1 style={{ fontSize: '2.5em', marginBottom: '10px' }}>🎯 Let's Get Started!</h1>
        <p style={{ fontSize: '1.2em', opacity: 0.9 }}>Tell us about your business so we can create personalized, high-converting content for your products.</p>
      </Header>

      <ProgressContainer>
        {questions.map((_, index) => (
          <React.Fragment key={index}>
            <StepIndicator
              active={index === currentStep}
              completed={index < currentStep}
            >
              {index < currentStep ? '✓' : index + 1}
            </StepIndicator>
            {index < questions.length - 1 && (
              <ProgressLine progress={index < currentStep ? 100 : index === currentStep ? 50 : 0} />
            )}
          </React.Fragment>
        ))}
      </ProgressContainer>

      <ClarityIndicator>
        💡 Idea Clarity: {Math.round(clarity)}%
        <ClarityBar clarity={clarity} />
      </ClarityIndicator>

      <Card key={currentStep} className={isAnimating ? 'slide-out' : 'slide-in'}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '3em' }}>{currentQuestion.emoji}</span>
        </div>

        <QuestionTitle>{currentQuestion.title}</QuestionTitle>
        <QuestionSubtitle>{currentQuestion.subtitle}</QuestionSubtitle>

        <InputGroup>
          <Input
            id={currentQuestion.id}
            name={currentQuestion.id}
            placeholder={currentQuestion.placeholder}
            value={formData[currentQuestion.id]}
            onChange={handleChange}
            required
          />
        </InputGroup>

        <p style={{ textAlign: 'center', color: '#888', fontSize: '0.9em', marginTop: '10px' }}>
          {currentQuestion.funFact}
        </p>

        <ButtonGroup>
          <NavButton onClick={prevStep} disabled={currentStep === 0}>
            ← Previous
          </NavButton>
          {currentStep === questions.length - 1 ? (
            <NavButton primary onClick={handleSubmit} disabled={!formData[currentQuestion.id].trim() || isSubmitting}>
              {isSubmitting ? '⏳ Saving...' : '🚀 Complete Setup'}
            </NavButton>
          ) : (
            <NavButton primary onClick={nextStep} disabled={!formData[currentQuestion.id].trim()}>
              Next →
            </NavButton>
          )}
        </ButtonGroup>
      </Card>
    </Container>
  );
};

export default Onboarding;