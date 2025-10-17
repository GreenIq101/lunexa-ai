import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  text-align: center;
  padding: 50px;
`;

const Title = styled.h1`
  font-size: 2.5em;
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  font-size: 1.2em;
  margin-bottom: 30px;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 0 10px;
  font-size: 1em;
  cursor: pointer;
`;

const Landing = () => {
  return (
    <Container>
      <Title>Generate Perfect Product Descriptions with AI</Title>
      <Subtitle>Personalized content for your e-commerce business.</Subtitle>
      <Link to="/login"><Button>Sign Up</Button></Link>
      <Link to="/login"><Button>Login</Button></Link>
    </Container>
  );
};

export default Landing;