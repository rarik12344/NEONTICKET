import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useAccount, useReadContracts, useWriteContract } from 'wagmi';
import { Address } from 'viem';
import { Countdown } from '@/components/Countdown';
import { Modal } from '@/components/Modal';
import { useEthPrice } from '@/hooks/useEthPrice';
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

export default function Home() {
  const { address, isConnected, chainId } = useAccount();
  const { ethPrice } = useEthPrice();
  const { writeContract } = useWriteContract();
  
  // Detect frame context
  const [isFrame, setIsFrame] = useState(false);
  const [frameMessage, setFrameMessage] = useState('');

  useEffect(() => {
    setIsFrame(window.location !== window.parent.location);
    if (window.FarcasterFrame) {
      window.FarcasterFrame.on('message', (msg: string) => {
        setFrameMessage(msg);
      });
    }
  }, []);

  // Чтение данных контракта
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

  // Состояние приложения
  const [activeModal, setActiveModal] = useState<'buy' | null>(null);
  const [ticketAmount, setTicketAmount] = useState(1);

  // Обработчик покупки билетов
  const handleBuyTickets = async () => {
    if (!ticketPrice?.result) return;

    const toastId = toast.loading('Processing transaction...');
    try {
      await writeContract({
        address: CONFIG.CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'buyTickets',
        args: [BigInt(ticketAmount)],
        value: BigInt(Number(ticketPrice.result) * ticketAmount),
      });
      toast.success('Tickets purchased successfully!', { id: toastId });
      
      // For frames - send success message
      if (isFrame && window.FarcasterFrame) {
        window.FarcasterFrame.postMessage('tx_success');
      }
    } catch (error) {
      console.error('Error buying tickets:', error);
      toast.error('Failed to buy tickets', { id: toastId });
      
      if (isFrame && window.FarcasterFrame) {
        window.FarcasterFrame.postMessage('tx_failed');
      }
    }
  };

  // Frame button handler
  const handleFrameAction = () => {
    if (isConnected) {
      setActiveModal('buy');
    } else if (isFrame) {
      window.FarcasterFrame.postMessage('connect_wallet');
    }
  };

  // Meta tags for frame embedding
  const frameMetaTags = {
    'fc:frame': 'vNext',
    'fc:frame:image': CONFIG.FRAME_IMAGE_URL,
    'fc:frame:post_url': `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame`,
    'fc:frame:button:1': '🎟️ Buy Ticket',
    'fc:frame:button:1:action': 'tx',
    'fc:frame:button:1:target': `${process.env.NEXT_PUBLIC_BASE_URL}/api/tx`,
    'fc:frame:button:2': '🏆 View Winners',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': `${process.env.NEXT_PUBLIC_BASE_URL}/winners`,
    'fc:frame:button:3': 'ℹ️ How It Works',
    'fc:frame:button:3:action': 'post',
    'og:image': CONFIG.FRAME_IMAGE_URL,
    'og:title': 'Neon Lottery on Base',
    'og:description': 'Win daily ETH prizes with transparent blockchain draws',
  };

  return (
    <>
      <Head>
        <title>Neon Lottery | Daily ETH Draws on Base</title>
        <meta name="description" content="Transparent blockchain lottery with daily ETH prizes" />
        
        {/* Standard OpenGraph tags */}
        <meta property="og:title" content="Neon Lottery | Daily ETH Draws on Base" />
        <meta property="og:description" content="Win ETH daily with transparent blockchain draws" />
        <meta property="og:image" content={CONFIG.FRAME_IMAGE_URL} />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_BASE_URL} />
        
        {/* Farcaster Frame meta tags */}
        {Object.entries(frameMetaTags).map(([key, value]) => (
          <meta key={key} property={key} content={value} />
        ))}

        {/* Warpcast MiniApp 2025 tags */}
        <meta name="mini-app:title" content="Neon Lottery" />
        <meta name="mini-app:icon" content={CONFIG.FRAME_IMAGE_URL} />
        <meta name="mini-app:description" content="Win daily ETH prizes" />
        <meta name="mini-app:url" content={process.env.NEXT_PUBLIC_BASE_URL} />
        <meta name="mini-app:button:1:text" content="Buy Ticket" />
        <meta name="mini-app:button:1:action" content="tx" />
      </Head>

      <main className={`min-h-screen ${isFrame ? 'bg-transparent' : 'bg-dark-bg'}`}>
        {/* Frame-specific UI */}
        {isFrame ? (
          <div className="p-4">
            <div className="mb-4">
              <img 
                src={CONFIG.FRAME_IMAGE_URL} 
                alt="Neon Lottery" 
                className="w-full rounded-lg"
              />
            </div>
            
            <div className="text-center mb-4">
              <Countdown 
                targetDate={parsedRoundInfo ? 
                  new Date(Number(parsedRoundInfo.endTime) * 1000) : 
                  null} 
              />
              <p className="text-lg">
                Prize: {parsedRoundInfo ? 
                  `${(Number(parsedRoundInfo.prizePool) / 1e18} ETH` : 
                  'Loading...'}
              </p>
            </div>

            <button
              onClick={handleFrameAction}
              className="w-full bg-neon-blue text-black py-3 px-4 rounded-xl font-bold"
            >
              {isConnected ? '🎟️ Buy Ticket' : 'Connect Wallet'}
            </button>
          </div>
        ) : (
          {/* Regular browser UI */}
          <div className="max-w-md mx-auto p-6">
            <h1 className="text-3xl font-bold text-neon-blue text-center mb-6">
              ✨ NEON LOTTERY ✨
            </h1>

            {parsedRoundInfo && (
              <>
                <Countdown 
                  targetDate={new Date(Number(parsedRoundInfo.endTime) * 1000)} 
                />
                <div className="grid grid-cols-2 gap-4 my-6">
                  <div className="bg-black/25 p-3 rounded-xl">
                    <div className="text-sm text-text-secondary">Prize Pool</div>
                    <div className="text-lg">
                      {(Number(parsedRoundInfo.prizePool) / 1e18} ETH
                    </div>
                  </div>
                  <div className="bg-black/25 p-3 rounded-xl">
                    <div className="text-sm text-text-secondary">Participants</div>
                    <div className="text-lg">
                      {Number(parsedRoundInfo.participantsCount)}
                    </div>
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
        )}

        {/* Buy Tickets Modal */}
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
