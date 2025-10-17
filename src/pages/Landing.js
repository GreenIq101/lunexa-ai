import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: var(--background-color);
  color: var(--text-primary);
  padding: 20px 30px;
  border-radius: 0 0 var(--border-radius) var(--border-radius);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-card);
  border: var(--border);
  border-top: none;
  position: relative;
`;

const HeaderAccent = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 3px;
  background: var(--button-gradient);
  border-radius: 2px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-size: 1.8em;
  font-weight: 700;
`;

const LogoImage = styled.img`
  height: 40px;
  width: auto;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const NavLink = styled(Link)`
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  transition: all 0.3s ease;
  padding: 10px 20px;
  border-radius: var(--border-radius-small);
  position: relative;

  &:hover {
    background: var(--primary-color);
    color: white;
    transform: translateY(-2px);
  }
`;

const HeroSection = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 3.5em;
  font-weight: 700;
  margin-bottom: 20px;
  color: white;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
`;

const HeroSubtitle = styled.p`
  font-size: 1.3em;
  font-weight: 300;
  margin-bottom: 40px;
  max-width: 600px;
  line-height: 1.6;
  color: #666;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
`;

const PrimaryButton = styled(Link)`
  background: var(--secondary-color);
  color: white;
  padding: 15px 30px;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1em;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: inline-block;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(108, 92, 231, 0.3);
  }
`;

const SecondaryButton = styled(Link)`
  background: transparent;
  color: var(--secondary-color);
  padding: 15px 30px;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1em;
  border: 2px solid var(--secondary-color);
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background: var(--secondary-color);
    color: white;
  }
`;

const FeaturesSection = styled.section`
  padding: 60px 20px;
  background: white;
  margin: 40px;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
`;

const FeaturesTitle = styled.h2`
  text-align: center;
  font-size: 2.5em;
  margin-bottom: 40px;
  color: var(--secondary-color);
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1000px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: 30px 20px;
  background: var(--background-gradient);
  border-radius: var(--border-radius);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3em;
  margin-bottom: 20px;
  color: var(--secondary-color);
`;

const FeatureTitle = styled.h3`
  font-size: 1.5em;
  margin-bottom: 15px;
  color: var(--text-primary);
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 1em;
`;

const Footer = styled.footer`
  background: var(--secondary-color);
  color: white;
  padding: 30px 20px;
  text-align: center;
  margin-top: auto;
`;

const FooterText = styled.p`
  margin: 0;
  font-weight: 300;
`;

const Landing = () => {
  return (
    <Container>
      <Header>
        <Logo>
          <LogoImage src="/logo.png" alt="Lunexa AI Logo" />
          Lunexa AI
        </Logo>
        <NavLinks>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Sign Up</NavLink>
        </NavLinks>
        <HeaderAccent />
      </Header>

      <HeroSection>
        <HeroTitle>Generate Perfect Product Descriptions with AI</HeroTitle>
        <HeroSubtitle>
          Transform your e-commerce business with personalized, SEO-optimized content
          that converts visitors into customers. Powered by advanced AI technology.
        </HeroSubtitle>
        <ButtonGroup>
          <PrimaryButton to="/register">Get Started Free</PrimaryButton>
          <SecondaryButton to="/login">Sign In</SecondaryButton>
        </ButtonGroup>
      </HeroSection>

      <FeaturesSection>
        <FeaturesTitle>Why Choose Lunexa AI?</FeaturesTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>🤖</FeatureIcon>
            <FeatureTitle>AI-Powered Content</FeatureTitle>
            <FeatureDescription>
              Generate high-quality product descriptions, titles, hashtags, and SEO keywords
              tailored to your brand and target audience.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>⚡</FeatureIcon>
            <FeatureTitle>Lightning Fast</FeatureTitle>
            <FeatureDescription>
              Create compelling content in seconds, not hours. Save time and focus on
              growing your business while we handle the copywriting.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>🎯</FeatureIcon>
            <FeatureTitle>Market-Tuned</FeatureTitle>
            <FeatureDescription>
              Content optimized for your specific market, region, and audience preferences.
              Speak directly to your customers' needs and desires.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>💾</FeatureIcon>
            <FeatureTitle>Save & Reuse</FeatureTitle>
            <FeatureDescription>
              Store all your generated content in one place. Reuse, edit, and organize
              your marketing materials effortlessly.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <Footer>
        <FooterText>© 2024 Lunexa AI. Transform your e-commerce content with the power of AI.</FooterText>
      </Footer>
    </Container>
  );
};

export default Landing;