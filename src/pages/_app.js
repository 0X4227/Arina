// pages/_app.js
import { useEffect, useState } from 'react';
import '@/styles/globals.css';
import { NearContext } from '@/context';
// import { Navigation } from '@/components/Navigation';
import { Wallet } from '@/wallets/near';
import { NetworkId } from '@/config';
import useFirebaseNotification from '@/hooks/firebase/useFirebaseNotification'; // Import Firebase messaging hook
import Head from "next/head";
import { Toaster } from "@/components/ui/toaster"

const wallet = new Wallet({ networkId: NetworkId });

function MyApp({ Component, pageProps }) {
  const [signedAccountId, setSignedAccountId] = useState('');

  useEffect(() => {
    wallet.startUp(setSignedAccountId);
  }, []);
                       
  // Initialize Firebase messaging
  useFirebaseNotification();

  return (

    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Arina</title>
        <meta name="description" content="Best PWA app in the world!" />
        <link rel="shortcut icon" href="/logo.png" />
        <link rel="mask-icon" href="//logo.png" color="#FFFFFF" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700&display=swap" rel="stylesheet"/>

        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/icon-192x192.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/icon-192x192.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/icons/icon-192x192.png"
        />
        <link rel="manifest" href="/manifest.json" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://yourdomain.com" />
        <meta name="twitter:title" content="Arina App" />
        <meta name="twitter:description" content="Arina App" />
        <meta name="twitter:image" content="/icons/twitter.png" />
        <meta name="twitter:creator" content="@kaliba" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Arina App" />
        <meta property="og:description" content="Arina App" />
        <meta property="og:site_name" content="Arina App" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta property="og:image" content="/icons/og.png" />
        {/* add the following only if you want to add a startup image for Apple devices. */}
        <link
          rel="apple-touch-startup-image"
          href="/icons/icon-512x512.png"
          sizes="2048x2732"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/icon-512x512.png"
          sizes="1668x2224"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/icon-512x512.png"
          sizes="1536x2048"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/icon-512x512.png"
          sizes="1125x2436"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/icon-512x512.png"
          sizes="1242x2208"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/icon-512x512.png"
          sizes="750x1334"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/icon-512x512.png"
          sizes="640x1136"
        />
      </Head>
     
    <NearContext.Provider value={{ wallet, signedAccountId }}>
      {/* <Navigation /> */}
      
      
      <Component {...pageProps} />
      <Toaster />
      <div className="firefly"></div>
      <div className="firefly"></div>
      <div className="firefly"></div>
      <div className="firefly"></div>
      <div className="firefly"></div>
      <div className="firefly"></div>
      <div className="firefly"></div>
      <div className="firefly"></div>
      <div className="firefly"></div>
      <div className="firefly"></div>
      <div className="firefly"></div>
      <div className="firefly"></div>
      <div className="firefly"></div>
      <div className="firefly"></div>
      <div className="firefly"></div>
      <div className="firefly"></div>
      <div className="firefly"></div>
      <div className="firefly"></div>
      <div className="firefly"></div>
      <div className="firefly"></div>
      <div className="firefly"></div>
      <div className="firefly"></div>
      <div className="firefly"></div>
      <div className="firefly"></div>
      <div className="firefly"></div>
      <div className="firefly"></div>
      <div className="firefly"></div>
      <div className="firefly"></div>
      <div className="firefly"></div>
      <div className="firefly"></div>

    </NearContext.Provider>
    </>
  );
}

export default MyApp;
