import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { Countdown } from '@/components/Countdown';
import { Modal } from '@/components/Modal';
import { useEthPrice } from '@/hooks/useEthPrice';
import { useFrame } from '@/hooks/useFrame';
import { ABI, CONFIG } from '@/config/constants';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { ethPrice } = useEthPrice();
  const { isFrame, frameContext } = useFrame();
  
  // Чтение данных контракта
  const { data: currentRoundIndex } = useContractRead({
    address: CONFIG.CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'currentRoundIndex',
  });

  const { data: roundInfo } = useContractRead({
    address: CONFIG.CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getCurrentRoundInfo',
    watch: true,
  });

  const { data: ticketPrice } = useContractRead({
    address: CONFIG.CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'ticketPriceETH',
  });

  // Подготовка транзакции покупки билетов
  const { config: buyTicketsConfig } = usePrepareContractWrite({
    address: CONFIG.CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'buyTickets',
  });

  const { write: buyTickets } = useContractWrite(buyTicketsConfig);

  // Состояние приложения
  const [activeModal, setActiveModal] = useState<'buy' | 'winners' | 'invite' | 'info' | null>(null);
  const [ticketAmount, setTicketAmount] = useState(1);
  const [notifications, setNotifications] = useState<{id: string, message: string, type: 'success' | 'error'}[]>([]);
  const [currentRound, setCurrentRound] = useState<{
    endTime: number;
    prizePool: bigint;
    participantsCount: number;
  } | null>(null);
  const [userTickets, setUserTickets] = useState(0);
  const [winners, setWinners] = useState<any[]>([]);
  const [winnersLoading, setWinnersLoading] = useState(true);

  // Показ уведомления
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, type === 'error' ? 5000 : 3000);
  };

  // Обновление состояния текущего раунда
  useEffect(() => {
    if (roundInfo) {
      setCurrentRound({
        endTime: Number(roundInfo[1]),
        prizePool: roundInfo[2],
        participantsCount: Number(roundInfo[3]),
      });
    }
  }, [roundInfo]);

  // Загрузка победителей
  useEffect(() => {
    const loadWinners = async () => {
      setWinnersLoading(true);
      try {
        // Заглушка - в реальном приложении нужно загружать с API или The Graph
        setWinners([
          {
            round: currentRoundIndex ? Number(currentRoundIndex) - 1 : 1,
            address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
            prize: 0.5,
            timestamp: Math.floor(Date.now() / 1000) - 86400
          }
        ]);
      } catch (error) {
        console.error('Error loading winners:', error);
      } finally {
        setWinnersLoading(false);
      }
    };

    if (activeModal === 'winners') {
      loadWinners();
    }
  }, [activeModal, currentRoundIndex]);

  // Расчет стоимости билетов
  const calculateTicketCost = () => {
    if (!ticketPrice) return { eth: 0, usd: 0 };
    const costWei = Number(ticketPrice) * ticketAmount;
    const costEth = costWei / 1e18;
    const costUsd = costEth * ethPrice;
    return { eth: costEth, usd: costUsd };
  };

  const ticketCost = calculateTicketCost();

  // Обработчик покупки билетов
  const handleBuyTickets = async () => {
    if (!buyTickets || !ticketPrice) return;

    try {
      await buyTickets({
        args: [ticketAmount],
        value: BigInt(Number(ticketPrice) * ticketAmount),
      });

      showNotification('Tickets purchased successfully!');
      setActiveModal(null);
    } catch (error) {
      console.error('Error buying tickets:', error);
      showNotification('Failed to buy tickets', 'error');
    }
  };

  // Модалка покупки билетов
  const BuyModalContent = () => (
    <>
      <div className="flex justify-center items-center gap-4 my-6">
        <button 
          className="w-12 h-12 bg-neon-purple text-white rounded-xl flex items-center justify-center text-2xl"
          onClick={() => setTicketAmount(prev => Math.max(1, prev - 1))}
        >
          -
        </button>
        <input
          type="number"
          value={ticketAmount}
          min="1"
          max="100"
          onChange={(e) => setTicketAmount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
          className="w-20 bg-black/30 border-2 border-neon-blue text-center py-2 rounded-xl text-xl font-mono"
        />
        <button 
          className="w-12 h-12 bg-neon-purple text-white rounded-xl flex items-center justify-center text-2xl"
          onClick={() => setTicketAmount(prev => Math.min(100, prev + 1))}
        >
          +
        </button>
      </div>

      <div className="flex justify-between items-center bg-black/25 p-3 rounded-xl border border-white/10 text-sm mb-4">
        <span>Total Cost:</span>
        <span>
          {ticketCost.eth.toFixed(6)} ETH (~${ticketCost.usd.toFixed(2)})
        </span>
      </div>

      <div className="text-xs text-neon-blue text-center mb-4 flex items-center justify-center gap-1">
        <span>⛽ Estimated fee:</span>
        <span>~$0.10-$0.50</span>
      </div>

      <button
        onClick={handleBuyTickets}
        disabled={!buyTickets}
        className="w-full bg-neon-blue text-black font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <span>🛒</span>
        <span>Confirm Purchase</span>
      </button>
    </>
  );

  // Модалка победителей
  const WinnersModalContent = () => {
    if (winnersLoading) {
      return (
        <div className="py-8 text-center">
          <div className="animate-spin text-neon-blue text-2xl mb-2">🌀</div>
          <p>Loading winners...</p>
        </div>
      );
    }

    if (winners.length === 0) {
      return (
        <div className="py-8 text-center text-text-secondary">
          No winners yet
        </div>
      );
    }

    return (
      <div className="max-h-[60vh] overflow-y-auto">
        <div className="mb-4 text-center">
          <span className="text-neon-pink">🏆</span>
          <span className="ml-2">Recent Winners</span>
        </div>
        
        {winners.map((winner, index) => (
          <div key={index} className="flex justify-between items-center bg-neon-purple/10 p-3 rounded-xl border border-neon-purple/20 text-sm mb-2">
            <div>
              <div className="font-semibold">Round #{winner.round}</div>
              <div className="text-xs text-text-secondary font-mono">{winner.address}</div>
              <a 
                href={`${CONFIG.BASE_EXPLORER_URL}/address/${winner.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neon-blue inline-flex items-center mt-1"
              >
                <span>🔗</span>
                <span className="ml-1">View on BaseScan</span>
              </a>
            </div>
            <div className="text-right">
              <div className="font-semibold">{winner.prize} ETH</div>
              <div className="text-xs text-text-secondary">
                {new Date(winner.timestamp * 1000).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Модалка приглашения друзей
  const InviteModalContent = () => {
    const referralLink = `https://lotteryneon.vercel.app/?ref=${address?.substring(2, 8) || 'neon'}`;

    const handleCopy = () => {
      navigator.clipboard.writeText(referralLink);
      showNotification('Link copied to clipboard!');
    };

    const shareText = `🎉 Join me in Neon Lottery on Base! 🎉\n\n` +
                     `💰 Win daily ETH prizes with transparent blockchain draws\n` +
                     `⏳ Next draw in: ${currentRound ? (
                       <Countdown endTime={currentRound.endTime} />
                     ) : 'soon'}\n\n` +
                     `Use my referral link to get started:\n${referralLink}\n\n` +
                     `#NeonLottery #BaseNetwork #ETH`;

    return (
      <>
        <p className="text-sm text-text-secondary mb-4">
          Invite friends to participate and earn rewards for active participation!
        </p>

        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          {[
            { name: 'twitter', color: 'bg-[#1DA1F2]', icon: '🐦' },
            { name: 'warpcast', color: 'bg-[#472FFF]', icon: '⚡' },
            { name: 'telegram', color: 'bg-[#0088CC]', icon: '📨' },
            { name: 'whatsapp', color: 'bg-[#25D366]', icon: '📱' },
            { name: 'facebook', color: 'bg-[#1877F2]', icon: '👍' },
            { name: 'reddit', color: 'bg-[#FF5700]', icon: '🤖' },
          ].map((social) => (
            <a
              key={social.name}
              href={`https://${social.name}.com/share?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(referralLink)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${social.color}`}
            >
              {social.icon}
            </a>
          ))}
        </div>

        <div className="flex justify-between items-center bg-black/25 p-3 rounded-xl border border-white/10 text-sm mb-4">
          <span>Your referral link:</span>
          <span className="text-xs font-mono truncate max-w-[180px]">
            {referralLink}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="w-full bg-neon-purple text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 mb-4"
        >
          <span>📋</span>
          <span>Copy Link</span>
        </button>

        <div className="text-xs text-neon-blue text-center">
          <span>ℹ️</span>
          <span className="ml-1">Active participants may qualify for future airdrops!</span>
        </div>
      </>
    );
  };

  // Модалка информации
  const InfoModalContent = () => (
    <div className="space-y-4">
      <div className="p-3 bg-neon-blue/5 rounded-xl border-l-4 border-neon-blue">
        <p className="font-semibold text-neon-blue mb-1">🏆 Daily ETH Lottery</p>
        <p className="text-sm text-text-secondary">
          Participate in our transparent, blockchain-based lottery with daily draws.
        </p>
      </div>

      {[
        {
          icon: '🔗',
          title: 'Blockchain-powered',
          description: 'All draws are executed on-chain with verifiable randomness for complete transparency.'
        },
        {
          icon: '💰',
          title: 'Prize Pool',
          description: 'The displayed pool amount already includes platform commission.'
        },
        {
          icon: '⏳',
          title: 'Draw Schedule',
          description: 'Each round lasts 24 hours with automatic draws.'
        },
        {
          icon: '🎁',
          title: 'Referral Rewards',
          description: 'Active participants who invite friends may qualify for special rewards.'
        },
        {
          icon: '📜',
          title: 'Full History',
          description: 'All winners and transactions are permanently recorded on the blockchain.'
        }
      ].map((item, index) => (
        <div key={index} className="flex gap-3">
          <div className="text-neon-blue text-xl">{item.icon}</div>
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-text-secondary">{item.description}</p>
          </div>
        </div>
      ))}

      <div className="pt-4 mt-4 border-t border-white/10 text-center">
        <p className="font-medium mb-2">Questions?</p>
        <a 
          href="https://warpcast.com/~/channel/neon-lottery"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neon-blue font-medium inline-flex items-center"
        >
          <span>💬</span>
          <span className="ml-1">Join our Warpcast channel</span>
        </a>
      </div>
    </div>
  );

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

      <main className="min-h-screen bg-dark-bg bg-gradient-to-br from-[#0f0f1a] via-[#0f0f1a] to-[#1a1a2e] flex justify-center items-start pt-16 pb-10 px-4">
        {isFrame && (
          <div className="fixed top-3 right-3 bg-neon-pink text-white px-3 py-1 rounded-full text-xs font-semibold z-50 animate-pulse shadow-lg shadow-neon-pink/50">
            Mini App
          </div>
        )}

        {/* Уведомления */}
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`fixed top-5 left-1/2 transform -translate-x-1/2 bg-card-bg px-6 py-3 rounded-xl flex items-center gap-2 z-50 shadow-lg animate-slideIn ${
              notification.type === 'error' 
                ? 'border border-error shadow-error/50' 
                : 'border border-success shadow-success/50'
            }`}
          >
            <span className={notification.type === 'error' ? 'text-error' : 'text-success'}>
              {notification.type === 'error' ? '⚠️' : '✓'}
            </span>
            <span>{notification.message}</span>
          </div>
        ))}

        <div className="w-full max-w-md bg-card-bg rounded-2xl p-6 border border-white/10 backdrop-blur-sm shadow-lg shadow-neon-blue/15">
          <h1 className="text-2xl md:text-3xl font-bold text-neon-blue text-center mb-4 tracking-wide text-shadow-neon-blue">
            ✨ NEON LOTTERY ✨
          </h1>

          {currentRound ? (
            <>
              <Countdown endTime={currentRound.endTime} />
              <p className={`text-sm text-center mb-5 ${
                currentRound.endTime - Math.floor(Date.now() / 1000) < 3600 
                  ? 'text-neon-pink text-shadow-neon-pink' 
                  : 'text-text-secondary'
              }`}>
                {currentRound.endTime > Math.floor(Date.now() / 1000) 
                  ? 'Round Active' 
                  : 'Round Ended - Next round starting'}
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
              <button
                onClick={() => {}} // Wagmi подключится автоматически через WalletButton
                className="w-full bg-neon-green text-black font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 relative overflow-hidden after:content-[''] after:absolute after:-inset-1/2 after:bg-gradient-to-br after:from-transparent after:via-white/30 after:to-transparent after:rotate-30 after:animate-shine"
              >
                <span>🔗</span>
                <span>Connect Wallet</span>
              </button>
            ) : (
              <button 
                className="w-full bg-neon-blue text-black font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 relative overflow-hidden after:content-[''] after:absolute after:-inset-1/2 after:bg-gradient-to-br after:from-transparent after:via-white/30 after:to-transparent after:rotate-30 after:animate-shine"
                onClick={() => setActiveModal('buy')}
              >
                <span>🎫</span>
                <span>Buy Tickets</span>
              </button>
            )}

            <button 
              className="w-full bg-neon-pink text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2"
              onClick={() => setActiveModal('winners')}
            >
              <span>🏆</span>
              <span>View Winners</span>
            </button>

            <button 
              className="w-full bg-neon-purple text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2"
              onClick={() => setActiveModal('invite')}
            >
              <span>👥</span>
              <span>Invite Friends</span>
            </button>

            <button 
              className="w-full bg-white/10 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2"
              onClick={() => setActiveModal('info')}
            >
              <span>ℹ️</span>
              <span>How It Works</span>
            </button>
          </div>
        </div>

        {/* Модальные окна */}
        <Modal isOpen={activeModal === 'buy'} onClose={() => setActiveModal(null)} title="🎟️ Buy Tickets">
          <BuyModalContent />
        </Modal>

        <Modal isOpen={activeModal === 'winners'} onClose={() => setActiveModal(null)} title="🏆 Previous Winners">
          <WinnersModalContent />
        </Modal>

        <Modal isOpen={activeModal === 'invite'} onClose={() => setActiveModal(null)} title="👥 Invite Friends">
          <InviteModalContent />
        </Modal>

        <Modal isOpen={activeModal === 'info'} onClose={() => setActiveModal(null)} title="ℹ️ How It Works">
          <InfoModalContent />
        </Modal>
      </main>
    </>
  );
}
