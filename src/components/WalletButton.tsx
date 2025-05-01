import { useState } from 'react';
import styles from '../styles/Home.module.css';

interface WalletButtonProps {
  account: string | null;
  connectWallet: () => Promise<void>;
  isMiniApp: boolean;
}

export const WalletButton = ({ account, connectWallet, isMiniApp }: WalletButtonProps) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const getButtonText = () => {
    if (isConnecting) {
      return 'Connecting...';
    }
    if (account) {
      return `${account.substring(0, 6)}...${account.substring(38)}`;
    }
    return isMiniApp ? 'Connect Warpcast Wallet' : 'Connect Wallet';
  };

  return (
    <button
      onClick={handleConnect}
      className={`
        ${styles.walletButton}
        ${account ? styles.connected : ''}
        ${isMiniApp ? styles.miniapp : ''}
      `}
      disabled={isConnecting}
    >
      {getButtonText()}
    </button>
  );
};
