import { Box, Paper, Typography } from '@mui/material';
import {
  FieldDef,
  handleBasicChange,
  renderObjectFields
} from './FormUtils';

import { Campaign } from '@/types/campaign';
import React from 'react';

interface BasicsFormProps {
  campaignData: Partial<Campaign>;
  updateCampaignData: React.Dispatch<React.SetStateAction<Partial<Campaign>>>;
}

const BasicsForm: React.FC<BasicsFormProps> = ({
  campaignData,
  updateCampaignData
}) => {
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

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Campaign Basics
      </Typography>
      
      <Box sx={{ mt: 2 }}>
        {renderObjectFields(
          'basics',
          campaignData,
          basicFields,
          handleChange,
          updateCampaignData
        )}
      </Box>
    </Paper>
  );
};

export default BasicsForm;