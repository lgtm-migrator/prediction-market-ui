import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from './design-system/atoms/Button/Button';
import { getIpfsInstance } from './ipfs/ipfs';
import { IPFSProvider } from './ipfs/IpfsContext';
import { connectWallet } from './wallet/connector';
import { getWalletType } from './wallet/utils';
import { WalletProvider } from './wallet/walletContext';
import { WalletInterface } from './interfaces';

const APP_NAME = 'PredictionMarket';
const NETWORK = 'carthagenet';

const App: React.FC = () => {
  const [ipfs, setIpfs] = useState<any>(undefined);
  const [wallet, setWallet] = useState<Partial<WalletInterface>>({});

  const checkWalletConnection = async () => {
    const prevUsedWallet = getWalletType();
    if (prevUsedWallet !== null) {
      const walletData = await connectWallet(APP_NAME, NETWORK, prevUsedWallet);
      walletData && setWallet(walletData);
    }
  };

  useEffect(() => {
    const initIpfs = async () => {
      const ipfsInstance = await getIpfsInstance();
      setIpfs(ipfsInstance);
    };
    if (!ipfs) {
      initIpfs();
    }
    checkWalletConnection();
  }, []);

  return (
    <IPFSProvider value={{ ipfs }}>
      <WalletProvider value={wallet}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            {!wallet.pkh && (
              <>
                <Button
                  label="Connect to thanos"
                  primary
                  onClick={() => {
                    connectWallet(APP_NAME, NETWORK, 'Thanos');
                  }}
                />
                <Button
                  label="Connect to beacon"
                  backgroundColor="yellow"
                  onClick={() => {
                    connectWallet(APP_NAME, NETWORK, 'Beacon');
                  }}
                />
              </>
            )}
          </header>
        </div>
      </WalletProvider>
    </IPFSProvider>
  );
};

export default App;
