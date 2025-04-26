import { Box, Paper, Typography } from '@mui/material';
import { FieldDef, renderArrayFields } from './FormUtils';

import { Campaign } from '@/types/campaign';
import React from 'react';

interface LocationsFormProps {
  campaignData: Partial<Campaign>;
  updateCampaignData: React.Dispatch<React.SetStateAction<Partial<Campaign>>>;
}

const LocationsForm: React.FC<LocationsFormProps> = ({
  campaignData,
  updateCampaignData
}) => {
  // Define location fields
  const locationFields: FieldDef[] = [
    { name: 'name', label: 'Location Name' },
    { name: 'type', label: 'Type (e.g., dungeon, city, wilderness)' },
    { name: 'description', label: 'Description', multiline: true, rows: 3, fullWidth: true },
    { name: 'significance', label: 'Significance', multiline: true },
    { name: 'keyFeatures', label: 'Key Features (comma-separated)', multiline: true },
  ];

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Locations
      </Typography>
      
      <Box sx={{ mt: 2 }}>
        {renderArrayFields(
          '',
          'locations',
          'Location',
          campaignData,
          locationFields,
          updateCampaignData
        )}
      </Box>
    </Paper>
  );
};

export default LocationsForm;