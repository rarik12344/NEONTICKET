import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { CONFIG } from '../config';
import { useContract } from '../hooks/useContract';
import { useEthPrice } from '../hooks/useEthPrice';
import { useFrame } from '../hooks/useFrame';
import Countdown from '../components/Countdown';
import LotteryInfo from '../components/LotteryInfo';
import Modal from '../components/Modal';
import Notification from '../components/Notification';
import WalletButton from '../components/WalletButton';

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState<any>(null);
  const [userTickets, setUserTickets] = useState(0);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showWinnersModal, setShowWinnersModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [ticketAmount, setTicketAmount] = useState(1);
  const [notification, setNotification] = useState<{message: string, type: string} | null>(null);

  const { ethPrice } = useEthPrice();
  const { contract, web3 } = useContract();
  const { isMiniApp, farcaster, frameSdk, frameContext } = useFrame();

  useEffect(() => {
    if (contract && web3) {
      updateRoundInfo();
      const interval = setInterval(updateRoundInfo, 10000);
      return () => clearInterval(interval);
    }
  }, [contract, web3, account]);

  const updateRoundInfo = async () => {
    try {
      const roundInfo = await contract.getCurrentRoundInfo();
      setCurrentRound({
        endTime: parseInt(roundInfo.endTime),
        prizePool: roundInfo.prizePool,
        participantsCount: parseInt(roundInfo.participantsCount)
      });

      if (account) {
        const currentRoundIndex = await contract.currentRoundIndex();
        const round = await contract.rounds(currentRoundIndex);
        const participantsCount = parseInt(round.participantsCount);
        
        let tickets = 0;
        for (let i = 0; i < participantsCount; i++) {
          const participant = await contract.getParticipantInfo(currentRoundIndex, i);
          if (participant.wallet.toLowerCase() === account.toLowerCase()) {
            tickets += parseInt(participant.tickets);
          }
        }
        setUserTickets(tickets);
      }
    } catch (error) {
      console.error("Error updating round info:", error);
    }
  };

  const connectWallet = async () => {
    try {
      if (isMiniApp && farcaster) {
        const wallet = await farcaster.connectWallet({
          chainId: CONFIG.baseChainId,
          rpcUrl: CONFIG.baseRpcUrl
        });
        setAccount(wallet.address);
        showNotification("Warpcast wallet connected!", "success");
      } else if (frameSdk) {
        const accounts = await frameSdk.wallet.ethProvider.request({
          method: 'eth_requestAccounts'
        });
        setAccount(accounts[0]);
        showNotification("Wallet connected via Frame", "success");
      } else if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        showNotification("Wallet connected successfully", "success");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      showNotification("Failed to connect wallet", "error");
    }
  };

  const confirmPurchase = async () => {
    try {
      const ticketPriceWei = await contract.ticketPriceETH();
      const costWei = ticketPriceWei * ticketAmount;
      
      if (frameSdk) {
        const txHash = await frameSdk.wallet.ethProvider.request({
          method: 'eth_sendTransaction',
          params: [{
            to: CONFIG.contractAddress,
            value: costWei.toString(),
            data: contract.interface.encodeFunctionData("buyTickets", [ticketAmount]),
            chainId: parseInt(CONFIG.baseChainId, 16)
          }]
        });
        showNotification(`Transaction sent: ${txHash.slice(0, 10)}...`, "success");
      } else if (isMiniApp && farcaster) {
        const txHash = await farcaster.sendTransaction({
          to: CONFIG.contractAddress,
          value: costWei.toString(),
          data: contract.interface.encodeFunctionData("buyTickets", [ticketAmount]),
          chainId: CONFIG.baseChainId
        });
        showNotification(`Transaction sent: ${txHash.slice(0, 10)}...`, "success");
      } else if (window.ethereum) {
        const tx = await contract.buyTickets(ticketAmount, {
          value: costWei.toString()
        });
        showNotification(`🎉 ${ticketAmount} ticket${ticketAmount > 1 ? 's' : ''} purchased!`, "success");
      }
      
      setShowBuyModal(false);
      updateRoundInfo();
    } catch (error) {
      console.error("Error buying tickets:", error);
      showNotification("Failed to buy tickets", "error");
    }
  };

  const showNotification = (message: string, type: string) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), type === 'error' ? 5000 : 3000);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>✨ Neon Lottery | Daily ETH Draws on Base</title>
        <meta name="description" content="Win ETH daily! Transparent blockchain lottery on Base Network" />
        <meta property="og:title" content="Neon Lottery | Daily ETH Draws" />
        <meta property="og:description" content="Win ETH daily on Base Network" />
        <meta property="og:image" content="/images/ogneon.jpg" />
        
        {/* Farcaster Frame Meta Tags */}
        <meta name="fc:frame" content={JSON.stringify({
          version: "next",
          imageUrl: "https://yourdomain.com/images/ogneon.jpg",
          button: {
            title: "🎫 Buy ticket",
            action: {
              type: "launch_frame",
              name: "Neon Lottery",
              url: "https://yourdomain.com/",
              splashImageUrl: "https://yourdomain.com/images/splashscreen.jpg",
              splashBackgroundColor: "#0f0f1a"
            }
          }
        })} />
      </Head>

      {isMiniApp && <div className={styles.miniappBadge}>✨ Warpcast Mode</div>}

      <main className={styles.main}>
        <h1 className={styles.title}>✨ NEON LOTTERY ✨</h1>

        <Countdown endTime={currentRound?.endTime} />
        
        <LotteryInfo 
          currentPool={currentRound?.prizePool} 
          userTickets={userTickets} 
          account={account}
          ethPrice={ethPrice}
        />

        <WalletButton 
          account={account} 
          connectWallet={connectWallet} 
          isMiniApp={isMiniApp}
        />

        <div className={styles.buttonGroup}>
          <button 
            className={`${styles.button} ${styles.primaryButton}`}
            onClick={() => setShowBuyModal(true)}
            disabled={!account}
          >
            <i className="fas fa-ticket-alt"></i> Buy Tickets
          </button>

          <button 
            className={`${styles.button} ${styles.pinkButton}`}
            onClick={() => setShowWinnersModal(true)}
          >
            <i className="fas fa-trophy"></i> View Winners
          </button>

          <button 
            className={`${styles.button} ${styles.purpleButton}`}
            onClick={() => setShowInviteModal(true)}
          >
            <i className="fas fa-user-plus"></i> Invite Friends
          </button>

          <button 
            className={styles.button}
            onClick={() => setShowInfoModal(true)}
          >
            <i className="fas fa-info-circle"></i> How It Works
          </button>
        </div>
      </main>

      {/* Modals */}
      <Modal show={showBuyModal} onClose={() => setShowBuyModal(false)} title="Buy Tickets">
        <div className={styles.ticketInput}>
          <button onClick={() => setTicketAmount(Math.max(1, ticketAmount - 1))}>-</button>
          <input 
            type="number" 
            value={ticketAmount} 
            onChange={(e) => setTicketAmount(parseInt(e.target.value) || 1)}
            min="1" 
            max="100" 
          />
          <button onClick={() => setTicketAmount(Math.min(100, ticketAmount + 1))}>+</button>
        </div>
        
        <div className={styles.infoItem}>
          <span>Total Cost:</span>
          <span>{((ticketAmount * 0.0005).toFixed(6)} ETH</span>
        </div>
        
        <button 
          className={`${styles.button} ${styles.primaryButton}`}
          onClick={confirmPurchase}
        >
          <i className="fas fa-shopping-cart"></i> Confirm Purchase
        </button>
      </Modal>

      {/* Notification */}
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </div>
  );
}
