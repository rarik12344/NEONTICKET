import { useEffect, useState } from 'react';

declare global {
  interface Window {
    FarcasterFrameSDK?: any;
    farcasterMiniApp?: any;
  }
}

export const useFrame = () => {
  const [isFrame, setIsFrame] = useState(false);
  const [frameContext, setFrameContext] = useState<any>(null);

  useEffect(() => {
    // Check if running in Warpcast MiniApp
    if (window.farcasterMiniApp) {
      setIsFrame(true);
      window.farcasterMiniApp.ready().then(() => {
        setFrameContext(window.farcasterMiniApp.getContext());
      });
    } 
    // Check if running in Frame
    else if (window.FarcasterFrameSDK) {
      setIsFrame(true);
      const sdk = new window.FarcasterFrameSDK();
      sdk.getContext().then((ctx: any) => {
        setFrameContext(ctx);
        sdk.actions.ready();
      });
    }

    // Handle frame actions from URL params
    const params = new URLSearchParams(window.location.search);
    if (params.get('frameAction') === 'buy') {
      // Trigger buy action
    }
  }, []);

  return { isFrame, frameContext };
};
