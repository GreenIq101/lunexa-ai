import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
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

const Card = styled.div`
  background: white;
  border-radius: var(--border-radius);
  padding: 30px;
  box-shadow: var(--shadow);
  margin-bottom: 30px;
`;

const CardTitle = styled.h3`
  color: var(--text-primary);
  margin-bottom: 20px;
  font-size: 1.5em;
  font-weight: 600;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 15px 25px;
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
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const UpdateButton = styled(Button)`
  background: var(--secondary-color);
  color: white;

  &:hover {
    background: #5a4fcf;
    box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3);
  }
`;

const LogoutButton = styled(Button)`
  background: #dc3545;
  color: white;

  &:hover {
    background: #c82333;
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
  }
`;

const Settings = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    audience: '',
    tone: '',
    region: '',
    brandStyle: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, 'profiles', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setFormData(docSnap.data());
          } else {
            // Profile doesn't exist yet, show empty form
            console.log('Profile not found, showing empty form');
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          // Don't show alert for missing profile, just log it
          console.log('Profile fetch failed, user may need to complete onboarding');
        }
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      try {
        await updateDoc(doc(db, 'profiles', user.uid), formData);
        alert('Profile updated!');
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile. Please check your connection.');
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <Container>
      <SectionTitle>⚙️ Account Settings</SectionTitle>

      <Card>
        <CardTitle>📋 Business Profile</CardTitle>
        <Form onSubmit={handleUpdate}>
          <InputGroup>
            <Label htmlFor="businessName">🏢 Business Name</Label>
            <Input
              id="businessName"
              name="businessName"
              placeholder="Your business name"
              value={formData.businessName}
              onChange={handleChange}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="category">📦 Product Category</Label>
            <Input
              id="category"
              name="category"
              placeholder="e.g., Fashion & Apparel, Electronics"
              value={formData.category}
              onChange={handleChange}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="audience">👥 Target Audience</Label>
            <Input
              id="audience"
              name="audience"
              placeholder="e.g., Young adults 18-30"
              value={formData.audience}
              onChange={handleChange}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="tone">🎭 Brand Tone</Label>
            <Input
              id="tone"
              name="tone"
              placeholder="e.g., Trendy & Informal"
              value={formData.tone}
              onChange={handleChange}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="region">🌍 Region / Market</Label>
            <Input
              id="region"
              name="region"
              placeholder="e.g., Pakistan, UAE"
              value={formData.region}
              onChange={handleChange}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="brandStyle">🎨 Brand Style</Label>
            <Input
              id="brandStyle"
              name="brandStyle"
              placeholder="e.g., Bold & Minimal"
              value={formData.brandStyle}
              onChange={handleChange}
            />
          </InputGroup>

          <ButtonGroup>
            <UpdateButton type="submit">
              💾 Update Profile
            </UpdateButton>
          </ButtonGroup>
        </Form>
      </Card>

      <Card>
        <CardTitle>🚪 Account Actions</CardTitle>
        <ButtonGroup>
          <LogoutButton onClick={handleLogout}>
            🔓 Logout
          </LogoutButton>
        </ButtonGroup>
      </Card>
    </Container>
  );
};

export default Settings;