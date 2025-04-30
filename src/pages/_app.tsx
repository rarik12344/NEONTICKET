import type { AppProps } from "next/app";
import "../styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <script 
          src="https://unpkg.com/@farcaster/frame-sdk@0.0.37/dist/frame-sdk.umd.js" 
          async 
          data-domain="lotteryneon.vercel.app"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
