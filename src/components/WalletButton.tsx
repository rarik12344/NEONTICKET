// src/components/WalletButton.tsx
import { useState } from 'react';
import { FaWallet, FaCheckCircle, FaSpinner } from 'react-icons/fa';
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
      {isConnecting ? (
        <FaSpinner className={styles.spin} />
      ) : account ? (
        <FaCheckCircle />
      ) : (
        <FaWallet />
      )}
      {isConnecting ? 'Connecting...' : account ? 
        `${account.substring(0, 6)}...${account.substring(38)}` : 
        isMiniApp ? 'Connect Warpcast Wallet' : 'Connect Wallet'}
    </button>
  );
};
