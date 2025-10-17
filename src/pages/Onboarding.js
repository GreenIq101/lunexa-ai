import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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
      <h2>Onboarding</h2>
      <form onSubmit={handleSubmit}>
        <Input name="businessName" placeholder="Business Name" value={formData.businessName} onChange={handleChange} required />
        <Input name="category" placeholder="Product Category" value={formData.category} onChange={handleChange} required />
        <Input name="audience" placeholder="Target Audience" value={formData.audience} onChange={handleChange} required />
        <Input name="tone" placeholder="Tone" value={formData.tone} onChange={handleChange} required />
        <Input name="region" placeholder="Region / Market" value={formData.region} onChange={handleChange} required />
        <Input name="brandStyle" placeholder="Brand Style" value={formData.brandStyle} onChange={handleChange} required />
        <Button type="submit">Save Profile</Button>
      </form>
    </Container>
  );
};

export default Onboarding;