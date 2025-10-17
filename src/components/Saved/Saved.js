import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Card = styled.div`
  border: 1px solid #ccc;
  padding: 20px;
  margin: 10px 0;
  border-radius: 8px;
`;

const Button = styled.button`
  padding: 5px 10px;
  margin-right: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;
`;

const Saved = () => {
  const [outputs, setOutputs] = useState([]);

  useEffect(() => {
    const fetchOutputs = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const querySnapshot = await getDocs(collection(db, 'outputs', user.uid, 'generated_docs'));
          const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setOutputs(data);
        } catch (error) {
          console.error('Error fetching outputs:', error);
          alert('Error loading saved outputs. Please check your connection.');
        }
      }
    };
    fetchOutputs();
  }, []);

  const handleDelete = async (id) => {
    const user = auth.currentUser;
    if (user) {
      try {
        await deleteDoc(doc(db, 'outputs', user.uid, 'generated_docs', id));
        setOutputs(outputs.filter(output => output.id !== id));
      } catch (error) {
        console.error('Error deleting output:', error);
        alert('Error deleting output. Please check your connection.');
      }
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <Container>
      <h2>Saved Outputs</h2>
      {outputs.map(output => (
        <Card key={output.id}>
          <h3>{output.generatedText.title}</h3>
          <p>{output.generatedText.description}</p>
          <p><strong>Hashtags:</strong> {output.generatedText.hashtags}</p>
          <p><strong>SEO Keywords:</strong> {output.generatedText.seo_keywords}</p>
          <Button onClick={() => handleCopy(output.generatedText.title + '\n\n' + output.generatedText.description + '\n\n' + output.generatedText.hashtags + '\n\n' + output.generatedText.seo_keywords)}>Copy</Button>
          <DeleteButton onClick={() => handleDelete(output.id)}>Delete</DeleteButton>
        </Card>
      ))}
    </Container>
  );
};

export default Saved;