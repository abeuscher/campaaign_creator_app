import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';

import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/router';

const Header: React.FC = () => {
  const router = useRouter();
  
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Campaign Wizard
        </Typography>
        <Box>
          <Link href="/" passHref>
            <Button 
              color="inherit"
              sx={{ 
                fontWeight: router.pathname === '/' ? 'bold' : 'normal',
                textDecoration: router.pathname === '/' ? 'underline' : 'none'
              }}
            >
              Home
            </Button>
          </Link>
          <Link href="/wizard" passHref>
            <Button 
              color="inherit"
              sx={{ 
                fontWeight: router.pathname === '/wizard' ? 'bold' : 'normal',
                textDecoration: router.pathname === '/wizard' ? 'underline' : 'none'
              }}
            >
              Wizard
            </Button>
          </Link>
          <Link href="/editor" passHref>
            <Button 
              color="inherit"
              sx={{ 
                fontWeight: router.pathname.startsWith('/editor') ? 'bold' : 'normal',
                textDecoration: router.pathname.startsWith('/editor') ? 'underline' : 'none'
              }}
            >
              Editor
            </Button>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;