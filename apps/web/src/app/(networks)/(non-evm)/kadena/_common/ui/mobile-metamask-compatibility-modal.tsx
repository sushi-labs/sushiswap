"use client";

import { useIsMounted, useIsSmScreen, useLocalStorage } from "@sushiswap/hooks";
import { Card, Dialog, DialogContent, DialogHeader, DialogTitle } from "@sushiswap/ui";

export const MobileMetamaskCompatibilityModal = () => {
	const isMounted = useIsMounted();
	const isSmallScreen = useIsSmScreen();
	const [hasClosedBanner, closeBanner] = useLocalStorage(
		"has-closed-kadena-mobile-compatibility-modal",
		false
	);

	const handleCloseBanner = () => {
		closeBanner(true);
	};

	if (hasClosedBanner || !isMounted || !isSmallScreen) return null;

	return (
		<Dialog open={true} onOpenChange={handleCloseBanner}>
			<DialogContent>
				<DialogHeader className="py-2.5">
					<DialogTitle className="text-xl !text-left">Mobile Wallet Limitation</DialogTitle>
				</DialogHeader>
				<Card>
					<div className="flex flex-col gap-4 p-4">
						<span>
							MetaMask is not supported on mobile when using Kadena. Use a desktop browser or another wallet
							on mobile.
						</span>
					</div>
				</Card>
			</DialogContent>
		</Dialog>
	);
};
