import { Alert, Box, Button, CircularProgress, Paper, Snackbar, Typography } from '@mui/material';
import {
  FieldDef,
  handleBasicChange,
  renderObjectFields
} from './FormUtils';
import React, { useState } from 'react';

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Campaign } from '@/types/campaign';
import { useCompletionGenerator } from '@/hooks/useCompletionGenerator';

interface BasicsFormProps {
  campaignData: Partial<Campaign>;
  updateCampaignData: React.Dispatch<React.SetStateAction<Partial<Campaign>>>;
}

// Metadata for this form section
const basicsMetadata = {
  name: 'basics',
  displayName: 'Campaign Basics',
  description: 'The fundamental information about your campaign including title, theme, tone, and player requirements.',
  guidelines: [
    'The title should be memorable and evocative',
    'The theme describes the overall style (heroic, gritty, etc.)',
    'The tone indicates the emotional feel (serious, lighthearted, etc.)',
    'Level range typically describes character levels in systems like D&D',
    'Duration estimates how long the campaign will run (sessions or months)'
  ]
};

const BasicsForm: React.FC<BasicsFormProps> = ({
  campaignData,
  updateCampaignData
}) => {
  const [notification, setNotification] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' | 'info' 
  });
  
  // Use the completion generator hook
  const { 
    generateCompletion, 
    isGenerating, 
    error,
    completionProvider,
    setCompletionProvider
  } = useCompletionGenerator({
    campaignData,
    onUpdateCampaign: updateCampaignData
  });

  // Define fields for the basics section
  const basicFields: FieldDef[] = [
    { name: 'title', label: 'Campaign Title', fullWidth: true },
    { name: 'description', label: 'Campaign Description', multiline: true, rows: 4, fullWidth: true },
    { name: 'theme', label: 'Theme (e.g., heroic, dark fantasy)' },
    { name: 'tone', label: 'Tone (e.g., serious, lighthearted)' },
    { name: 'levelRange', label: 'Level Range (e.g., 1-10)' },
    { name: 'estimatedDuration', label: 'Estimated Duration (e.g., 6 months, 20 sessions)' },
    { name: 'playerCount.min', label: 'Minimum Players' },
    { name: 'playerCount.max', label: 'Maximum Players' },
    { name: 'playerCount.recommended', label: 'Recommended Players' }
  ];

  // Handle field changes
  const handleChange = ({ section, field, value, updateData }: { 
    section: string; 
    field: string; 
    value: any; 
    updateData: React.Dispatch<React.SetStateAction<any>>; 
  }) => {
    if (field.includes('.')) {
      handleBasicChange({ section, field, value, updateData });
    } else {
      handleBasicChange({ section, field, value, updateData });
    }
  };
  
  // Handle completion request
  const handleCompleteSection = async () => {
    setNotification({ open: false, message: '', severity: 'info' });
    
    try {
      const success = await generateCompletion(
        basicsMetadata.name,
        basicsMetadata.displayName
      );
      
      if (success) {
        setNotification({
          open: true,
          message: 'Campaign basics completed successfully!',
          severity: 'success'
        });
      } else if (error) {
        setNotification({
          open: true,
          message: `Error: ${error}`,
          severity: 'error'
        });
      }
    } catch (err) {
      setNotification({
        open: true,
        message: `An unexpected error occurred: ${err instanceof Error ? err.message : String(err)}`,
        severity: 'error'
      });
    }
  };
  
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">
          Campaign Basics
        </Typography>
        
        <Button
          variant="contained"
          color="secondary"
          onClick={handleCompleteSection}
          disabled={isGenerating}
          startIcon={isGenerating ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
          sx={{ ml: 2 }}
        >
          {isGenerating ? 'Generating...' : 'Complete This Section'}
        </Button>
      </Box>
      
      <Box sx={{ mt: 2 }}>
        {renderObjectFields(
          'basics',
          campaignData,
          basicFields,
          handleChange,
          updateCampaignData
        )}
      </Box>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default BasicsForm;