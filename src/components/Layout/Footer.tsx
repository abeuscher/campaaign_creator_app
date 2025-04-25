import { Box, Container, Typography } from '@mui/material';

import React from 'react';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          Campaign Wizard POC © {new Date().getFullYear()}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;