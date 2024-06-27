"use client";
import {BlueCreateWalletButton} from './smartWalletButton';
import { useAccount} from 'wagmi'

export default function Home() {
  const { address } = useAccount()
  return (
    <div>
      <h1>Wagmi</h1>
      <p>
        <BlueCreateWalletButton />
        {address ? <span>Connected with address {address}</span> : <span>Not connected</span>}
      </p>
    </div>
  );
}
