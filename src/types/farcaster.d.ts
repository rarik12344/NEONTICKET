export interface FarcasterMiniApp {
  ready: () => Promise<void>;
  getContext: () => Promise<FarcasterContext>;
  connectWallet: (options: { chainId: string; rpcUrl: string }) => Promise<{ address: string }>;
  showNotification: (options: { type: string; message: string }) => void;
}

export interface FarcasterContext {
  user?: {
    fid: string;
    username?: string;
    displayName?: string;
  };
  client?: {
    clientFid: string;
  };
}

declare global {
  interface Window {
    FarcasterFrameSDK?: {
      new (): any;
      getContext: () => Promise<FarcasterContext>;
      actions: {
        ready: () => Promise<void>;
      };
    };
    farcasterMiniApp?: FarcasterMiniApp;
  }
}
