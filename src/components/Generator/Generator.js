import React, { useState, useEffect } from 'react';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import { generateDescription } from '../../utils/openai';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Form = styled.form`
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 100px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
`;

const Output = styled.div`
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
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
          const docRef = doc(db, 'profiles', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setBusinessInfo(docSnap.data());
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          alert('Error loading profile. Please check your connection.');
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
      alert('Error generating description: ' + error.message);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user && output) {
      try {
        await addDoc(collection(db, 'outputs', user.uid, 'generated_docs'), {
          productName,
          features,
          generatedText: output,
          timestamp: new Date(),
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
      <h2>Generate Product Description</h2>
      <Form onSubmit={handleGenerate}>
        <Input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
        <Textarea
          placeholder="Product Features (comma-separated)"
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate'}
        </Button>
      </Form>
      {output && (
        <Output>
          <h3>{output.title}</h3>
          <p>{output.description}</p>
          <p><strong>Hashtags:</strong> {output.hashtags}</p>
          <p><strong>SEO Keywords:</strong> {output.seo_keywords}</p>
          <Button onClick={() => handleCopy(output.title + '\n\n' + output.description + '\n\n' + output.hashtags + '\n\n' + output.seo_keywords)}>Copy All</Button>
          <Button onClick={handleSave}>Save</Button>
        </Output>
      )}
    </Container>
  );
};

export default Generator;