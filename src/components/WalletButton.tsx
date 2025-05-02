'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'

export const WalletButton = () => {
  const { connectors, connect } = useConnect()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const shortAddress = address 
    ? `${address.substring(0, 6)}...${address.substring(38)}`
    : ''

  return (
    <button
      onClick={() => isConnected ? disconnect() : connect({ connector: connectors[0] })}
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
  )
}
