import { HalfCircleIcon } from "@sushiswap/ui/icons/HalfCircleIcon";
import type { FC } from "react";
import { EvmChain } from "sushi/chain";

import type { ResolvedNotification } from "../../types";
import { ToastContent } from "./toast-content";

interface ToastInfo extends ResolvedNotification {
	onDismiss(): void;
}

export const ToastInfo: FC<ToastInfo> = ({ href, chainId, txHash, summary, description }) => {
	const txUrl = href ? href : txHash ? EvmChain.from(chainId)?.getTxUrl(txHash) : "";
	return (
		<>
			<ToastContent
				href={txUrl}
				icon={<HalfCircleIcon width={18} height={18} className="text-blue" />}
				summary={summary}
				description={description}
			/>
		</>
	);
};
