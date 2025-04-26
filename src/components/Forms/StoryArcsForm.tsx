import {
  ArrayFieldDef,
  FieldDef,
  handleBasicChange,
  handleNestedChange,
  renderArrayFields,
  renderObjectFields
} from './FormUtils';
import {
  Box,
  Divider,
  Grid,
  Paper,
  Typography
} from '@mui/material';

import { Campaign } from '@/types/campaign';
import React from 'react';

interface StoryArcsFormProps {
  campaignData: Partial<Campaign>;
  updateCampaignData: React.Dispatch<React.SetStateAction<Partial<Campaign>>>;
}

const StoryArcsForm: React.FC<StoryArcsFormProps> = ({
  campaignData,
  updateCampaignData
}) => {
  // Define fields for the main arc section
  const mainArcFields: FieldDef[] = [
    { name: 'title', label: 'Main Arc Title', fullWidth: true },
    { name: 'premise', label: 'Premise', multiline: true, rows: 3, fullWidth: true },
    { name: 'climax', label: 'Climax', multiline: true, rows: 3 },
    { name: 'resolution', label: 'Resolution', multiline: true, rows: 3 }
  ];
  
  // Define fields for story progression
  const progressionFields: FieldDef[] = [
    { name: 'stage', label: 'Stage Name (e.g., Introduction, Rising Action)' },
    { name: 'description', label: 'Description', multiline: true },
    { name: 'events', label: 'Key Events', multiline: true },
    { name: 'playerChoices', label: 'Player Choices', multiline: true },
    { name: 'consequences', label: 'Consequences', multiline: true }
  ];
  
  // Define fields for side quests
  const subArcFields: FieldDef[] = [
    { name: 'title', label: 'Title' },
    { name: 'description', label: 'Description', multiline: true },
    { name: 'hook', label: 'Hook', multiline: true },
    { name: 'resolution', label: 'Resolution', multiline: true }
  ];

  // Handle field changes
  const handleChange = ({ section, field, value, updateData }: { 
    section: string; 
    field: string; 
    value: any; 
    updateData: React.Dispatch<React.SetStateAction<any>>; 
  }) => {
    const isNestedField = field.includes('.');
    const path = isNestedField 
      ? field 
      : `mainArc.${field}`;
      
    if (isNestedField) {
      handleNestedChange({ section, field: path, value, updateData });
    } else {
      handleNestedChange({ section, field: path, value, updateData });
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Story Arcs
      </Typography>
      
      {/* Main Arc Section */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Main Campaign Arc
        </Typography>
        
        {renderObjectFields(
          'storyArcs',
          campaignData,
          mainArcFields.map(field => ({
            ...field,
            name: `mainArc.${field.name}`
          })),
          handleNestedChange,
          updateCampaignData
        )}
      </Box>
      
      {/* Story Progression */}
      <Box sx={{ mt: 3, mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Story Progression
        </Typography>
        
        {renderArrayFields(
          'storyArcs',
          'mainArc.progression',
          'Story Stage',
          campaignData,
          progressionFields,
          updateCampaignData
        )}
      </Box>
      
      <Divider sx={{ my: 4 }} />
      
      {/* Side Quests */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Side Quests
        </Typography>
        
        {renderArrayFields(
          'storyArcs',
          'subArcs',
          'Side Quest',
          campaignData,
          subArcFields,
          updateCampaignData
        )}
      </Box>
    </Paper>
  );
};

export default StoryArcsForm;