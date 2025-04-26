import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Paper,
  Typography
} from '@mui/material';
import {
  ArrayFieldDef,
  FieldDef,
  renderArrayFields
} from './FormUtils';

import { Campaign } from '@/types/campaign';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';

interface CharactersFormProps {
  campaignData: Partial<Campaign>;
  updateCampaignData: React.Dispatch<React.SetStateAction<Partial<Campaign>>>;
}

const CharactersForm: React.FC<CharactersFormProps> = ({
  campaignData,
  updateCampaignData
}) => {
  // Define array fields
  const characterTypes: ArrayFieldDef[] = [
    {
      name: 'majorNPCs',
      label: 'Major NPCs',
      defaultExpanded: true,
      fields: [
        { name: 'name', label: 'Name' },
        { name: 'role', label: 'Role' },
        { name: 'description', label: 'Description', multiline: true },
        { name: 'personality', label: 'Personality', multiline: true },
        { name: 'motivations', label: 'Motivations', multiline: true }
      ]
    },
    {
      name: 'antagonists',
      label: 'Villains & Antagonists',
      fields: [
        { name: 'name', label: 'Name' },
        { name: 'description', label: 'Description', multiline: true },
        { name: 'motivations', label: 'Motivations', multiline: true },
        { name: 'methods', label: 'Methods', multiline: true },
        { name: 'vulnerabilities', label: 'Vulnerabilities', multiline: true }
      ]
    },
    {
      name: 'minorNPCs',
      label: 'Minor NPCs',
      fields: [
        { name: 'name', label: 'Name' },
        { name: 'role', label: 'Role' },
        { name: 'description', label: 'Description', multiline: true },
        { name: 'location', label: 'Location' }
      ]
    }
  ];

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Characters
      </Typography>
      
      {/* Major NPCs */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">{characterTypes[0].label}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {renderArrayFields(
            'characters',
            characterTypes[0].name,
            characterTypes[0].label,
            campaignData,
            characterTypes[0].fields,
            updateCampaignData
          )}
        </AccordionDetails>
      </Accordion>
      
      {/* Villains and Antagonists */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">{characterTypes[1].label}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {renderArrayFields(
            'characters',
            characterTypes[1].name,
            characterTypes[1].label,
            campaignData,
            characterTypes[1].fields,
            updateCampaignData
          )}
        </AccordionDetails>
      </Accordion>
      
      {/* Minor NPCs */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">{characterTypes[2].label}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {renderArrayFields(
            'characters',
            characterTypes[2].name,
            characterTypes[2].label,
            campaignData,
            characterTypes[2].fields,
            updateCampaignData
          )}
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default CharactersForm;