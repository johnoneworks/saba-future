import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';

// Create client-side Magic instance
const createMagic = (key) => {
  return (
    typeof window != 'undefined' &&
    new Magic(key, {
      extensions: [new OAuthExtension()],
      network: {
        // rpcUrl: 'https://polygon-rpc.com/', // or https://matic-mumbai.chainstacklabs.com for testnet
        // chainId: 137 // or 80001 for polygon testnet
        rpcUrl: 'https://matic-mumbai.chainstacklabs.com/',
        chainId: 80001
      }
    })
  );
};

export const magic = createMagic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY || 'pk_live_A4477760AE601D2D');