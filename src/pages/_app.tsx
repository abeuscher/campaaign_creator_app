import '@/styles/global.scss';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import { AppProps } from 'next/app';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from '@/components/Layout/Layout';
import React from 'react';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;