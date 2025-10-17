import React, { useState } from 'react';
import Generator from '../components/Generator/Generator';
import Saved from '../components/Saved/Saved';
import Settings from './Settings';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  padding: 10px 20px;
  margin-right: 10px;
  background-color: ${props => props.active ? '#007bff' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : 'black'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('generate');

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
      <Tabs>
        <Tab active={activeTab === 'generate'} onClick={() => setActiveTab('generate')}>Generate Description</Tab>
        <Tab active={activeTab === 'saved'} onClick={() => setActiveTab('saved')}>Saved Outputs</Tab>
        <Tab active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>Settings</Tab>
      </Tabs>
      {renderTab()}
    </Container>
  );
};

export default Dashboard;