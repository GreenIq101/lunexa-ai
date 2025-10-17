import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
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
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          alert('Error loading profile. Please check your connection.');
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
      <h2>Settings</h2>
      <form onSubmit={handleUpdate}>
        <Input name="businessName" placeholder="Business Name" value={formData.businessName} onChange={handleChange} />
        <Input name="category" placeholder="Product Category" value={formData.category} onChange={handleChange} />
        <Input name="audience" placeholder="Target Audience" value={formData.audience} onChange={handleChange} />
        <Input name="tone" placeholder="Tone" value={formData.tone} onChange={handleChange} />
        <Input name="region" placeholder="Region / Market" value={formData.region} onChange={handleChange} />
        <Input name="brandStyle" placeholder="Brand Style" value={formData.brandStyle} onChange={handleChange} />
        <Button type="submit">Update Profile</Button>
      </form>
      <Button onClick={handleLogout}>Logout</Button>
    </Container>
  );
};

export default Settings;