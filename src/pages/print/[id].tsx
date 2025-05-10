import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import type { Campaign } from '@/types/campaign';
import Head from 'next/head';
import PrintIcon from '@mui/icons-material/Print';
import { useRouter } from 'next/router';

// Print-specific styling
const printStyles = `
  @media print {
    body {
      font-size: 12pt;
      color: black;
    }
    
    .no-print {
      display: none !important;
    }
    
    .page-break {
      page-break-before: always;
    }
    
    .section {
      margin-bottom: 20px;
    }
    
    h1, h2, h3, h4, h5, h6 {
      page-break-after: avoid;
    }
    
    .MuiPaper-root {
      box-shadow: none !important;
      border: none !important;
    }
  }
`;

const CampaignPrint: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Load campaign data from localStorage
      try {
        const savedCampaigns = JSON.parse(localStorage.getItem('savedCampaigns') || '[]');
        const foundCampaign = savedCampaigns.find((c: any) => c.id === id);
        if (foundCampaign) {
          setCampaign(foundCampaign.data);
        }
      } catch (error) {
        console.error('Error loading campaign:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  // Helper function to render array items with headers
  const renderArrayItems = (
    items: Array<any> = [],
    titleKey: string = 'name',
    contentKeys: string[] = ['description'],
    emptyMessage: string = 'None defined'
  ) => {
    if (!items || items.length === 0) {
      return <Typography variant="body2" color="text.secondary">{emptyMessage}</Typography>;
    }

    return (
      <List dense disablePadding>
        {items.map((item, index) => (
          <ListItem key={index} disableGutters sx={{ flexDirection: 'column', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
              {item[titleKey] || `Item ${index + 1}`}
            </Typography>
            {contentKeys.map(key => (
              item[key] && (
                <Typography variant="body2" component="div" key={key} sx={{ mt: 0.5 }}>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {item[key]}
                </Typography>
              )
            ))}
          </ListItem>
        ))}
      </List>
    );
  };

  // Helper function for section headers
  const SectionHeader = ({ children }: { children: React.ReactNode }) => (
    <Typography 
      variant="h5" 
      component="h2" 
      sx={{ 
        mt: 3, 
        mb: 1, 
        borderBottom: '1px solid #ccc',
        paddingBottom: '8px',
        pageBreakAfter: 'avoid'
      }}
    >
      {children}
    </Typography>
  );

  // Helper function for subsection headers
  const SubsectionHeader = ({ children }: { children: React.ReactNode }) => (
    <Typography 
      variant="h6" 
      component="h3" 
      sx={{ 
        mt: 2, 
        mb: 1,
        fontWeight: 'bold',
        pageBreakAfter: 'avoid'
      }}
    >
      {children}
    </Typography>
  );

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!campaign) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h5">Campaign not found</Typography>
        <Button variant="contained" onClick={() => router.push('/')} sx={{ mt: 2 }}>
          Return to Home
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Head>
        <title>{campaign.basics?.title || 'Untitled Campaign'} | Print Version</title>
        <style>{printStyles}</style>
      </Head>

      <Box className="no-print" sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          size="large"
        >
          Print Campaign
        </Button>
      </Box>

      <Container maxWidth="md" sx={{ mb: 8 }}>
        <Paper elevation={1} sx={{ p: 4 }}>
          {/* Campaign Title */}
          <Typography 
            variant="h3" 
            align="center" 
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            {campaign.basics?.title || 'Untitled Campaign'}
          </Typography>

          {/* Campaign Basics */}
          <Box className="section">
            <Grid container spacing={2}>
              {campaign.basics?.theme && (
                <Grid>
                  <Typography variant="body2">
                    <strong>Theme:</strong> {campaign.basics.theme}
                  </Typography>
                </Grid>
              )}
              {campaign.basics?.tone && (
                <Grid>
                  <Typography variant="body2">
                    <strong>Tone:</strong> {campaign.basics.tone}
                  </Typography>
                </Grid>
              )}
              {campaign.basics?.levelRange && (
                <Grid>
                  <Typography variant="body2">
                    <strong>Level Range:</strong> {campaign.basics.levelRange}
                  </Typography>
                </Grid>
              )}
              {campaign.basics?.estimatedDuration && (
                <Grid>
                  <Typography variant="body2">
                    <strong>Duration:</strong> {campaign.basics.estimatedDuration}
                  </Typography>
                </Grid>
              )}
              {campaign.basics?.playerCount && (
                <Grid>
                  <Typography variant="body2">
                    <strong>Players:</strong> {campaign.basics.playerCount.recommended} 
                    ({campaign.basics.playerCount.min}-{campaign.basics.playerCount.max})
                  </Typography>
                </Grid>
              )}
            </Grid>

            {campaign.basics?.description && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">{campaign.basics.description}</Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* World Section */}
          <div className="page-break"></div>
          <SectionHeader>World: {campaign.world?.name || 'Unnamed World'}</SectionHeader>
          
          {campaign.world?.description && (
            <Typography variant="body1" paragraph>
              {campaign.world.description}
            </Typography>
          )}
          
          {campaign.world?.history && (
            <>
              <SubsectionHeader>History</SubsectionHeader>
              <Typography variant="body1" paragraph>
                {campaign.world.history}
              </Typography>
            </>
          )}

          {campaign.world?.geography && (
            <>
              <SubsectionHeader>Geography</SubsectionHeader>
              <Typography variant="body1" paragraph>
                {campaign.world.geography.overview}
              </Typography>
              
              {campaign.world.geography.regions && campaign.world.geography.regions.length > 0 && (
                <>
                  <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'bold' }}>
                    Regions
                  </Typography>
                  {renderArrayItems(campaign.world.geography.regions, 'name', ['description', 'climate', 'dangers'])}
                </>
              )}
            </>
          )}
          
          {campaign.world?.cultures && campaign.world.cultures.length > 0 && (
            <>
              <SubsectionHeader>Cultures</SubsectionHeader>
              {renderArrayItems(campaign.world.cultures, 'name', ['description', 'values', 'customs', 'relations'])}
            </>
          )}
          
          {campaign.world?.factions && campaign.world.factions.length > 0 && (
            <>
              <SubsectionHeader>Factions</SubsectionHeader>
              {renderArrayItems(campaign.world.factions, 'name', ['description', 'goals', 'resources', 'influence'])}
            </>
          )}
          
          {campaign.world?.magicTech && (
            <>
              <SubsectionHeader>Magic & Technology</SubsectionHeader>
              <Typography variant="body1" paragraph>
                {campaign.world.magicTech.description}
              </Typography>
              {campaign.world.magicTech.prevalence && (
                <Typography variant="body2">
                  <strong>Prevalence:</strong> {campaign.world.magicTech.prevalence}
                </Typography>
              )}
              {campaign.world.magicTech.limitations && (
                <Typography variant="body2">
                  <strong>Limitations:</strong> {campaign.world.magicTech.limitations}
                </Typography>
              )}
            </>
          )}

          <div className="page-break"></div>
          
          {/* Story Arcs Section */}
          <SectionHeader>Story Arcs</SectionHeader>
          
          {campaign.storyArcs?.mainArc && (
            <>
              <SubsectionHeader>Main Campaign Arc: {campaign.storyArcs.mainArc.title}</SubsectionHeader>
              
              {campaign.storyArcs.mainArc.premise && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Premise:</strong> {campaign.storyArcs.mainArc.premise}
                </Typography>
              )}
              
              {campaign.storyArcs.mainArc.hook && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Hook:</strong> {campaign.storyArcs.mainArc.hook}
                </Typography>
              )}
              
              {campaign.storyArcs.mainArc.progression && campaign.storyArcs.mainArc.progression.length > 0 && (
                <>
                  <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
                    Story Progression
                  </Typography>
                  {renderArrayItems(campaign.storyArcs.mainArc.progression, 'stage', ['description', 'events', 'playerChoices'])}
                </>
              )}
              
              {campaign.storyArcs.mainArc.climax && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Climax:</strong> {campaign.storyArcs.mainArc.climax}
                </Typography>
              )}
              
              {campaign.storyArcs.mainArc.resolution && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Resolution:</strong> {campaign.storyArcs.mainArc.resolution}
                </Typography>
              )}
            </>
          )}
          
          {campaign.storyArcs?.subArcs && campaign.storyArcs.subArcs.length > 0 && (
            <>
              <SubsectionHeader>Side Quests</SubsectionHeader>
              {renderArrayItems(campaign.storyArcs.subArcs, 'title', ['description', 'hook', 'progression', 'resolution', 'rewards'])}
            </>
          )}
          
          <div className="page-break"></div>
          
          {/* Characters Section */}
          <SectionHeader>Characters</SectionHeader>
          
          {campaign.characters?.majorNPCs && campaign.characters.majorNPCs.length > 0 && (
            <>
              <SubsectionHeader>Major NPCs</SubsectionHeader>
              {renderArrayItems(campaign.characters.majorNPCs, 'name', ['role', 'description', 'personality', 'motivations', 'secrets'])}
            </>
          )}
          
          {campaign.characters?.antagonists && campaign.characters.antagonists.length > 0 && (
            <>
              <SubsectionHeader>Villains & Antagonists</SubsectionHeader>
              {renderArrayItems(campaign.characters.antagonists, 'name', ['description', 'motivations', 'methods', 'vulnerabilities'])}
            </>
          )}
          
          {campaign.characters?.minorNPCs && campaign.characters.minorNPCs.length > 0 && (
            <>
              <SubsectionHeader>Minor NPCs</SubsectionHeader>
              {renderArrayItems(campaign.characters.minorNPCs, 'name', ['role', 'description', 'location'])}
            </>
          )}
          
          <div className="page-break"></div>
          
          {/* Locations Section */}
          {campaign.locations && campaign.locations.length > 0 && (
            <>
              <SectionHeader>Locations</SectionHeader>
              {renderArrayItems(campaign.locations, 'name', ['type', 'description', 'significance', 'keyFeatures', 'secrets'])}
            </>
          )}
          
          <div className="page-break"></div>
          
          {/* Encounters Section */}
          <SectionHeader>Encounters</SectionHeader>
          
          {campaign.encounters?.setEncounters && campaign.encounters.setEncounters.length > 0 && (
            <>
              <SubsectionHeader>Set-Piece Encounters</SubsectionHeader>
              {renderArrayItems(campaign.encounters.setEncounters, 'name', ['type', 'description', 'setup', 'challenge', 'resolution', 'rewards'])}
            </>
          )}
          
          {campaign.encounters?.randomEncounters && campaign.encounters.randomEncounters.length > 0 && (
            <>
              <SubsectionHeader>Random Encounters</SubsectionHeader>
              {campaign.encounters.randomEncounters.map((table, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {table.location || `Encounter Table ${index + 1}`}
                  </Typography>
                  <List dense>
                    {table.encounters.map((encounter, i) => (
                      <ListItem key={i} disableGutters>
                        <ListItemText 
                          primary={`${encounter.probability}: ${encounter.description}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))}
            </>
          )}
          
          <div className="page-break"></div>
          
          {/* Items and Rewards */}
          <SectionHeader>Items & Rewards</SectionHeader>
          
          {campaign.items?.uniqueItems && campaign.items.uniqueItems.length > 0 && (
            <>
              <SubsectionHeader>Unique Items</SubsectionHeader>
              {renderArrayItems(campaign.items.uniqueItems, 'name', ['description', 'history', 'powers', 'location'])}
            </>
          )}
          
          {campaign.items?.treasurePlan && (
            <>
              <SubsectionHeader>Treasure Distribution</SubsectionHeader>
              <Typography variant="body1" paragraph>
                {campaign.items.treasurePlan}
              </Typography>
            </>
          )}
          
          {campaign.items?.nonMaterialRewards && (
            <>
              <SubsectionHeader>Non-Material Rewards</SubsectionHeader>
              <Typography variant="body1" paragraph>
                {campaign.items.nonMaterialRewards}
              </Typography>
            </>
          )}
          
          {/* GM Notes */}
          {campaign.gmNotes && (
            <>
              <div className="page-break"></div>
              <SectionHeader>GM Notes</SectionHeader>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {campaign.gmNotes}
              </Typography>
            </>
          )}
          
          {/* House Rules */}
          {campaign.houseRules && campaign.houseRules.length > 0 && (
            <>
              <SectionHeader>House Rules</SectionHeader>
              {renderArrayItems(campaign.houseRules, 'rule', ['description', 'reason'])}
            </>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default CampaignPrint;