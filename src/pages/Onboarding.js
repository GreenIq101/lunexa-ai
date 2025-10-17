import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--background-gradient);
`;

const Card = styled.div`
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 40px;
  width: 100%;
  max-width: 600px;
`;

const Title = styled.h2`
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 10px;
  font-size: 2.5em;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: #666;
  text-align: center;
  margin-bottom: 30px;
  font-size: 1.1em;
  line-height: 1.6;
`;

const ProgressBar = styled.div`
  background: #e0e0e0;
  border-radius: 10px;
  height: 8px;
  margin-bottom: 30px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  height: 100%;
  width: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 600;
  font-size: 16px;
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

const Button = styled.button`
  width: 100%;
  padding: 15px;
  background: var(--secondary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 18px;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 10px;

  &:hover {
    background: #5a4fcf;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(108, 92, 231, 0.3);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
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

const Onboarding = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    audience: '',
    tone: '',
    region: '',
    brandStyle: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, 'profiles', user.uid), formData);
        navigate('/dashboard');
      } catch (error) {
        console.error('Error saving profile:', error);
        alert('Error saving profile. Please check your connection.');
      }
    }
  };

  return (
    <Container>
      <BackLink onClick={() => window.history.back()}>
        ← Back
      </BackLink>
      <Card>
        <Title>🎯 Let's Get Started</Title>
        <Subtitle>
          Tell us about your business so we can create personalized, high-converting content for your products.
        </Subtitle>

        <ProgressBar>
          <ProgressFill />
        </ProgressBar>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="businessName">🏢 Business Name</Label>
            <Input
              id="businessName"
              name="businessName"
              placeholder="e.g., Urban Threads, TechHub, GreenLife"
              value={formData.businessName}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="category">📦 Product Category</Label>
            <Input
              id="category"
              name="category"
              placeholder="e.g., Fashion & Apparel, Electronics, Home & Garden"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="audience">👥 Target Audience</Label>
            <Input
              id="audience"
              name="audience"
              placeholder="e.g., Young adults 18-30, Working professionals, Families"
              value={formData.audience}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="tone">🎭 Brand Tone</Label>
            <Input
              id="tone"
              name="tone"
              placeholder="e.g., Trendy & Informal, Professional, Friendly & Approachable"
              value={formData.tone}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="region">🌍 Region / Market</Label>
            <Input
              id="region"
              name="region"
              placeholder="e.g., Pakistan, UAE, Global, North America"
              value={formData.region}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="brandStyle">🎨 Brand Style</Label>
            <Input
              id="brandStyle"
              name="brandStyle"
              placeholder="e.g., Bold & Minimal, Colorful & Vibrant, Elegant & Sophisticated"
              value={formData.brandStyle}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <Button type="submit">
            🚀 Complete Setup & Start Creating
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Onboarding;