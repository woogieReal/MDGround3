import 'prismjs/themes/prism-coy.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import createEmotionCache from '@/src/createEmotionCache';
import { CacheProvider, EmotionCache } from '@emotion/react';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/src/theme';
import { CustomSnackbar } from '@/components/common/module/customSnackbar';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MyApp({ Component, emotionCache = clientSideEmotionCache, pageProps }: MyAppProps) {
  const queryClient = new QueryClient();

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen={false} />
          <CustomSnackbar />
        </QueryClientProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default MyApp
