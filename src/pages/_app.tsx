import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { base } from 'wagmi/chains';
import { useNotifications } from '@/utils/notifications';
import { Notification } from '@/components/Notification';

const { publicClient, webSocketPublicClient } = configureChains(
  [base],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  const { notifications, removeNotification } = useNotifications();

  return (
    <WagmiConfig config={config}>
      <Component {...pageProps} />
      
      {/* Render notifications */}
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </WagmiConfig>
  );
}
