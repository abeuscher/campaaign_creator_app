import {
  basicsTemplate,
  charactersTemplate,
  completeFullCampaign,
  createCompletionTemplate,
  locationsTemplate,
  storyArcsTemplate,
  worldTemplate
} from '../services/llm/completionTemplates';

import { Campaign } from '@/types/campaign';
import { useState } from 'react';

type CompletionProvider = 'mistral' | 'anthropic' | 'openai';

interface CompletionGeneratorProps {
  campaignData: Partial<Campaign>;
  onUpdateCampaign: (data: Partial<Campaign>) => void;
  defaultProvider?: CompletionProvider;
}

interface CompletionGeneratorReturn {
  generateCompletion: (sectionName: string, sectionDisplayName: string) => Promise<boolean>;
  generateFullCampaign: () => Promise<boolean>;
  isGenerating: boolean;
  error: string | null;
  completionProvider: CompletionProvider;
  setCompletionProvider: (provider: CompletionProvider) => void;
}

export function useCompletionGenerator({
  campaignData,
  onUpdateCampaign,
  defaultProvider = 'anthropic'
}: CompletionGeneratorProps): CompletionGeneratorReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completionProvider, setCompletionProvider] = useState<CompletionProvider>(defaultProvider);

  // Get template for a section
  const getTemplateForSection = (sectionName: string) => {
    switch (sectionName) {
      case 'basics':
        return basicsTemplate;
      case 'world':
        return worldTemplate;
      case 'storyArcs':
        return storyArcsTemplate;
      case 'characters':
        return charactersTemplate;
      case 'locations':
        return locationsTemplate;
      default:
        // Create a dynamic template if not one of the predefined ones
        return createCompletionTemplate(sectionName, sectionName);
    }
  };

  // Generate completion for a specific section
  const generateCompletion = async (sectionName: string, sectionDisplayName: string): Promise<boolean> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const template = getTemplateForSection(sectionName);
      
      const updatedData = await template.completeSection(campaignData, completionProvider);
      onUpdateCampaign(updatedData);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate completion for the entire campaign
  const generateFullCampaign = async (): Promise<boolean> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const updatedData = await completeFullCampaign(campaignData, completionProvider);
      onUpdateCampaign(updatedData);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateCompletion,
    generateFullCampaign,
    isGenerating,
    error,
    completionProvider,
    setCompletionProvider
  };
}