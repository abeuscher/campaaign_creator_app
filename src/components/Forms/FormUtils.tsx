import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import { Campaign } from '@/types/campaign';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';

export type FieldDef = {
  name: string;
  label: string;
  multiline?: boolean;
  rows?: number;
  fullWidth?: boolean;
};

export type ArrayFieldDef = {
  name: string;
  label: string;
  fields: FieldDef[];
  defaultExpanded?: boolean;
};

type HandleChangeProps = {
  section: string;
  field: string;
  value: any;
  updateData: React.Dispatch<React.SetStateAction<any>>;
};

type HandleArrayChangeProps = {
  section: string;
  arrayName: string;
  index: number;
  field: string;
  value: any;
  updateData: React.Dispatch<React.SetStateAction<any>>;
};

// Handle basic text field changes
export const handleBasicChange = ({ section, field, value, updateData }: HandleChangeProps) => {
  updateData((prevData: Record<string, any>) => ({
    ...prevData,
    [section]: {
      ...(prevData[section] || {}),
      [field]: value
    }
  }));
};

// Handle nested field changes
export const handleNestedChange = ({ section, field, value, updateData }: HandleChangeProps) => {
  const [subSection, subField] = field.split('.');
  
  updateData((prevData: Record<string, any>) => ({
    ...prevData,
    [section]: {
      ...(prevData[section] || {}),
      [subSection]: {
        ...((prevData[section] || {})[subSection] || {}),
        [subField]: value
      }
    }
  }));
};

// Handle array item change
export const handleArrayItemChange = ({ 
  section, 
  arrayName, 
  index, 
  field, 
  value, 
  updateData 
}: HandleArrayChangeProps) => {
  updateData((prevData: Record<string, any>) => {
    const sectionData = prevData[section] || {};
    const array = [...(sectionData[arrayName] || [])];
    
    if (!array[index]) {
      array[index] = {};
    }
    
    array[index] = {
      ...array[index],
      [field]: value
    };
    
    return {
      ...prevData,
      [section]: {
        ...sectionData,
        [arrayName]: array
      }
    };
  });
};

// Add item to array
export const handleAddArrayItem = (
  section: string, 
  arrayName: string, 
  updateData: React.Dispatch<React.SetStateAction<any>>
) => {
  updateData((prevData: Record<string, any>) => {
    const sectionData = prevData[section] || {};
    const array = [...(sectionData[arrayName] || [])];
    
    array.push({});
    
    return {
      ...prevData,
      [section]: {
        ...sectionData,
        [arrayName]: array
      }
    };
  });
};

// Remove item from array
export const handleRemoveArrayItem = (
  section: string, 
  arrayName: string, 
  index: number, 
  updateData: React.Dispatch<React.SetStateAction<any>>
) => {
  updateData((prevData: Record<string, any>) => {
    const sectionData = prevData[section] || {};
    const array = [...(sectionData[arrayName] || [])];
    
    array.splice(index, 1);
    
    return {
      ...prevData,
      [section]: {
        ...sectionData,
        [arrayName]: array
      }
    };
  });
};

// Render text fields for an object
export const renderObjectFields = (
  section: string,
  formData: any,
  fields: FieldDef[],
  handleChange: (props: HandleChangeProps) => void,
  updateData: React.Dispatch<React.SetStateAction<any>>
) => {
  return (
    <Grid container spacing={2}>
      {fields.map(field => {
        const fieldPath = field.name.includes('.') ? field.name : `${field.name}`;
        const fieldValue = field.name.includes('.') 
          ? formData?.[section]?.[field.name.split('.')[0]]?.[field.name.split('.')[1]] || ''
          : formData?.[section]?.[field.name] || '';
          
        return (
          <Grid key={field.name}>
            <TextField
              fullWidth
              label={field.label}
              value={fieldValue}
              onChange={(e) => handleChange({ 
                section, 
                field: fieldPath, 
                value: e.target.value, 
                updateData 
              })}
              multiline={field.multiline}
              rows={field.rows || 2}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

// Render array of form fields with add/remove buttons
export const renderArrayFields = (
  section: string,
  arrayName: string,
  title: string,
  formData: any,
  fields: FieldDef[],
  updateData: React.Dispatch<React.SetStateAction<any>>
) => {
  const items = (formData?.[section]?.[arrayName] || []) as any[];
  
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle1">{title}</Typography>
        <Button 
          startIcon={<AddIcon />} 
          onClick={() => handleAddArrayItem(section, arrayName, updateData)}
          variant="outlined" 
          size="small"
        >
          Add
        </Button>
      </Box>
      
      {items.map((item, index) => (
        <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2">{title} #{index + 1}</Typography>
            <IconButton 
              size="small" 
              color="error" 
              onClick={() => handleRemoveArrayItem(section, arrayName, index, updateData)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
          
          <Grid container spacing={2}>
            {fields.map(field => (
              <Grid key={field.name}>
                <TextField
                  fullWidth
                  label={field.label}
                  value={item[field.name] || ''}
                  onChange={(e) => handleArrayItemChange({
                    section,
                    arrayName,
                    index,
                    field: field.name,
                    value: e.target.value,
                    updateData
                  })}
                  margin="dense"
                  multiline={field.multiline}
                  rows={field.rows || 2}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      ))}
      
      {items.length === 0 && (
        <Typography color="text.secondary" variant="body2">
          No {title.toLowerCase()} added yet. Click "Add" to create one.
        </Typography>
      )}
    </Box>
  );
};

// Render array fields within an accordion
export const renderAccordionArrayFields = (
  section: string,
  arrayDef: ArrayFieldDef,
  formData: any,
  updateData: React.Dispatch<React.SetStateAction<any>>
) => {
  return (
    <Accordion defaultExpanded={arrayDef.defaultExpanded} sx={{ mb: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{arrayDef.label}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {renderArrayFields(
          section,
          arrayDef.name,
          arrayDef.label,
          formData,
          arrayDef.fields,
          updateData
        )}
      </AccordionDetails>
    </Accordion>
  );
};