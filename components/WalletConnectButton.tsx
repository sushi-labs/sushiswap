import React, { useState } from "react";
import { connectWallet } from "../lib/reownClient";

const WalletConnectButton = () => {
  const [connected, setConnected] = useState(false);

  const handleConnect = async () => {
    const session = await connectWallet();
    if (session) setConnected(true);
  };

  return (
    <button onClick={handleConnect}>
      {connected ? "Wallet Connected ✅" : "Connect Wallet"}
    </button>
  );
};

export default WalletConnectButton;
