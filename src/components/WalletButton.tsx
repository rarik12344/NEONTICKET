// src/components/WalletButton.tsx
import { useState } from 'react';
import { useWeb3 } from '../hooks/useContract';

interface WalletButtonProps {
  onAccountChange: (account: string | null) => void;
}

export const WalletButton = ({ onAccountChange }: WalletButtonProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { account, connectWallet, disconnectWallet } = useWeb3();

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const accounts = await connectWallet();
      if (accounts && accounts[0]) {
        onAccountChange(accounts[0]);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    onAccountChange(null);
  };

  return (
    <button
      onClick={account ? handleDisconnect : handleConnect}
      className={`btn ${account ? 'wallet-connected' : ''}`}
      disabled={isConnecting}
    >
      {isConnecting ? (
        <i className="fas fa-spinner fa-spin"></i>
      ) : account ? (
        <>
          <i className="fas fa-check-circle"></i> 
          {`${account.substring(0, 6)}...${account.substring(38)}`}
        </>
      ) : (
        <>
          <i className="fas fa-wallet"></i> Connect Wallet
        </>
      )}
    </button>
  );
};
