import { useEffect, useState } from "react";

interface FrameContext {
  user?: {
    fid: string;
    username?: string;
  };
  client?: {
    clientFid: string;
  };
}

export const useFrame = () => {
  const [frameSdk, setFrameSdk] = useState<any>(null);
  const [frameContext, setFrameContext] = useState<FrameContext | null>(null);
  const [isMiniApp, setIsMiniApp] = useState(false);

  useEffect(() => {
    const initFrame = async () => {
      if (typeof window === "undefined") return;

      // Check for Warpcast MiniApp
      if (window.farcasterMiniApp) {
        setIsMiniApp(true);
        try {
          await window.farcasterMiniApp.ready();
          const context = await window.farcasterMiniApp.getContext();
          setFrameContext(context);
        } catch (error) {
          console.error("MiniApp init error:", error);
        }
        return;
      }

      // Check for Frame SDK
      if (window.FarcasterFrameSDK) {
        try {
          const sdk = new window.FarcasterFrameSDK();
          setFrameSdk(sdk);
          const context = await sdk.getContext();
          setFrameContext(context);
          await sdk.actions.ready();
        } catch (error) {
          console.error("Frame SDK init error:", error);
        }
      }
    };

    initFrame();
  }, []);

  return { 
    isMiniApp, 
    farcaster: window.farcasterMiniApp, 
    frameSdk, 
    frameContext 
  };
};
