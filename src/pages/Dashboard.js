import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import Generator from '../components/Generator/Generator';
import Saved from '../components/Saved/Saved';
import Settings from './Settings';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  background: var(--background-gradient);
`;

const Header = styled.header`
  background: var(--background-color);
  color: var(--text-primary);
  padding: 24px 30px;
  border-radius: 0 0 var(--border-radius) var(--border-radius);
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-card);
  position: relative;
  border: var(--border);
  border-top: none;
`;

const HeaderAccent = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
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
  height: 35px;
  width: auto;
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const LogoutButton = styled.button`
  background: var(--secondary-color);
  color: white;
  border: 2px solid var(--secondary-color);
  padding: 10px 20px;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 14px;

  &:hover {
    background: var(--primary-color);
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: var(--shadow-hover);
  }
`;

const MainContent = styled.main`
  padding: 30px 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeSection = styled.section`
  text-align: center;
  margin-bottom: 40px;
`;

const WelcomeTitle = styled.h2`
  color: var(--text-primary);
  font-size: 2.5em;
  margin-bottom: 10px;
  font-weight: 700;
`;

const WelcomeSubtitle = styled.p`
  color: var(--text-secondary);
  font-size: 1.1em;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  background: white;
  border-radius: var(--border-radius);
  padding: 10px;
  box-shadow: var(--shadow);
`;

const Tab = styled.button`
  padding: 12px 24px;
  margin: 0 5px;
  background-color: ${props => props.active ? 'var(--secondary-color)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--secondary-color)'};
  border: 2px solid var(--secondary-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  font-family: 'Montserrat', sans-serif;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.active ? 'var(--secondary-color)' : 'rgba(108, 92, 231, 0.1)'};
    transform: translateY(-1px);
  }
`;

const TabContent = styled.div`
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 30px;
  min-height: 400px;
`;

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'generate':
        return <Generator />;
      case 'saved':
        return <Saved />;
      case 'settings':
        return <Settings />;
      default:
        return <Generator />;
    }
  };

  return (
    <Container>
      <Header>
        <Logo>
          <LogoImage src="/logo.png" alt="Lunexa AI Logo" />
          Lunexa AI
        </Logo>
        <UserActions>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </UserActions>
        <HeaderAccent />
      </Header>

      <MainContent>
        <WelcomeSection>
          <WelcomeTitle>Welcome to Your Dashboard</WelcomeTitle>
          <WelcomeSubtitle>
            Generate compelling product descriptions, manage your saved content,
            and customize your AI writing experience.
          </WelcomeSubtitle>
        </WelcomeSection>

        <Tabs>
          <Tab active={activeTab === 'generate'} onClick={() => setActiveTab('generate')}>
            ✏️ Generate Content
          </Tab>
          <Tab active={activeTab === 'saved'} onClick={() => setActiveTab('saved')}>
            💾 Saved Outputs
          </Tab>
          <Tab active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
            ⚙️ Settings
          </Tab>
        </Tabs>

        <TabContent>
          {renderTab()}
        </TabContent>
      </MainContent>
    </Container>
  );
};

export default Dashboard;