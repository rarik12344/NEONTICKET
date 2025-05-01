import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';
import '../types/farcaster';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <script 
          src="https://unpkg.com/@farcaster/frame-sdk@0.0.37/dist/frame-sdk.umd.js" 
          async
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
