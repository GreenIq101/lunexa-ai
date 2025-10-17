import React, { useState, useEffect } from 'react';
import { ref, get, push, set } from 'firebase/database';
import { database, auth } from '../../firebase/config';
import { generateDescription } from '../../utils/openai';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  color: var(--text-primary);
  font-size: 2em;
  margin-bottom: 30px;
  text-align: center;
  font-weight: 600;
`;

const Form = styled.form`
  background: white;
  border-radius: var(--border-radius);
  padding: 30px;
  box-shadow: var(--shadow);
  margin-bottom: 30px;
`;

const FormTitle = styled.h3`
  color: var(--text-primary);
  margin-bottom: 20px;
  font-size: 1.5em;
  font-weight: 600;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
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

const Textarea = styled.textarea`
  width: 100%;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: var(--border-radius);
  font-size: 16px;
  font-family: 'Montserrat', sans-serif;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--secondary-color);
  }

  &::placeholder {
    color: #999;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 25px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 15px 25px;
  background: var(--secondary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 16px;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  min-width: 150px;

  &:hover {
    background: #5a4fcf;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3);
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

const Output = styled.div`
  background: white;
  border-radius: var(--border-radius);
  padding: 30px;
  box-shadow: var(--shadow);
  margin-top: 30px;
`;

const OutputTitle = styled.h3`
  color: var(--text-primary);
  margin-bottom: 20px;
  font-size: 1.8em;
  font-weight: 600;
`;

const OutputSection = styled.div`
  margin-bottom: 25px;
`;

const OutputLabel = styled.h4`
  color: var(--text-primary);
  margin-bottom: 10px;
  font-size: 1.2em;
  font-weight: 600;
`;

const OutputText = styled.p`
  color: #333;
  line-height: 1.6;
  margin-bottom: 15px;
  white-space: pre-wrap;
`;

const Hashtags = styled.div`
  background: #f8f9fa;
  padding: 15px;
  border-radius: var(--border-radius);
  border-left: 4px solid var(--primary-color);
`;

const Keywords = styled.div`
  background: #f8f9fa;
  padding: 15px;
  border-radius: var(--border-radius);
  border-left: 4px solid var(--primary-color);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 25px;
  flex-wrap: wrap;
`;

const CopyButton = styled(Button)`
  background: var(--primary-color);

  &:hover {
    background: #6bb9e0;
    box-shadow: 0 4px 12px rgba(135, 206, 235, 0.3);
  }
`;

const SaveButton = styled(Button)`
  background: #28a745;

  &:hover {
    background: #218838;
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
  }
`;

const Generator = () => {
  const [productName, setProductName] = useState('');
  const [features, setFeatures] = useState('');
  const [businessInfo, setBusinessInfo] = useState({});
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const profileRef = ref(database, `profiles/${user.uid}`);
          const snapshot = await get(profileRef);
          if (snapshot.exists()) {
            setBusinessInfo(snapshot.val());
          } else {
            // Profile doesn't exist, redirect to onboarding
            console.log('Profile not found, redirecting to onboarding');
            // You might want to redirect here, but for now just log
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          // Don't show alert, just log the error
          console.log('Profile fetch failed, user may need to complete onboarding');
        }
      }
    };
    fetchProfile();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await generateDescription(businessInfo, { productName, features });
      setOutput(result);
    } catch (error) {
      console.error('Generation error:', error);
      const errorMessage = error.message || error.toString() || 'Unknown error occurred';
      alert('Error generating description: ' + errorMessage);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user && output) {
      try {
        const outputsRef = ref(database, `outputs/${user.uid}/generated_docs`);
        const newOutputRef = push(outputsRef);
        await set(newOutputRef, {
          productName,
          features,
          generatedText: output,
          timestamp: Date.now(),
        });
        alert('Saved!');
      } catch (error) {
        console.error('Error saving output:', error);
        alert('Error saving output. Please check your connection.');
      }
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <Container>
      <SectionTitle>✏️ Generate Product Description</SectionTitle>

      <Form onSubmit={handleGenerate}>
        <FormTitle>Product Information</FormTitle>

        <InputGroup>
          <Label htmlFor="productName">Product Name</Label>
          <Input
            id="productName"
            type="text"
            placeholder="e.g., Wireless Bluetooth Headphones"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="features">Product Features</Label>
          <Textarea
            id="features"
            placeholder="Describe your product's key features, benefits, and specifications. Be as detailed as possible for better AI-generated content."
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            required
          />
        </InputGroup>

        <ButtonGroup>
          <Button type="submit" disabled={loading}>
            {loading ? '🤖 Generating...' : '🚀 Generate Description'}
          </Button>
        </ButtonGroup>
      </Form>

      {output && (
        <Output>
          <OutputTitle>📝 Generated Content</OutputTitle>

          <OutputSection>
            <OutputLabel>Product Title</OutputLabel>
            <OutputText>{output.title}</OutputText>
          </OutputSection>

          <OutputSection>
            <OutputLabel>Description</OutputLabel>
            <OutputText>{output.description}</OutputText>
          </OutputSection>

          <OutputSection>
            <OutputLabel>Social Media Hashtags</OutputLabel>
            <Hashtags>{output.hashtags}</Hashtags>
          </OutputSection>

          <OutputSection>
            <OutputLabel>SEO Keywords</OutputLabel>
            <Keywords>{output.seo_keywords}</Keywords>
          </OutputSection>

          <ActionButtons>
            <CopyButton onClick={() => handleCopy(`${output.title}\n\n${output.description}\n\n${output.hashtags}\n\n${output.seo_keywords}`)}>
              📋 Copy All
            </CopyButton>
            <SaveButton onClick={handleSave}>
              💾 Save Output
            </SaveButton>
          </ActionButtons>
        </Output>
      )}
    </Container>
  );
};

export default Generator;