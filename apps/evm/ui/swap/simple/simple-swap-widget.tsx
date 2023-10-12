"use client";

import {Button, Dots, ToastTransaction, useToast} from "@sushiswap/ui";
import {CrossChainBanner} from "../cross-chain-banner";
import {SwapModeButtons} from "../swap-mode-buttons";
import {SimpleSwapHeader} from "./simple-swap-header";
import {SimpleSwapSettingsOverlay} from "./simple-swap-settings-overlay";
import {SimpleSwapSwitchTokensButton} from "./simple-swap-switch-tokens-button";
import {SimpleSwapTokenNotFoundDialog} from "./simple-swap-token-not-found-dialog";
import {SimpleSwapToken0Input} from "./simple-swap-token0-input";
import {SimpleSwapToken1Input} from "./simple-swap-token1-input";
import {SimpleSwapTradeButton} from "./simple-swap-trade-button";
import {SimpleSwapTradeStats} from "./simple-swap-trade-stats";
import {ChainId} from "sushi/chain";

export const SimpleSwapWidget = () => {
	const { toast } = useToast();

	const onClick = () => {
		const promise = new Promise<void>((resolve, reject) =>
			setTimeout(() => reject(), 2000),
		);

		const { id, update } = toast({
			duration: 1000000000,
			content: (
				<ToastTransaction
					status="pending"
					chainId={ChainId.ETHEREUM}
					hash="0x"
					description={
						<Dots>
							Swapping <b>0.0001 ETH</b> for <b>0.0001 ETH</b>
						</Dots>
					}
				/>
			),
		});

		promise
			.then(() => {
				update({
					id,
					content: (
						<ToastTransaction
							status="success"
							chainId={ChainId.ETHEREUM}
							hash="0x"
							description={
								<>
									Swapped <b>0.0001 ETH</b> for <b>0.0001 ETH</b>
								</>
							}
						/>
					),
				});
			})
			.catch(() => {
				update({
					id,
					content: (
						<ToastTransaction
							status="failed"
							chainId={ChainId.ETHEREUM}
							hash="0x"
							description={
								<>
									<b>Oops!</b> Something went wrong.
								</>
							}
						/>
					),
				});
			});
	};

	return (
		<div className="flex flex-col gap-4">
			<SimpleSwapHeader />
			<div className="flex items-center justify-between">
				<SwapModeButtons />
				<SimpleSwapSettingsOverlay />
			</div>
			<CrossChainBanner />
			<SimpleSwapToken0Input />
			<SimpleSwapSwitchTokensButton />
			<div className="flex flex-col">
				<SimpleSwapToken1Input />
				<SimpleSwapTradeButton />
			</div>

			<SimpleSwapTradeStats />
			<SimpleSwapTokenNotFoundDialog />
			<Button onClick={() => onClick()}>Test</Button>
		</div>
	);
};
