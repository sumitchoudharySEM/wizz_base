"use client";
import React, { useCallback } from "react";
import { useConnect } from "wagmi";
import { CoinbaseWalletLogo } from "./CoinbaseWalletLogo";
import { useAccount } from "wagmi";

const buttonStyles = {
  background: "transparent",
  border: "1px solid transparent",
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
  width: 200,
  fontFamily: "Arial, sans-serif",
  fontWeight: "bold",
  fontSize: 16,
  backgroundColor: "#0052FF",
  padding: 10,
  paddingLeft: 15,
  paddingRight: 30,
  borderRadius: 10,
};

export function BlueCreateWalletButton() {
  const { address } = useAccount();
  const { connectors, connect, data } = useConnect();

  const createWallet = useCallback(() => {
    const coinbaseWalletConnector = connectors.find(
      (connector) => connector.id === "coinbaseWalletSDK"
    );
    if (coinbaseWalletConnector) {
      connect({ connector: coinbaseWalletConnector });
    }
  }, [connectors, connect]);
  return (
    <button style={buttonStyles} onClick={createWallet}>
      <CoinbaseWalletLogo />
      {address ? <span>Connected </span> : <span>Connect Wallet</span>}
    </button>
  );
}
