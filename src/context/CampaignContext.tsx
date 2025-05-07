// context/CampaignContext.tsx

import React, { ReactNode, createContext, useContext, useEffect, useReducer } from 'react';

import { Campaign } from '@/types/campaign';

interface CampaignState {
  currentCampaign: Partial<Campaign> | null;
  isLoading: boolean;
  error: string | null;
  chatHistory: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
  }>;
}

type CampaignAction =
  | { type: 'SET_CAMPAIGN'; payload: Partial<Campaign> }
  | { type: 'UPDATE_CAMPAIGN'; payload: Partial<Campaign> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_CHAT_MESSAGE'; payload: { role: 'user' | 'assistant' | 'system'; content: string } }
  | { type: 'CLEAR_CHAT_HISTORY' };

const initialState: CampaignState = {
  currentCampaign: null,
  isLoading: false,
  error: null,
  chatHistory: []
};

const CampaignContext = createContext<{
  state: CampaignState;
  dispatch: React.Dispatch<CampaignAction>;
  createCampaign: (name: string) => void;
  updateCampaign: (data: Partial<Campaign>) => void;
  saveCampaign: () => Promise<boolean>;
  loadCampaign: (id: string) => Promise<boolean>;
  addChatMessage: (role: 'user' | 'assistant' | 'system', content: string) => void;
}>({
  state: initialState,
  dispatch: () => null,
  createCampaign: () => {},
  updateCampaign: () => {},
  saveCampaign: async () => false,
  loadCampaign: async () => false,
  addChatMessage: () => {}
});

const campaignReducer = (state: CampaignState, action: CampaignAction): CampaignState => {
  switch (action.type) {
    case 'SET_CAMPAIGN':
      return {
        ...state,
        currentCampaign: action.payload
      };
    case 'UPDATE_CAMPAIGN':
      return {
        ...state,
        currentCampaign: state.currentCampaign 
          ? { ...state.currentCampaign, ...action.payload, updatedAt: new Date().toISOString() }
          : action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatHistory: [
          ...state.chatHistory,
          { ...action.payload, timestamp: new Date().toISOString() }
        ]
      };
    case 'CLEAR_CHAT_HISTORY':
      return {
        ...state,
        chatHistory: []
      };
    default:
      return state;
  }
};

export const CampaignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(campaignReducer, initialState);

  // Load the campaign from localStorage on initial mount
  useEffect(() => {
    const savedCampaign = localStorage.getItem('campaign_draft');
    if (savedCampaign) {
      try {
        const parsedCampaign = JSON.parse(savedCampaign);
        dispatch({ type: 'SET_CAMPAIGN', payload: parsedCampaign });
      } catch (error) {
        console.error('Error loading campaign from localStorage:', error);
      }
    }
  }, []);

  // Save campaign to localStorage whenever it changes
  useEffect(() => {
    if (state.currentCampaign) {
      localStorage.setItem('campaign_draft', JSON.stringify(state.currentCampaign));
    }
  }, [state.currentCampaign]);

  // Create a new campaign
  const createCampaign = (name: string) => {
    const newCampaign: Partial<Campaign> = {
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Initialize with empty structures
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
    
    dispatch({ type: 'SET_CAMPAIGN', payload: newCampaign });
  };

  // Update campaign with new data
  const updateCampaign = (data: Partial<Campaign>) => {
    dispatch({ type: 'UPDATE_CAMPAIGN', payload: data });
  };

  // Save campaign to backend (if implemented)
  const saveCampaign = async (): Promise<boolean> => {
    if (!state.currentCampaign) return false;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Here you would typically save to your backend
      // For now, we'll just save to localStorage
      localStorage.setItem('campaign_saved', JSON.stringify(state.currentCampaign));
      
      return true;
    } catch (error) {
      console.error('Error saving campaign:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: `Failed to save campaign: ${error instanceof Error ? error.message : String(error)}` 
      });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Load campaign from backend or localStorage
  const loadCampaign = async (id: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Here you would typically load from your backend
      // For now, we'll just load from localStorage
      const savedCampaign = localStorage.getItem('campaign_saved');
      if (!savedCampaign) {
        throw new Error('No saved campaign found');
      }
      
      const parsedCampaign = JSON.parse(savedCampaign);
      dispatch({ type: 'SET_CAMPAIGN', payload: parsedCampaign });
      
      return true;
    } catch (error) {
      console.error('Error loading campaign:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: `Failed to load campaign: ${error instanceof Error ? error.message : String(error)}` 
      });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Add a message to the chat history
  const addChatMessage = (role: 'user' | 'assistant' | 'system', content: string) => {
    dispatch({ 
      type: 'ADD_CHAT_MESSAGE', 
      payload: { role, content } 
    });
  };

  return (
    <CampaignContext.Provider
      value={{
        state,
        dispatch,
        createCampaign,
        updateCampaign,
        saveCampaign,
        loadCampaign,
        addChatMessage
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = () => useContext(CampaignContext);