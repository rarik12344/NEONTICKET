import { useEffect, useState } from 'react';
import Head from 'next/head';
import { ethers } from 'ethers';
import { CONFIG } from '../config';
import styles from '../styles/Home.module.css';

declare global {
  interface Window {
    farcasterMiniApp?: any;
    FarcasterFrameSDK?: new () => any;
    ethereum?: any;
  }
}

export default function Home() {
  const [web3, setWeb3] = useState<ethers.providers.Web3Provider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isMiniApp, setIsMiniApp] = useState(false);
  const [frameSdk, setFrameSdk] = useState<any>(null);
  const [currentRound, setCurrentRound] = useState<any>(null);
  const [ethPrice, setEthPrice] = useState(3000);
  const [userTickets, setUserTickets] = useState(0);
  const [showModal, setShowModal] = useState<'buy' | 'winners' | 'invite' | 'info' | null>(null);
  const [ticketAmount, setTicketAmount] = useState(1);
  const [winners, setWinners] = useState<any[]>([]);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Initialize app
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check if running in Warpcast MiniApp
      if (typeof window !== 'undefined' && window.farcasterMiniApp) {
        setIsMiniApp(true);
        await initializeMiniApp();
      } else {
        await initializeWebApp();
      }

      // Initialize Frame SDK
      if (typeof window !== 'undefined' && window.FarcasterFrameSDK) {
        const sdk = new window.FarcasterFrameSDK();
        setFrameSdk(sdk);
        await sdk.actions.ready();
      }

      // Load data
      await updateEthPrice();
      await updateRoundInfo();
    } catch (error) {
      console.error("Initialization error:", error);
      showNotification("App initialization failed", "error");
    }
  };

  const initializeMiniApp = async () => {
    try {
      await window.farcasterMiniApp.ready();
      const wallet = await window.farcasterMiniApp.connectWallet({
        chainId: CONFIG.baseChainId,
        rpcUrl: CONFIG.baseRpcUrl
      });
      setAccount(wallet.address);
      
      const provider = new ethers.providers.Web3Provider(window.farcasterMiniApp.ethereum);
      setWeb3(provider);
      
      window.farcasterMiniApp.trackEvent('app_launched', { source: 'miniapp' });
      showNotification("Warpcast wallet connected!", "success");
    } catch (error) {
      console.error("MiniApp initialization error:", error);
      showNotification("Failed to initialize MiniApp", "error");
    }
  };

  const initializeWebApp = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setWeb3(provider);
        
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          await checkNetwork();
        }
        
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          setAccount(accounts[0] || null);
          if (accounts[0]) checkNetwork();
        });
        
        window.ethereum.on('chainChanged', (chainId: string) => {
          if (chainId === CONFIG.baseChainId) {
            window.location.reload();
          } else {
            checkNetwork();
          }
        });
      } else {
        const provider = new ethers.providers.JsonRpcProvider(CONFIG.baseRpcUrl);
        setWeb3(provider);
        showNotification("Web3 wallet not detected", "error");
      }
    } catch (error) {
      console.error("Web3 initialization error:", error);
    }
  };

  useEffect(() => {
    if (web3) {
      const lotteryContract = new ethers.Contract(
        CONFIG.contractAddress,
        CONFIG.abi,
        web3
      );
      setContract(lotteryContract);
    }
  }, [web3]);

  const connectWallet = async () => {
    if (!web3) return;
    
    try {
      if (isMiniApp) {
        const wallet = await window.farcasterMiniApp.connectWallet({
          chainId: CONFIG.baseChainId,
          rpcUrl: CONFIG.baseRpcUrl
        });
        setAccount(wallet.address);
        window.farcasterMiniApp.trackEvent('wallet_connected', { wallet: wallet.address });
        showNotification("Warpcast wallet connected!", "success");
      } else if (frameSdk) {
        const accounts = await frameSdk.wallet.ethProvider.request({
          method: 'eth_requestAccounts'
        });
        setAccount(accounts[0]);
        showNotification("Wallet connected via Frame", "success");
      } else if (window.ethereum) {
        await connectMetaMask();
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      showNotification("Failed to connect wallet", "error");
    }
  };

  const connectMetaMask = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      
      await checkNetwork();
      
      if (!isBaseNetwork()) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: CONFIG.baseChainId }],
          });
        } catch (error: any) {
          if (error.code === 4902) {
            await addBaseNetwork();
          } else {
            showNotification("Failed to switch to Base Network", "error");
          }
        }
      }
      
      showNotification("Wallet connected successfully", "success");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      showNotification("Failed to connect wallet", "error");
    }
  };

  const isBaseNetwork = () => {
    return isMiniApp || 
           (window.ethereum && window.ethereum.chainId === CONFIG.baseChainId);
  };

  const checkNetwork = async () => {
    if (!window.ethereum) return;
    
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const isBase = (chainId === CONFIG.baseChainId);
      
      if (!isBase) {
        showNotification("Please switch to Base Network", "error");
      }
    } catch (error) {
      console.error("Error checking network:", error);
    }
  };

  const addBaseNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: CONFIG.baseChainId,
          chainName: 'Base Mainnet',
          nativeCurrency: {
            name: 'Ether',
            symbol: CONFIG.currencySymbol,
            decimals: 18
          },
          rpcUrls: [CONFIG.baseRpcUrl],
          blockExplorerUrls: [CONFIG.baseExplorerUrl]
        }],
      });
    } catch (error) {
      console.error("Error adding Base network:", error);
      showNotification("Failed to add Base Network", "error");
    }
  };

  const updateRoundInfo = async () => {
    if (!contract) return;
    
    try {
      const roundInfo = await contract.getCurrentRoundInfo();
      const currentRoundIndex = await contract.currentRoundIndex();
      const round = await contract.rounds(currentRoundIndex);
      
      setCurrentRound({
        endTime: roundInfo.endTime.toNumber(),
        prizePool: roundInfo.prizePool.toString(),
        participantsCount: roundInfo.participantsCount.toNumber(),
        isActive: roundInfo.active,
        isCanceled: roundInfo.canceled,
        ticketPrice: await contract.ticketPriceETH()
      });
      
      if (account) {
        let tickets = 0;
        for (let i = 0; i < roundInfo.participantsCount.toNumber(); i++) {
          const participant = await contract.getParticipantInfo(currentRoundIndex, i);
          if (participant.wallet.toLowerCase() === account.toLowerCase()) {
            tickets += participant.tickets.toNumber();
          }
        }
        setUserTickets(tickets);
      }
    } catch (error) {
      console.error("Error updating round info:", error);
    }
  };

  const updateEthPrice = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const data = await response.json();
      setEthPrice(data.ethereum.usd);
    } catch (error) {
      console.error("Failed to fetch ETH price:", error);
    }
  };

  const buyTickets = async () => {
    if (!contract || !account) return;
    
    try {
      const ticketPriceWei = await contract.ticketPriceETH();
      const costWei = ticketPriceWei.mul(ticketAmount);
      
      if (isMiniApp) {
        window.farcasterMiniApp.showLoading(true);
        
        const txHash = await window.farcasterMiniApp.sendTransaction({
          to: CONFIG.contractAddress,
          value: costWei.toString(),
          data: contract.interface.encodeFunctionData('buyTickets', [ticketAmount]),
          chainId: CONFIG.baseChainId
        });
        
        window.farcasterMiniApp.trackEvent('tickets_purchased', {
          ticketAmount,
          costWei: costWei.toString(),
          txHash
        });
        
        showNotification(`Transaction sent: ${txHash.slice(0, 10)}...`, "success");
        window.farcasterMiniApp.showNotification({
          type: 'success',
          message: `${ticketAmount} ticket${ticketAmount > 1 ? 's' : ''} purchased!`,
          duration: 5000
        });
      } else if (frameSdk) {
        const txHash = await frameSdk.wallet.ethProvider.request({
          method: 'eth_sendTransaction',
          params: [{
            to: CONFIG.contractAddress,
            value: costWei.toString(),
            data: contract.interface.encodeFunctionData('buyTickets', [ticketAmount]),
            chainId: parseInt(CONFIG.baseChainId, 16)
          }]
        });
        
        showNotification(`Transaction sent: ${txHash.slice(0, 10)}...`, "success");
      } else {
        const signer = web3!.getSigner();
        const tx = await contract.connect(signer).buyTickets(ticketAmount, {
          value: costWei
        });
        
        await tx.wait();
        showNotification(
          `🎉 ${ticketAmount} ticket${ticketAmount > 1 ? 's' : ''} purchased!`,
          "success"
        );
      }
      
      setShowModal(null);
      updateRoundInfo();
    } catch (error) {
      console.error("Error buying tickets:", error);
      let errorMsg = "Failed to buy tickets";
      if ((error as any).message.includes("rejected")) errorMsg = "Transaction rejected";
      if ((error as any).message.includes("insufficient funds")) errorMsg = "Insufficient funds";
      showNotification(errorMsg, "error");
    } finally {
      if (isMiniApp) {
        window.farcasterMiniApp.showLoading(false);
      }
    }
  };

  const loadWinners = async () => {
    if (!contract) return;
    
    try {
      const currentRoundIndex = (await contract.currentRoundIndex()).toNumber();
      const winnersList = [];
      
      const roundsToShow = Math.min(currentRoundIndex, 10);
      
      for (let i = currentRoundIndex - 1; i >= Math.max(0, currentRoundIndex - roundsToShow); i--) {
        const round = await contract.rounds(i);
        
        if (round.winner !== ethers.constants.AddressZero) {
          winnersList.push({
            roundIndex: i,
            winner: round.winner,
            prizeAmount: round.prizeAmount.toString(),
            endTime: round.endTime.toNumber()
          });
        }
      }
      
      setWinners(winnersList);
    } catch (error) {
      console.error("Error loading winners:", error);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), type === 'error' ? 5000 : 3000);
    
    if (isMiniApp) {
      window.farcasterMiniApp.showNotification({
        type,
        message,
        duration: type === 'error' ? 5000 : 3000
      });
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRemainingTime = () => {
    if (!currentRound) return { formatted: "00:00:00", seconds: 0 };
    
    const now = Math.floor(Date.now() / 1000);
    const distance = currentRound.endTime - now;
    const seconds = distance > 0 ? distance : 0;
    
    return {
      formatted: formatTime(seconds),
      seconds
    };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentRound) {
        setCurrentRound({...currentRound});
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentRound]);

  useEffect(() => {
    if (showModal === 'winners') {
      loadWinners();
    }
  }, [showModal]);

  return (
    <>
      <Head>
        <title>✨ Neon Lottery | Daily ETH Draws on Base</title>
        <meta name="description" content="Win ETH daily! Transparent blockchain lottery on Base Network with instant payouts" />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lotteryneon.vercel.app/" />
        <meta property="og:title" content="✨ Neon Lottery | Daily ETH Draws on Base" />
        <meta property="og:description" content="Win ETH daily! Transparent blockchain lottery on Base Network with instant payouts" />
        <meta property="og:image" content={CONFIG.frameImageUrl} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://lotteryneon.vercel.app/" />
        <meta property="twitter:title" content="✨ Neon Lottery | Daily ETH Draws on Base" />
        <meta property="twitter:description" content="Win ETH daily! Transparent blockchain lottery on Base Network with instant payouts" />
        <meta property="twitter:image" content={CONFIG.frameImageUrl} />

        <meta name="fc:frame" content={JSON.stringify({
          version: CONFIG.frameVersion,
          imageUrl: CONFIG.frameImageUrl,
          button: {
            title: "🎫 Buy ticket",
            action: {
              type: "launch_frame",
              name: "Neon Lottery",
              url: "https://lotteryneon.vercel.app/",
              splashImageUrl: CONFIG.splashImageUrl,
              splashBackgroundColor: CONFIG.splashBackgroundColor
            }
          }
        })} />
      </Head>

      {isMiniApp && <div className={styles.miniappBadge}>✨ Warpcast Mode</div>}

      <main className={styles.container}>
        <h1 className={styles.title}>✨ NEON LOTTERY ✨</h1>

        {!isBaseNetwork() && (
          <div className={styles.networkWarning}>
            <i className="fas fa-exclamation-triangle"></i> Please switch to Base Network to participate
          </div>
        )}

        <div className={styles.timer}>{getRemainingTime().formatted}</div>
        
        <div className={styles.roundStatus}>
          {currentRound ? (
            getRemainingTime().seconds < 3600 ? (
              <span style={{ color: 'var(--neon-pink)' }}>
                Round Ending Soon - {formatTime(getRemainingTime().seconds)}
              </span>
            ) : (
              <span>Round Active - {formatTime(getRemainingTime().seconds)} remaining</span>
            )
          ) : (
            "Loading round info..."
          )}
        </div>

        <div className={styles.infoItem}>
          <span><i className="fas fa-ticket-alt"></i> Ticket Price:</span>
          <span>
            {contract && currentRound ? (
              `${ethers.utils.formatEther(currentRound.ticketPrice || '0')} ETH`
            ) : (
              "Loading..."
            )}
          </span>
        </div>

        <div className={styles.infoItem}>
          <span><i className="fas fa-coins"></i> Current Pool:</span>
          <span>
            {currentRound ? (
              `${ethers.utils.formatEther(currentRound.prizePool)} ETH`
            ) : (
              "Loading..."
            )}
          </span>
        </div>

        {account && (
          <div className={styles.infoItem}>
            <span><i className="fas fa-user"></i> Your Tickets:</span>
            <span>{userTickets}</span>
          </div>
        )}

        <button 
          className={`${styles.btn} ${account ? styles.walletConnected : ''}`}
          onClick={connectWallet}
        >
          <i className={`fas fa-${account ? 'check-circle' : 'wallet'}`}></i>
          {account ? `${account.substring(0, 6)}...${account.substring(38)}` : 'Connect Wallet'}
        </button>

        <button 
          className={styles.btn}
          onClick={() => setShowModal('buy')}
          disabled={!account}
        >
          <i className="fas fa-ticket-alt"></i> Buy Tickets
        </button>

        <button 
          className={`${styles.btn} ${styles.btnPink}`}
          onClick={() => setShowModal('winners')}
        >
          <i className="fas fa-trophy"></i> View Winners
        </button>

        <button 
          className={`${styles.btn} ${styles.btnPurple}`}
          onClick={() => setShowModal('invite')}
        >
          <i className="fas fa-user-plus"></i> Invite Friends
        </button>

        <button 
          className={styles.btn}
          onClick={() => setShowModal('info')}
        >
          <i className="fas fa-info-circle"></i> How It Works
        </button>

        {/* Buy Tickets Modal */}
        {showModal === 'buy' && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <span className={styles.close} onClick={() => setShowModal(null)}>&times;</span>
              <h2><i className="fas fa-ticket-alt"></i> Buy Tickets</h2>
              
              <div className={styles.ticketInput}>
                <button 
                  className={styles.ticketControl}
                  onClick={() => setTicketAmount(Math.max(1, ticketAmount - 1))}
                >-</button>
                <input 
                  type="number" 
                  value={ticketAmount}
                  min="1"
                  max="100"
                  onChange={(e) => setTicketAmount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                />
                <button 
                  className={styles.ticketControl}
                  onClick={() => setTicketAmount(Math.min(100, ticketAmount + 1))}
                >+</button>
              </div>
              
              <div className={styles.infoItem}>
                <span>Total Cost:</span>
                <span>
                  {contract && currentRound ? (
                    `${(parseFloat(ethers.utils.formatEther(currentRound.ticketPrice || '0')) * ticketAmount).toFixed(6)} ETH`
                  ) : (
                    "Calculating..."
                  )}
                </span>
              </div>
              
              <div className={styles.gasInfo}>
                <i className="fas fa-gas-pump"></i> Estimated fee: ~$0.10-$0.50
              </div>
              
              <button 
                className={styles.btn}
                onClick={buyTickets}
              >
                <i className="fas fa-shopping-cart"></i> Confirm Purchase
              </button>
            </div>
          </div>
        )}

        {/* Winners Modal */}
        {showModal === 'winners' && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <span className={styles.close} onClick={() => setShowModal(null)}>&times;</span>
              <h2><i className="fas fa-trophy"></i> Previous Winners</h2>
              
              {winners.length > 0 ? (
                <>
                  <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                    <i className="fas fa-trophy" style={{ color: 'var(--neon-pink)' }}></i>
                    <span>Recent Winners</span>
                  </div>
                  
                  {winners.map((winner, index) => (
                    <div key={index} className={styles.winnerItem}>
                      <div>
                        <div><strong>Round #{winner.roundIndex}</strong></div>
                        <div className={styles.winnerAddress}>
                          {winner.winner}
                        </div>
                        <a 
                          href={`${CONFIG.baseExplorerUrl}/address/${winner.winner}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.viewOnBasescan}
                        >
                          <i className="fas fa-external-link-alt"></i> View on BaseScan
                        </a>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div><strong>{ethers.utils.formatEther(winner.prizeAmount)} ETH</strong></div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {new Date(winner.endTime * 1000).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <i className="fas fa-spinner fa-spin"></i> Loading...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notification */}
        {notification && (
          <div className={`${styles.notification} ${styles[notification.type]}`}>
            <i className={`fas fa-${notification.type === 'error' ? 'exclamation-triangle' : 'check-circle'}`}></i>
            {notification.message}
          </div>
        )}
      </main>
    </>
  );
}
