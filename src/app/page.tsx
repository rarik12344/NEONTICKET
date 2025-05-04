import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useAccount, useReadContracts, useWriteContract } from 'wagmi';
import { Address } from 'viem';
import { Countdown } from '@/components/Countdown';
import { Modal } from '@/components/Modal';
import { ABI, CONFIG } from '@/config/constants';
import { toast } from 'react-hot-toast';

type RoundInfo = {
  startTime: bigint;
  endTime: bigint;
  prizePool: bigint;
  participantsCount: bigint;
  active: boolean;
  canceled: boolean;
  winner: Address;
  prizeAmount: bigint;
};

declare global {
  interface Window {
    FarcasterFrame?: {
      postMessage: (msg: string) => void;
      on: (event: string, callback: (msg: string) => void) => void;
    };
    ReactNativeWebView?: {
      postMessage: (msg: string) => void;
    };
  }
}

export default function Home() {
  const { isConnected } = useAccount();
  const { writeContract } = useWriteContract();
  
  const [isFrame, setIsFrame] = useState(false);
  const [isMiniApp, setIsMiniApp] = useState(false);
  const [frameMessage, setFrameMessage] = useState('');

  // Detect environment
  useEffect(() => {
    setIsFrame(window.location !== window.parent.location);
    setIsMiniApp(navigator.userAgent.includes('Warpcast'));
    
    if (window.FarcasterFrame) {
      window.FarcasterFrame.on('message', setFrameMessage);
    }
  }, []);

  // Contract data
  const { data: contractData } = useReadContracts({
    contracts: [
      {
        address: CONFIG.CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'currentRoundIndex',
      },
      {
        address: CONFIG.CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'ticketPriceETH',
      },
      {
        address: CONFIG.CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'getCurrentRoundInfo',
      },
    ],
    watch: true,
  });

  const [currentRoundIndex, ticketPrice, roundInfo] = contractData || [];
  const parsedRoundInfo = roundInfo?.result as unknown as RoundInfo;

  // UI state
  const [activeModal, setActiveModal] = useState<'buy' | null>(null);
  const [ticketAmount, setTicketAmount] = useState(1);

  // Handle ticket purchase
  const handleBuyTickets = async () => {
    if (!ticketPrice?.result) return;

    const toastId = toast.loading('Processing transaction...');
    try {
      await writeContract({
        address: CONFIG.CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'buyTickets',
        args: [BigInt(ticketAmount)],
        value: BigInt(ticketAmount) * BigInt(ticketPrice.result as bigint),
      });

      toast.success('Tickets purchased successfully!', { id: toastId });
      
      // Notify frame/mini-app
      const message = { type: 'tx_success' };
      window.FarcasterFrame?.postMessage(JSON.stringify(message));
      window.ReactNativeWebView?.postMessage(JSON.stringify(message));
    } catch (error) {
      console.error('Error buying tickets:', error);
      toast.error('Failed to buy tickets', { id: toastId });
      
      const message = { type: 'tx_failed', error: error.message };
      window.FarcasterFrame?.postMessage(JSON.stringify(message));
      window.ReactNativeWebView?.postMessage(JSON.stringify(message));
    }
  };

  // Handle frame/mini-app actions
  const handleFrameAction = () => {
    if (isConnected) {
      setActiveModal('buy');
    } else {
      const message = { type: 'connect_wallet' };
      window.FarcasterFrame?.postMessage(JSON.stringify(message));
      window.ReactNativeWebView?.postMessage(JSON.stringify(message));
    }
  };

  // Meta tags configuration
  const frameMetaTags = {
    'fc:frame': 'vNext',
    'fc:frame:image': `${CONFIG.FRAME_IMAGE_URL}?t=${Date.now()}`,
    'fc:frame:post_url': `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame`,
    'fc:frame:button:1': '🎟️ Buy Ticket',
    'fc:frame:button:1:action': 'tx',
    'fc:frame:button:1:target': `${process.env.NEXT_PUBLIC_BASE_URL}/api/tx`,
    'fc:frame:button:2': '🏆 Winners',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': `${process.env.NEXT_PUBLIC_BASE_URL}/winners`,
    'og:image': CONFIG.FRAME_IMAGE_URL,
    'og:title': 'Neon Lottery on Base',
    'og:description': 'Win daily ETH prizes with transparent blockchain draws',
  };

  const miniAppMetaTags = {
    'mini-app:title': 'Neon Lottery',
    'mini-app:icon': CONFIG.MINI_APP_ICON,
    'mini-app:description': 'Win daily ETH prizes',
    'mini-app:button:1:text': 'Buy Ticket',
    'mini-app:button:1:action': 'tx',
    'mini-app:button:1:post_url': `${process.env.NEXT_PUBLIC_BASE_URL}/api/tx`,
  };

  // Render different UIs based on context
  const renderContent = () => {
    if (isMiniApp) {
      return (
        <div className="p-4 mini-app-ui">
          <div className="text-center mb-4">
            {parsedRoundInfo && (
              <>
                <Countdown targetDate={new Date(Number(parsedRoundInfo.endTime) * 1000)} />
                <p className="text-lg">Prize: {(Number(parsedRoundInfo.prizePool) / 1e18).toFixed(2)} ETH</p>
              </>
            )}
          </div>
          <button
            onClick={handleFrameAction}
            className="w-full bg-neon-blue text-black py-3 px-4 rounded-xl font-bold"
          >
            {isConnected ? '🎟️ Buy Ticket' : 'Connect Wallet'}
          </button>
        </div>
      );
    }

    if (isFrame) {
      return (
        <div className="p-4 frame-ui">
          <img 
            src={CONFIG.FRAME_IMAGE_URL} 
            alt="Neon Lottery" 
            className="w-full rounded-lg mb-4"
          />
          <div className="text-center mb-4">
            {parsedRoundInfo && (
              <>
                <Countdown targetDate={new Date(Number(parsedRoundInfo.endTime) * 1000)} />
                <p className="text-lg">Prize: {(Number(parsedRoundInfo.prizePool) / 1e18).toFixed(2)} ETH</p>
              </>
            )}
          </div>
          <button
            onClick={handleFrameAction}
            className="w-full bg-neon-blue text-black py-3 px-4 rounded-xl font-bold"
          >
            {isConnected ? '🎟️ Buy Ticket' : 'Connect Wallet'}
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-md mx-auto p-6 web-ui">
        <h1 className="text-3xl font-bold text-neon-blue text-center mb-6">
          ✨ NEON LOTTERY ✨
        </h1>

        {parsedRoundInfo && (
          <>
            <Countdown targetDate={new Date(Number(parsedRoundInfo.endTime) * 1000)} />
            <div className="grid grid-cols-2 gap-4 my-6">
              <div className="bg-black/25 p-3 rounded-xl">
                <div className="text-sm text-text-secondary">Prize Pool</div>
                <div className="text-lg">{(Number(parsedRoundInfo.prizePool) / 1e18).toFixed(2)} ETH</div>
              </div>
              <div className="bg-black/25 p-3 rounded-xl">
                <div className="text-sm text-text-secondary">Participants</div>
                <div className="text-lg">{Number(parsedRoundInfo.participantsCount)}</div>
              </div>
            </div>
          </>
        )}

        <button 
          onClick={() => setActiveModal('buy')}
          className="w-full bg-neon-blue text-black py-3 px-4 rounded-xl font-bold"
        >
          Buy Tickets
        </button>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Neon Lottery | Daily ETH Draws on Base</title>
        <meta name="description" content="Transparent blockchain lottery with daily ETH prizes" />
        
        {/* Standard OpenGraph */}
        <meta property="og:title" content="Neon Lottery | Daily ETH Draws on Base" />
        <meta property="og:description" content="Win ETH daily with transparent blockchain draws" />
        <meta property="og:image" content={CONFIG.FRAME_IMAGE_URL} />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_BASE_URL} />
        
        {/* Farcaster Frame Tags */}
        {Object.entries(frameMetaTags).map(([key, value]) => (
          <meta key={key} property={key} content={value} />
        ))}
        
        {/* Warpcast MiniApp Tags */}
        {Object.entries(miniAppMetaTags).map(([key, value]) => (
          <meta key={key} name={key} content={value} />
        ))}
      </Head>

      <main className={`min-h-screen ${isFrame || isMiniApp ? 'bg-transparent' : 'bg-dark-bg'}`}>
        {renderContent()}
        
        {/* Purchase Modal */}
        <Modal isOpen={activeModal === 'buy'} onClose={() => setActiveModal(null)}>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Buy Tickets</h2>
            <div className="flex justify-center items-center gap-4 my-6">
              <button 
                onClick={() => setTicketAmount(prev => Math.max(1, prev - 1))}
                className="w-12 h-12 bg-neon-purple text-white rounded-xl"
              >
                -
              </button>
              <span className="text-2xl">{ticketAmount}</span>
              <button 
                onClick={() => setTicketAmount(prev => prev + 1)}
                className="w-12 h-12 bg-neon-purple text-white rounded-xl"
              >
                +
              </button>
            </div>
            <button
              onClick={handleBuyTickets}
              className="w-full bg-neon-blue text-black py-3 px-4 rounded-xl font-bold"
            >
              Confirm Purchase
            </button>
          </div>
        </Modal>
      </main>
    </>
  );
}
