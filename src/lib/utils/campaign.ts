export interface Campaign {
    // Basic Metadata
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    
    // Core Campaign Elements
    basics: {
      title: string;
      description: string;
      theme: string;  // e.g., "heroic", "dark fantasy"
      tone: string;   // e.g., "serious", "lighthearted"
      levelRange: string;
      estimatedDuration: string;
      playerCount: {
        min: number;
        max: number;
        recommended: number;
      };
    };
    
    // World Building
    world: {
      name: string;
      description: string;
      history: string;
      geography: {
        overview: string;
        mapNotes: string;
        regions: Array<{
          name: string;
          description: string;
          climate: string;
          dangers: string;
        }>;
      };
      cultures: Array<{
        name: string;
        description: string;
        values: string;
        customs: string;
        relations: string;
      }>;
      factions: Array<{
        name: string;
        description: string;
        goals: string;
        resources: string;
        influence: string;
        leadership: string;
      }>;
      magicTech: {
        description: string;
        prevalence: string;
        limitations: string;
        uniqueAspects: string;
      };
    };
    
    // Story Elements
    storyArcs: {
      mainArc: {
        title: string;
        premise: string;
        progression: Array<{
          stage: string;
          description: string;
          events: string;
          playerChoices: string;
          consequences: string;
        }>;
        climax: string;
        resolution: string;
      };
      subArcs: Array<{
        title: string;
        description: string;
        hook: string;
        resolution: string;
      }>;
    };
    
    // Characters
    characters: {
      majorNPCs: Array<{
        name: string;
        role: string;
        description: string;
        personality: string;
        motivations: string;
      }>;
      minorNPCs: Array<{
        name: string;
        role: string;
        description: string;
        location: string;
      }>;
      antagonists: Array<{
        name: string;
        description: string;
        motivations: string;
        methods: string;
        vulnerabilities: string;
      }>;
    };
    
    // Places
    locations: Array<{
      name: string;
      type: string;
      description: string;
      significance: string;
      keyFeatures: string[];
    }>;
  }