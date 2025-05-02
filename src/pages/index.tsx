import Head from 'next/head';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Countdown } from '@/components/Countdown';
import { Modal } from '@/components/Modal';
import { useLotteryContract } from '@/hooks/useContract';
import { useEthPrice } from '@/hooks/useEthPrice';
import { useFrame } from '@/hooks/useFrame';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { ethPrice } = useEthPrice();
  const { isFrame, frameContext } = useFrame();
  
  const {
    currentRound,
    ticketPrice,
    userTickets,
    buyTickets,
  } = useLotteryContract();

  const [activeModal, setActiveModal] = useState<'buy' | 'winners' | 'invite' | 'info' | null>(null);
  const [ticketAmount, setTicketAmount] = useState(1);

  // Расчет стоимости билетов
  const calculateTicketCost = () => {
    if (!ticketPrice) return { eth: 0, usd: 0 };
    const costWei = Number(ticketPrice) * ticketAmount;
    const costEth = costWei / 1e18;
    const costUsd = costEth * ethPrice;
    return { eth: costEth, usd: costUsd };
  };

  const ticketCost = calculateTicketCost();

  return (
    <>
      <Head>
        <title>✨ Neon Lottery | Daily ETH Draws on Base</title>
        <meta name="description" content="Win ETH daily! Transparent blockchain lottery on Base Network with instant payouts" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lotteryneon.vercel.app/" />
        <meta property="og:title" content="✨ Neon Lottery | Daily ETH Draws on Base" />
        <meta property="og:description" content="Win ETH daily! Transparent blockchain lottery on Base Network with instant payouts" />
        <meta property="og:image" content="https://i.ibb.co/HfcPqDfC/ogneon.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://lotteryneon.vercel.app/" />
        <meta property="twitter:title" content="✨ Neon Lottery | Daily ETH Draws on Base" />
        <meta property="twitter:description" content="Win ETH daily! Transparent blockchain lottery on Base Network with instant payouts" />
        <meta property="twitter:image" content="https://i.ibb.co/HfcPqDfC/ogneon.jpg" />

        {/* Farcaster Frame Meta Tags */}
        <meta name="fc:frame" content={JSON.stringify({
          version: 'next',
          imageUrl: 'https://i.ibb.co/HfcPqDfC/ogneon.jpg',
          button: {
            title: '🎫 Buy ticket',
            action: {
              type: 'launch_frame',
              name: 'Neon Lottery',
              url: 'https://lotteryneon.vercel.app/',
              splashImageUrl: 'https://i.ibb.co/hJdsnrjV/splashscreen.jpg',
              splashBackgroundColor: '#0f0f1a'
            }
          }
        })} />
      </Head>

      <main className="min-h-screen bg-dark-bg bg-gradient-neon flex justify-center items-start pt-16 pb-10 px-4">
        {isFrame && (
          <div className="fixed top-3 right-3 bg-neon-pink text-white px-3 py-1 rounded-full text-xs font-semibold z-50 animate-pulse shadow-neon-pink">
            Mini App
          </div>
        )}

        <div className="w-full max-w-md bg-card-bg rounded-2xl p-6 border border-white/10 backdrop-blur-lg shadow-lg shadow-neon-blue/15">
          <h1 className="text-2xl md:text-3xl font-bold text-neon-blue text-center mb-4 text-shadow-neon-blue tracking-wide">
            ✨ NEON LOTTERY ✨
          </h1>

          {currentRound ? (
            <>
              <Countdown endTime={currentRound.endTime} />
              <p className="text-sm text-center mb-5">
                {currentRound.endTime > Date.now() / 1000 ? 'Round Active' : 'Round Ended'}
              </p>
            </>
          ) : (
            <div className="text-center py-8">Loading round info...</div>
          )}

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center bg-black/25 p-3 rounded-xl border border-white/10 text-sm">
              <span className="text-text-secondary flex items-center gap-1">
                <span>🎟️ Ticket Price:</span>
              </span>
              <span>
                {ticketPrice ? `${(Number(ticketPrice) / 1e18).toFixed(6)} ETH` : 'Loading...'}
              </span>
            </div>

            <div className="flex justify-between items-center bg-black/25 p-3 rounded-xl border border-white/10 text-sm">
              <span className="text-text-secondary flex items-center gap-1">
                <span>💰 Current Pool:</span>
              </span>
              <span>
                {currentRound?.prizePool ? `${(Number(currentRound.prizePool) / 1e18).toFixed(4)} ETH` : 'Loading...'}
              </span>
            </div>

            {isConnected && (
              <div className="flex justify-between items-center bg-black/25 p-3 rounded-xl border border-white/10 text-sm">
                <span className="text-text-secondary flex items-center gap-1">
                  <span>👤 Your Tickets:</span>
                </span>
                <span>{userTickets}</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {!isConnected ? (
              <button className="w-full bg-neon-green text-black font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 relative overflow-hidden after:content-[""] after:absolute after:-inset-1/2 after:bg-gradient-to-br after:from-transparent after:via-white/30 after:to-transparent after:rotate-30 after:animate-shine">
                <span>🔗 Connect Wallet</span>
              </button>
            ) : (
              <button 
                className="w-full bg-neon-blue text-black font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 relative overflow-hidden after:content-[""] after:absolute after:-inset-1/2 after:bg-gradient-to-br after:from-transparent after:via-white/30 after:to-transparent after:rotate-30 after:animate-shine"
                onClick={() => setActiveModal('buy')}
              >
                <span>🎫 Buy Tickets</span>
              </button>
            )}

            <button 
              className="w-full bg-neon-pink text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2"
              onClick={() => setActiveModal('winners')}
            >
              <span>🏆 View Winners</span>
            </button>

            <button 
              className="w-full bg-neon-purple text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2"
              onClick={() => setActiveModal('invite')}
            >
              <span>👥 Invite Friends</span>
            </button>

            <button 
              className="w-full bg-white/10 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2"
              onClick={() => setActiveModal('info')}
            >
              <span>ℹ️ How It Works</span>
            </button>
          </div>
        </div>

        {/* Модальные окна */}
        <Modal isOpen={activeModal === 'buy'} onClose={() => setActiveModal(null)} title="🎟️ Buy Tickets">
          {/* Реализация модалки покупки билетов */}
        </Modal>

        <Modal isOpen={activeModal === 'winners'} onClose={() => setActiveModal(null)} title="🏆 Previous Winners">
          {/* Реализация модалки с победителями */}
        </Modal>

        <Modal isOpen={activeModal === 'invite'} onClose={() => setActiveModal(null)} title="👥 Invite Friends">
          {/* Реализация модалки приглашения друзей */}
        </Modal>

        <Modal isOpen={activeModal === 'info'} onClose={() => setActiveModal(null)} title="ℹ️ How It Works">
          {/* Реализация модалки с информацией */}
        </Modal>
      </main>
    </>
  );
}
