import React, { Suspense, useEffect } from 'react';
import { LocalizationProvider } from '@material-ui/lab';
import { HelmetProvider } from 'react-helmet-async';
import { ToastProvider } from 'react-toast-notifications';
import DateFnsUtils from '@material-ui/lab/AdapterDateFns';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ThemeProvider } from '@material-ui/core';
import { Global } from '@emotion/react';
import { WalletProvider } from '@tezos-contrib/react-wallet-provider';
import { GlobalStyle } from './styles/style';
import { lightTheme } from './styles/theme';
import { AppRouter } from './router';
import { initTezos, initMarketContract, initFA12Contract } from './contracts/Market';
import { RPC_URL, RPC_PORT, MARKET_ADDRESS, FA12_CONTRACT, NETWORK, APP_NAME } from './globals';
import { Loading } from './design-system/atoms/Loading';
import { tzStatsBlockExplorer } from './utils/TzStatsBlockExplorer';
import { useStore } from './store/store';
import { getSavedSettings } from './utils/misc';
import { SettingValues } from './interfaces';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchInterval: 1000 * 30, staleTime: 1000 * 30 },
  },
});

const defaultSettings: SettingValues = {
  deadline: 30,
  maxSlippage: 5,
};

const App: React.FC = () => {
  const { setSettings } = useStore();

  useEffect(() => {
    initTezos(RPC_URL, RPC_PORT);
    initMarketContract(MARKET_ADDRESS);
    initFA12Contract(FA12_CONTRACT);
    const settings = getSavedSettings();
    setSettings(
      settings?.maxSlippage ?? defaultSettings.maxSlippage,
      settings?.deadline ?? defaultSettings.deadline,
    );
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <LocalizationProvider dateAdapter={DateFnsUtils}>
            <Global styles={GlobalStyle(lightTheme)} />
            <ThemeProvider theme={lightTheme}>
              <ToastProvider placement="bottom-right">
                <WalletProvider
                  name={APP_NAME}
                  network={NETWORK}
                  clientType="taquito"
                  blockExplorer={tzStatsBlockExplorer}
                >
                  <AppRouter />
                </WalletProvider>
              </ToastProvider>
            </ThemeProvider>
          </LocalizationProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </HelmetProvider>
    </Suspense>
  );
};

export default App;
