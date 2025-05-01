import { useState, useEffect } from 'react';
import { useWeb3 } from '../hooks/useContract'; // Предполагается, что у вас есть хук для работы с Web3

interface WalletButtonProps {
  onConnect: (account: string) => void;
  onDisconnect: () => void;
  account: string | null;
}

export const WalletButton = ({ onConnect, onDisconnect, account }: WalletButtonProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { web3, connectWallet, disconnectWallet } = useWeb3(); // Используем ваш хук для Web3

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const accounts = await connectWallet();
      if (accounts && accounts[0]) {
        onConnect(accounts[0]);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    onDisconnect();
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
