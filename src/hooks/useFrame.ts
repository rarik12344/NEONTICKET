import { useEffect, useState } from 'react';
import { FarcasterContext, FarcasterMiniApp } from '../types/farcaster';

export const useFrame = () => {
  const [frameSdk, setFrameSdk] = useState<any>(null);
  const [frameContext, setFrameContext] = useState<FarcasterContext | null>(null);
  const [isMiniApp, setIsMiniApp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initFrame = async () => {
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      try {
        // Type-safe access to window properties
        const farcaster = (window as any).farcasterMiniApp as FarcasterMiniApp | undefined;
        const FrameSDK = (window as any).FarcasterFrameSDK;

        if (farcaster) {
          setIsMiniApp(true);
          await farcaster.ready();
          const context = await farcaster.getContext();
          setFrameContext(context);
        } else if (FrameSDK) {
          const sdk = new FrameSDK();
          setFrameSdk(sdk);
          const context = await sdk.getContext();
          setFrameContext(context);
          await sdk.actions.ready();
        }
      } catch (error) {
        console.error('Frame initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initFrame();
  }, []);

  return {
    isMiniApp,
    farcaster: (window as any).farcasterMiniApp as FarcasterMiniApp | undefined,
    frameSdk,
    frameContext,
    isLoading
  };
};
