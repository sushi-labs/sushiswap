import {getCrossChainSwapEdgeConfig} from "lib/edge/get-cross-chain-swap-edge-config";
import {DerivedstateCrossChainSwapProvider} from "ui/swap/cross-chain/derivedstate-cross-chain-swap-provider";
import {EdgeProvider} from "../../../providers/edge-config-provider";

export async function Providers({ children }: { children: React.ReactNode }) {
	const config = await getCrossChainSwapEdgeConfig();

	return (
		<EdgeProvider config={config}>
			<DerivedstateCrossChainSwapProvider>
				{children}
			</DerivedstateCrossChainSwapProvider>
		</EdgeProvider>
	);
}
