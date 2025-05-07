import { Box, Button, Paper, Typography } from '@mui/material';

import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <>
      <Head>
        <title>Campaign Wizard POC</title>
        <meta name="description" content="Create RPG campaigns with AI assistance" />
      </Head>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Campaign Wizard POC
        </Typography>
        
        <Typography variant="body1" paragraph>
          Welcome to the Campaign Wizard POC! This is a minimal setup to get you started.
        </Typography>

        <Typography variant="body1" paragraph>
          This prototype application will guide users through creating a tabletop RPG campaign
          with the assistance of an LLM.
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Link href="/editor" passHref>
            <Button variant="contained" color="primary" size="large">
              Start the Wizard
            </Button>
          </Link>
        </Box>
      </Paper>
    </>
  );
}