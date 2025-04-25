export interface Campaign {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    
    // Basic information
    basics: {
      title: string;
      description: string;
      theme: string; // e.g., heroic, dark, epic
      tone: string; // e.g., serious, lighthearted, gritty
      levelRange: string; // e.g., "1-10", "5-15"
      estimatedDuration: string; // e.g., "10 sessions", "6 months"
      playerCount: {
        min: number;
        max: number;
        recommended: number;
      };
    };
    
    // World building
    world: {
      name: string;
      description: string;
      history: string;
      
      // Geography
      geography: {
        overview: string;
        mapNotes: string;
        regions: Array<{
          name: string;
          description: string;
          climate: string;
          dangers: string;
          pointsOfInterest: string[];
        }>;
      };
      
      // Cultures and societies
      cultures: Array<{
        name: string;
        description: string;
        values: string;
        customs: string;
        relations: string; // Relations with other cultures
      }>;
      
      // Factions and organizations
      factions: Array<{
        name: string;
        description: string;
        goals: string;
        resources: string;
        influence: string;
        leadership: string;
        allies: string[];
        enemies: string[];
      }>;
      
      // Magic, technology, or supernatural elements
      magicTech: {
        description: string;
        prevalence: string; // How common is magic/tech?
        limitations: string;
        uniqueAspects: string;
      };
      
      // Calendar and time
      calendar: {
        description: string;
        importantDates: Array<{
          name: string;
          description: string;
          significance: string;
        }>;
      };
    };
    
    // Story arcs
    storyArcs: {
      // Main campaign arc
      mainArc: {
        title: string;
        premise: string;
        hook: string; // How players get involved
        progression: Array<{
          stage: string; // e.g., "Introduction", "Rising Action", "Climax"
          description: string;
          events: string;
          playerChoices: string;
          consequences: string;
        }>;
        climax: string;
        resolution: string;
        alternateEndings: string[];
      };
      
      // Smaller story arcs/quests
      subArcs: Array<{
        title: string;
        description: string;
        hook: string;
        relatedToMainArc: boolean;
        progression: string;
        resolution: string;
        rewards: string;
      }>;
    };
    
    // Characters
    characters: {
      // Major NPCs
      majorNPCs: Array<{
        name: string;
        role: string;
        description: string;
        personality: string;
        motivations: string;
        secrets: string;
        relationships: string;
        stats?: string; // Optional reference to game stats
      }>;
      
      // Minor/Background NPCs
      minorNPCs: Array<{
        name: string;
        role: string;
        description: string;
        location: string;
      }>;
      
      // Villains and antagonists
      antagonists: Array<{
        name: string;
        description: string;
        motivations: string;
        methods: string;
        vulnerabilities: string;
        minions: string[];
      }>;
    };
    
    // Locations
    locations: Array<{
      name: string;
      type: string; // e.g., "dungeon", "city", "wilderness"
      description: string;
      significance: string;
      keyFeatures: string[];
      secrets: string;
      encounters: string[];
      treasures: string[];
    }>;
    
    // Encounters
    encounters: {
      // Prepared set-piece encounters
      setEncounters: Array<{
        name: string;
        type: string; // e.g., "combat", "social", "puzzle"
        description: string;
        setup: string;
        challenge: string;
        resolution: string;
        rewards: string;
      }>;
      
      // Random encounter tables
      randomEncounters: Array<{
        location: string;
        encounters: Array<{
          probability: string; // e.g., "1-10", "20%"
          description: string;
        }>;
      }>;
    };
    
    // Items and rewards
    items: {
      uniqueItems: Array<{
        name: string;
        description: string;
        history: string;
        powers: string;
        location: string; // Where it can be found
      }>;
      
      // Treasure distribution plan
      treasurePlan: string;
      
      // Non-material rewards (titles, property, followers)
      nonMaterialRewards: string;
    };
    
    // Session planning
    sessions: Array<{
      title: string;
      goals: string[];
      setup: string;
      keyScenes: string[];
      contingencyPlans: string;
      notes: string;
    }>;
    
    // House rules and modifications
    houseRules: Array<{
      rule: string;
      description: string;
      reason: string;
    }>;
    
    // Player resources and handouts
    playerResources: Array<{
      title: string;
      content: string;
      whenToShare: string;
    }>;
    
    // GM notes and reference
    gmNotes: string;
    
    // Campaign type (pre-written, homebrew, hybrid)
    campaignType: 'preWritten' | 'homebrew' | 'hybrid';
    
    // References to system-specific rules or materials
    systemReferences: Array<{
      name: string;
      page: string;
      notes: string;
    }>;
  }
  
  // Campaign generation status
  export type CampaignGenerationStatus = 'notStarted' | 'inProgress' | 'completed';
  
  // Campaign wizard state
  export interface CampaignWizardState {
    currentStep: number;
    totalSteps: number;
    completedSections: string[];
    campaignData: Campaign;
    generationStatus: CampaignGenerationStatus;
  }