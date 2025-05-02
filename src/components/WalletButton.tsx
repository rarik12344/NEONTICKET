import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export const WalletButton = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: injected(),
  });
  const { disconnect } = useDisconnect();

  const shortAddress = address 
    ? `${address.substring(0, 6)}...${address.substring(38)}`
    : '';

  return (
    <button
      onClick={() => isConnected ? disconnect() : connect()}
      className={`w-full font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 ${
        isConnected
          ? 'bg-neon-green text-black after:content-[""] after:absolute after:-inset-1/2 after:bg-gradient-to-br after:from-transparent after:via-white/30 after:to-transparent after:rotate-30 after:animate-shine'
          : 'bg-neon-blue text-black'
      }`}
    >
      {isConnected ? (
        <>
          <span>✓</span>
          <span>{shortAddress}</span>
        </>
      ) : (
        <>
          <span>🔗</span>
          <span>Connect Wallet</span>
        </>
      )}
    </button>
  );
};
