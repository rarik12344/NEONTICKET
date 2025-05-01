import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider & {
      isMetaMask?: boolean;
      isConnected?: () => boolean;
      request?: (request: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}
