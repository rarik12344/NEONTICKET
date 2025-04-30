import { useEffect, useState } from "react";
import { FarcasterFrameSDK } from "@farcaster/frame-sdk";

export const useFrame = () => {
  const [frameSdk, setFrameSdk] = useState<FarcasterFrameSDK | null>(null);
  const [frameContext, setFrameContext] = useState<any>(null);
  const [isMiniApp, setIsMiniApp] = useState(false);

  useEffect(() => {
    const initFrame = async () => {
      if (typeof window !== "undefined") {
        // Check for Warpcast MiniApp
        if (window.farcasterMiniApp) {
          setIsMiniApp(true);
          try {
            await window.farcasterMiniApp.ready();
            setFrameContext(await window.farcasterMiniApp.getContext());
          } catch (error) {
            console.error("MiniApp init error:", error);
          }
        }
        // Check for Frame SDK
        else if (window.FarcasterFrameSDK) {
          const sdk = new window.FarcasterFrameSDK();
          setFrameSdk(sdk);
          try {
            setFrameContext(await sdk.getContext());
            await sdk.actions.ready();
          } catch (error) {
            console.error("Frame SDK init error:", error);
          }
        }
      }
    };

    initFrame();
  }, []);

  return { isMiniApp, farcaster: window.farcasterMiniApp, frameSdk, frameContext };
};
