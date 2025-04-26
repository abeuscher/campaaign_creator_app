import { Alert, Box, Container, Snackbar, Typography } from '@mui/material';
import React, { useState } from 'react';

import { Campaign } from '@/types/campaign';
import CampaignFormContainer from '@/components/Forms/CampaignFormContainer';
import Head from 'next/head';

export default function CampaignEditor() {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Example handler for saving campaign
  const handleSaveCampaign = (campaignData: Partial<Campaign>) => {
    // In a real app, this would save to your backend or database
    console.log('Saving campaign data:', campaignData);
    
    // Generate an ID if this is a new campaign
    if (!campaignData.id) {
      campaignData.id = Date.now().toString();
    }
    
    // Update timestamps
    const now = new Date().toISOString();
    campaignData.updatedAt = now;
    if (!campaignData.createdAt) {
      campaignData.createdAt = now;
    }
    
    // Save to localStorage for this example
    try {
      // Save the current campaign
      localStorage.setItem('current_campaign', JSON.stringify(campaignData));
      
      // Add to saved campaigns list
      const savedCampaigns = JSON.parse(localStorage.getItem('saved_campaigns') || '[]');
      const existingIndex = savedCampaigns.findIndex((c: Campaign) => c.id === campaignData.id);
      
      if (existingIndex >= 0) {
        savedCampaigns[existingIndex] = campaignData;
      } else {
        savedCampaigns.push(campaignData);
      }
      
      localStorage.setItem('saved_campaigns', JSON.stringify(savedCampaigns));
      
      setNotification({
        open: true,
        message: 'Campaign saved successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving campaign:', error);
      setNotification({
        open: true,
        message: 'Error saving campaign',
        severity: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // You could load an existing campaign here
  const loadExistingCampaign = (): Partial<Campaign> => {
    if (typeof window !== 'undefined') {
      const savedCampaign = localStorage.getItem('current_campaign');
      if (savedCampaign) {
        try {
          return JSON.parse(savedCampaign);
        } catch (e) {
          console.error('Error parsing saved campaign:', e);
        }
      }
    }
    
    // Return empty campaign if none exists
    return {
      name: '',
      basics: {
        title: '',
        description: '',
        theme: '',
        tone: '',
        levelRange: '',
        estimatedDuration: '',
        playerCount: {
          min: 3,
          max: 6,
          recommended: 4
        }
      }
    };
  };

  return (
    <>
      <Head>
        <title>Campaign Editor</title>
      </Head>
      
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Your RPG Campaign
        </Typography>
        
        <Box sx={{ mt: 2, mb: 4 }}>
          <Typography variant="body1">
            Fill out the campaign details below. You can navigate between sections
            using the tabs. Your progress is automatically saved as you work.
          </Typography>
        </Box>
        
        <CampaignFormContainer 
          initialData={loadExistingCampaign()}
          onSave={handleSaveCampaign}
        />
      </Container>
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}