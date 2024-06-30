"use client"
import { http, createConfig } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";
import { metaMask } from '@wagmi/connectors'

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({ appName: "Create Wagmi", preference: "smartWalletOnly" }),
  ],
  // connectors: [metaMask()],
  transports: {
    [baseSepolia.id]: http(),
  },
});
