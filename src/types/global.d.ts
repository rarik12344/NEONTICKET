import { MetaMaskInpageProvider } from "@metamask/providers";
import { FarcasterFrameSDK } from "@farcaster/frame-sdk";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
    FarcasterFrameSDK?: typeof FarcasterFrameSDK;
  }
}
