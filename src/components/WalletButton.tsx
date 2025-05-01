// src/components/WalletButton.tsx
import { useState } from 'react';
import { FaWallet, FaCheckCircle, FaSpinner } from 'react-icons/fa';

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

  const handleDisconnect = () => {
    // В вашем index.tsx нет метода disconnect, поэтому просто сбрасываем account через connectWallet
    // Если нужно полноценное отключение, добавьте disconnectWallet в пропсы
    window.location.reload(); // Простое решение для сброса состояния
  };

  const getButtonText = () => {
    if (isConnecting) {
      return (
        <>
          <FaSpinner className="spin" /> Connecting...
        </>
      );
    }
    if (account) {
      const shortAddress = `${account.substring(0, 6)}...${account.substring(38)}`;
      return (
        <>
          <FaCheckCircle /> {shortAddress}
        </>
      );
    }
    return (
      <>
        <FaWallet /> {isMiniApp ? 'Connect Warpcast Wallet' : 'Connect Wallet'}
      </>
    );
  };

  return (
    <button
      onClick={account ? handleDisconnect : handleConnect}
      className={`wallet-button ${account ? 'connected' : ''} ${isMiniApp ? 'miniapp' : ''}`}
      disabled={isConnecting}
    >
      {getButtonText()}
    </button>
  );
};
