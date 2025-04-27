import { callLLMApi, extractJSONFromResponse } from './api';

import { Campaign } from '@/types/campaign';

// Helper function to recursively build context from filled fields
function buildFieldContext(obj: any, prefix: string = ''): string[] {
  const result: string[] = [];
  
  if (!obj || typeof obj !== 'object') return result;
  
  Object.entries(obj).forEach(([key, value]) => {
    const fieldName = prefix ? `${prefix}.${key}` : key;
    
    if (value === null || value === undefined || value === '') {
      return; // Skip empty values
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) return; // Skip empty arrays
      
      // For simple arrays of primitives
      if (typeof value[0] !== 'object') {
        result.push(`${formatFieldName(fieldName)}: ${value.join(', ')}`);
      } else {
        // For arrays of objects, add a summary
        result.push(`${formatFieldName(fieldName)}: ${value.length} items defined`);
        
        // Optionally add first few items as examples
        value.slice(0, 2).forEach((item, i) => {
          const itemContext = buildFieldContext(item, `${fieldName}[${i}]`);
          if (itemContext.length > 0) {
            result.push(`  Item ${i+1}:`);
            itemContext.forEach(line => result.push(`    ${line}`));
          }
        });
      }
    } else if (typeof value === 'object') {
      // Recursively process nested objects
      const nestedContext = buildFieldContext(value, fieldName);
      if (nestedContext.length > 0) {
        result.push(`${formatFieldName(key)}:`);
        nestedContext.forEach(line => result.push(`  ${line}`));
      }
    } else {
      // Simple field
      result.push(`${formatFieldName(fieldName)}: ${value}`);
    }
  });
  
  return result;
}

// Helper function to identify missing fields based on schema
function findMissingFields(data: any, schema?: any): string[] {
  // In a real implementation, you'd compare against the expected schema
  // For this example, we'll use a simpler approach of looking for undefined/null values
  const result: string[] = [];
  
  // Simple implementation for proof of concept
  if (!data || typeof data !== 'object') return result;
  
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      result.push(key);
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      const nestedMissing = findMissingFields(value).map(field => `${key}.${field}`);
      result.push(...nestedMissing);
    }
  });
  
  return result;
}

// Helper function to format field names for display
function formatFieldName(field: string): string {
  return field
    .split(/\.|\[|\]/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

// Deep merge utility for combining existing data with LLM response
function deepMerge(target: any, source: any): any {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  
  return output;
}

function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

// Generic completion template generator
export const createCompletionTemplate = (sectionName: string, sectionDisplayName: string) => {
  return {
    sectionName,
    
    generatePrompt: (existingData: Partial<Campaign>) => {
      const sectionData = existingData[sectionName as keyof Campaign] || {};
      
      // Build context preamble
      let context = `I'm creating a tabletop RPG campaign and need help completing the ${sectionDisplayName} information.\n\n`;
      
      // Add filled information to context
      const filledFields = buildFieldContext(sectionData);
      if (filledFields.length > 0) {
        context += "Here's what I have so far:\n";
        context += filledFields.join("\n");
        context += "\n\n";
      }
      
      // Identify missing fields
      const missingFields = findMissingFields(sectionData);
      
      // Request completion for missing fields
      if (missingFields.length > 0) {
        context += "Please help me complete the following missing information:\n";
        context += missingFields.map(field => `- ${formatFieldName(field)}`).join("\n");
        context += "\n\n";
      } else {
        context += "I have filled out all the basic fields, but would appreciate enhancements or creative additions to make this more interesting.\n\n";
      }
      
      // Add structure instructions
      context += `Please respond in JSON format matching the structure of a ${sectionDisplayName} section.\n`;
      context += "Only include the fields I mentioned are missing. Be creative but concise and stay consistent with the existing information.";
      
      return context;
    },
    
    completeSection: async (
      existingData: Partial<Campaign>, 
      provider: 'mistral' | 'anthropic' | 'openai' = 'anthropic'
    ) => {
      try {
        // Generate the prompt
        const prompt = createCompletionTemplate(sectionName, sectionDisplayName).generatePrompt(existingData);
        
        // Add system context to guide the LLM
        const systemContext = `You are a creative writing assistant helping to create a tabletop RPG campaign. 
        Focus on creating interesting, coherent, and playable content that fits with the theme and tone provided.
        Always respond with valid JSON that matches the structure needed.`;
        
        // Call the LLM API
        const response = await callLLMApi(prompt, systemContext, provider);
        
        if (!response.success) {
          throw new Error(`Failed to complete section: ${response.error}`);
        }
        
        // Extract and process JSON from the response
        const responseData = extractJSONFromResponse(response.content);
        const currentSection = existingData[sectionName as keyof Campaign] || {};
        
        // Deep merge response with existing data
        const updatedSection = deepMerge(currentSection, responseData);
        
        return {
          ...existingData,
          [sectionName]: updatedSection
        };
      } catch (error) {
        console.error(`Error completing ${sectionName} section:`, error);
        throw error;
      }
    }
  };
};

// Create completion templates for each section
export const basicsTemplate = createCompletionTemplate('basics', 'Campaign Basics');
export const worldTemplate = createCompletionTemplate('world', 'World Building');
export const storyArcsTemplate = createCompletionTemplate('storyArcs', 'Story Arcs');
export const charactersTemplate = createCompletionTemplate('characters', 'Characters');
export const locationsTemplate = createCompletionTemplate('locations', 'Locations');

// Complete all sections in sequence
export async function completeFullCampaign(
  campaignData: Partial<Campaign>,
  provider: 'mistral' | 'anthropic' | 'openai' = 'anthropic'
): Promise<Partial<Campaign>> {
  let updatedData = { ...campaignData };
  
  // Define the order of completion
  const sections = [
    { template: basicsTemplate, name: 'basics', display: 'Campaign Basics' },
    { template: worldTemplate, name: 'world', display: 'World Building' },
    { template: storyArcsTemplate, name: 'storyArcs', display: 'Story Arcs' },
    { template: charactersTemplate, name: 'characters', display: 'Characters' },
    { template: locationsTemplate, name: 'locations', display: 'Locations' }
  ];
  
  // Process each section in sequence
  for (const section of sections) {
    try {
      updatedData = await section.template.completeSection(updatedData, provider);
      console.log(`Completed ${section.display}`);
    } catch (error) {
      console.error(`Error completing ${section.display}:`, error);
      // Continue with next section even if one fails
    }
  }
  
  return updatedData;
}