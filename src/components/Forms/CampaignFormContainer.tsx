import { Box, Button, Container, Paper, Tab, Tabs } from '@mui/material';
import React, { useEffect, useState } from 'react';

import BasicsForm from './BasicsForm';
import { Campaign } from '@/types/campaign';
import CharactersForm from './CharactersForm';
import LocationsForm from './LocationsForm';
import StoryArcsForm from './StoryArcsForm';
import WorldForm from './WorldForm';

interface CampaignFormContainerProps {
  initialData?: Partial<Campaign>;
  onSave?: (campaignData: Partial<Campaign>) => void;
}

const CampaignFormContainer: React.FC<CampaignFormContainerProps> = ({
  initialData = {},
  onSave
}) => {
  const [campaignData, setCampaignData] = useState<Partial<Campaign>>(initialData);
  const [activeTab, setActiveTab] = useState(0);

  // Load from localStorage if available
  useEffect(() => {
    const savedData = localStorage.getItem('campaign_draft');
    if (savedData) {
      try {
        setCampaignData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading saved campaign:', error);
      }
    }
  }, []);

  // Save to localStorage on data change
  useEffect(() => {
    if (Object.keys(campaignData).length > 0) {
      localStorage.setItem('campaign_draft', JSON.stringify(campaignData));
    }
  }, [campaignData]);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (onSave) {
      onSave(campaignData);
    }
  };

  // Define tabs
  const tabs = [
    { label: 'Basics', value: 0 },
    { label: 'World', value: 1 },
    { label: 'Story Arcs', value: 2 },
    { label: 'Characters', value: 3 },
    { label: 'Locations', value: 4 }
  ];

  // Render active form based on tab
  const renderActiveForm = () => {
    switch (activeTab) {
      case 0:
        return (
          <BasicsForm 
            campaignData={campaignData} 
            updateCampaignData={setCampaignData} 
          />
        );
      case 1:
        return (
          <WorldForm 
            campaignData={campaignData} 
            updateCampaignData={setCampaignData} 
          />
        );
      case 2:
        return (
          <StoryArcsForm 
            campaignData={campaignData} 
            updateCampaignData={setCampaignData} 
          />
        );
      case 3:
        return (
          <CharactersForm 
            campaignData={campaignData} 
            updateCampaignData={setCampaignData} 
          />
        );
      case 4:
        return (
          <LocationsForm 
            campaignData={campaignData} 
            updateCampaignData={setCampaignData} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="campaign form sections"
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </Paper>
      
      {renderActiveForm()}
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={handleSubmit}
        >
          Save Campaign
        </Button>
      </Box>
    </Container>
  );
};

export default CampaignFormContainer;