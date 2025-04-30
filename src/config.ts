export const CONFIG = {
  contractAddress: "0x6927648b3114B8B54FA5476Ec3BC3A52f1ab513B",
  contractAbi: [
    // ... ваш ABI контракта ...
  ] as const,
  baseChainId: '0x2105',
  baseRpcUrl: 'https://mainnet.base.org',
  baseExplorerUrl: 'https://basescan.org',
  currencySymbol: 'ETH',
  defaultGasPrice: 0.2,
  gasLimitBuffer: 1.2,
  defaultGasLimit: 200000,
  ethPriceUSD: 3000,
  frameVersion: 'vNext'
};
