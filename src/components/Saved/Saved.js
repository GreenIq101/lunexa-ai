import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  color: var(--text-primary);
  font-size: 2em;
  margin-bottom: 30px;
  text-align: center;
  font-weight: 600;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
`;

const EmptyIcon = styled.div`
  font-size: 4em;
  margin-bottom: 20px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  color: var(--text-primary);
  margin-bottom: 10px;
  font-size: 1.5em;
`;

const EmptyText = styled.p`
  color: var(--text-secondary);
  margin-bottom: 30px;
  line-height: 1.6;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: var(--border-radius);
  padding: 25px;
  box-shadow: var(--shadow);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const CardTitle = styled.h3`
  color: var(--text-primary);
  margin-bottom: 15px;
  font-size: 1.4em;
  font-weight: 600;
  line-height: 1.3;
`;

const CardContent = styled.div`
  margin-bottom: 20px;
`;

const Description = styled.p`
  color: #333;
  line-height: 1.6;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MetaInfo = styled.div`
  font-size: 0.9em;
  color: #666;
  margin-bottom: 15px;
`;

const Hashtags = styled.div`
  background: #f8f9fa;
  padding: 10px 15px;
  border-radius: var(--border-radius);
  border-left: 3px solid var(--primary-color);
  font-size: 0.9em;
  color: #555;
  margin-bottom: 15px;
  word-wrap: break-word;
`;

const Keywords = styled.div`
  background: #f8f9fa;
  padding: 10px 15px;
  border-radius: var(--border-radius);
  border-left: 3px solid var(--primary-color);
  font-size: 0.9em;
  color: #555;
  margin-bottom: 20px;
  word-wrap: break-word;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: var(--border-radius);
  font-size: 14px;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  min-width: 80px;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const CopyButton = styled(Button)`
  background: var(--primary-color);
  color: white;

  &:hover {
    background: #6bb9e0;
    box-shadow: 0 3px 8px rgba(135, 206, 235, 0.3);
  }
`;

const DeleteButton = styled(Button)`
  background: #dc3545;
  color: white;

  &:hover {
    background: #c82333;
    box-shadow: 0 3px 8px rgba(220, 53, 69, 0.3);
  }
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
      <SectionTitle>💾 Saved Outputs</SectionTitle>

      {outputs.length === 0 ? (
        <EmptyState>
          <EmptyIcon>📂</EmptyIcon>
          <EmptyTitle>No Saved Content Yet</EmptyTitle>
          <EmptyText>
            Start generating product descriptions and save them here for easy access.
            Your saved content will appear as cards you can copy or delete.
          </EmptyText>
        </EmptyState>
      ) : (
        <Grid>
          {outputs.map(output => (
            <Card key={output.id}>
              <CardTitle>{output.generatedText.title}</CardTitle>

              <CardContent>
                <Description>{output.generatedText.description}</Description>

                <MetaInfo>
                  <strong>Product:</strong> {output.productName}<br/>
                  <strong>Created:</strong> {output.timestamp?.toDate?.()?.toLocaleDateString() || 'Recently'}
                </MetaInfo>

                <Hashtags>
                  <strong>📱 Hashtags:</strong><br/>
                  {output.generatedText.hashtags}
                </Hashtags>

                <Keywords>
                  <strong>🔍 SEO Keywords:</strong><br/>
                  {output.generatedText.seo_keywords}
                </Keywords>
              </CardContent>

              <ButtonGroup>
                <CopyButton onClick={() => handleCopy(`${output.generatedText.title}\n\n${output.generatedText.description}\n\n${output.generatedText.hashtags}\n\n${output.generatedText.seo_keywords}`)}>
                  📋 Copy
                </CopyButton>
                <DeleteButton onClick={() => handleDelete(output.id)}>
                  🗑️ Delete
                </DeleteButton>
              </ButtonGroup>
            </Card>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Saved;