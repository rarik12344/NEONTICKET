interface FarcasterMiniApp {
  ready: () => Promise<void>;
  getContext: () => Promise<any>;
  connectWallet: (options: any) => Promise<any>;
  // Добавьте другие методы по мере необходимости
}

declare global {
  interface Window {
    ethereum?: any;
    FarcasterFrameSDK?: any;
    farcasterMiniApp?: FarcasterMiniApp;
  }
}
