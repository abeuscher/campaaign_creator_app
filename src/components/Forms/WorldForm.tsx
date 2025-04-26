import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Paper,
  Typography
} from '@mui/material';
import {
  ArrayFieldDef,
  FieldDef,
  handleBasicChange,
  handleNestedChange,
  renderAccordionArrayFields,
  renderArrayFields,
  renderObjectFields
} from './FormUtils';

import { Campaign } from '@/types/campaign';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';

interface WorldFormProps {
  campaignData: Partial<Campaign>;
  updateCampaignData: React.Dispatch<React.SetStateAction<Partial<Campaign>>>;
}

const WorldForm: React.FC<WorldFormProps> = ({
  campaignData,
  updateCampaignData
}) => {
  // Define fields for the world section
  const worldBaseFields: FieldDef[] = [
    { name: 'name', label: 'World Name', fullWidth: true },
    { name: 'description', label: 'World Description', multiline: true, rows: 4, fullWidth: true },
    { name: 'history', label: 'World History', multiline: true, rows: 4, fullWidth: true }
  ];
  
  // Define fields for the geography section
  const geographyFields: FieldDef[] = [
    { name: 'geography.overview', label: 'Geographic Overview', multiline: true, rows: 3, fullWidth: true },
    { name: 'geography.mapNotes', label: 'Map Notes', multiline: true, rows: 2, fullWidth: true }
  ];
  
  // Define array fields
  const arrayFields: ArrayFieldDef[] = [
    {
      name: 'regions',
      label: 'Regions',
      defaultExpanded: true,
      fields: [
        { name: 'name', label: 'Region Name' },
        { name: 'description', label: 'Description', multiline: true },
        { name: 'climate', label: 'Climate' },
        { name: 'dangers', label: 'Dangers', multiline: true }
      ]
    },
    {
      name: 'cultures',
      label: 'Cultures',
      fields: [
        { name: 'name', label: 'Culture Name' },
        { name: 'description', label: 'Description', multiline: true },
        { name: 'values', label: 'Values', multiline: true },
        { name: 'customs', label: 'Customs', multiline: true },
        { name: 'relations', label: 'Relations with Others', multiline: true }
      ]
    },
    {
      name: 'factions',
      label: 'Factions',
      fields: [
        { name: 'name', label: 'Faction Name' },
        { name: 'description', label: 'Description', multiline: true },
        { name: 'goals', label: 'Goals', multiline: true },
        { name: 'resources', label: 'Resources' },
        { name: 'influence', label: 'Influence & Power' },
        { name: 'leadership', label: 'Leadership' }
      ]
    }
  ];
  
  // Define magic/tech fields
  const magicTechFields: FieldDef[] = [
    { name: 'magicTech.description', label: 'Description', multiline: true, rows: 3, fullWidth: true },
    { name: 'magicTech.prevalence', label: 'Prevalence' },
    { name: 'magicTech.limitations', label: 'Limitations', multiline: true },
    { name: 'magicTech.uniqueAspects', label: 'Unique Aspects', multiline: true }
  ];

  // Handle field changes
  const handleChange = ({ section, field, value, updateData }: { 
    section: string; 
    field: string; 
    value: any; 
    updateData: React.Dispatch<React.SetStateAction<any>>; 
  }) => {
    if (field.includes('.')) {
      handleNestedChange({ section, field, value, updateData });
    } else {
      handleBasicChange({ section, field, value, updateData });
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        World Building
      </Typography>
      
      <Box sx={{ mt: 2 }}>
        {renderObjectFields(
          'world',
          campaignData,
          worldBaseFields,
          handleChange,
          updateCampaignData
        )}
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      {/* Geography Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Geography</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {renderObjectFields(
            'world',
            campaignData,
            geographyFields,
            handleChange,
            updateCampaignData
          )}
          
          {renderArrayFields(
            'world',
            'geography.regions',
            'Region',
            campaignData,
            arrayFields[0].fields,
            updateCampaignData
          )}
        </AccordionDetails>
      </Accordion>
      
      {/* Cultures Section */}
      {renderAccordionArrayFields(
        'world',
        arrayFields[1],
        campaignData,
        updateCampaignData
      )}
      
      {/* Factions Section */}
      {renderAccordionArrayFields(
        'world',
        arrayFields[2],
        campaignData,
        updateCampaignData
      )}
      
      {/* Magic/Tech Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Magic & Technology</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {renderObjectFields(
            'world',
            campaignData,
            magicTechFields,
            handleChange,
            updateCampaignData
          )}
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default WorldForm;