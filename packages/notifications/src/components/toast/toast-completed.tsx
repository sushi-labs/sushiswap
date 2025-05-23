import type { FC } from "react";
import { EvmChain } from "sushi/chain";
import type { ResolvedNotification } from "../../types";
import { ToastContent } from "./toast-content";
import { ICONS } from "./toast-icons";
import { useMemo } from "react";
import { classNames } from "@sushiswap/ui";

interface ToastCompleted extends ResolvedNotification {
	onDismiss(): void;
}

export const ToastCompleted: FC<ToastCompleted> = ({
	type: _type,
	href,
	chainId,
	txHash,
	onDismiss: _onDismiss,
	summary,
	description,
}) => {
	const txUrl = href ? href : txHash ? EvmChain.from(chainId)?.getTxUrl(txHash) : "";

	const icon = useMemo(() => {
		const _icon = ICONS[_type as keyof typeof ICONS] || undefined;
		if (!_icon) {
			return undefined;
		}
		return (
			<div
				className={classNames(
					"flex h-8 w-8 items-center justify-center rounded-full",
					_type === "product"
						? "bg-gradient-to-r from-[#3b83f614] to-[#ec489a15]"
						: "bg-green-500/20 text-green-500"
				)}>
				{_icon}
			</div>
		);
	}, [_type]);

	return (
		<>
			<ToastContent icon={icon} description={description} href={txUrl} summary={summary} />
		</>
	);
};
