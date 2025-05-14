"use client";

import { eckoAdapter } from "@kadena/wallet-adapter-ecko";
import { createWalletConnectAdapter } from "@kadena/wallet-adapter-walletconnect";
import { KadenaWalletProvider as KadenaWalletProviderReact } from "@kadena/wallet-adapter-react";
import { KadenaWalletProvider } from "./kadena-wallet-provider";

//@dev will remove later, for testing purposes only
const TEST_ID = "5329e5621bb8e903c0de8ad458cc8934";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<KadenaWalletProviderReact
			adapters={[
				eckoAdapter(),
				createWalletConnectAdapter({
					projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? TEST_ID,
				}),
			]}>
			<KadenaWalletProvider>{children}</KadenaWalletProvider>
		</KadenaWalletProviderReact>
	);
}
