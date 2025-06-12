"use client";

import { Navigation, SushiNavigationDropdown, classNames } from "@sushiswap/ui";
import { SushiIcon } from "@sushiswap/ui/icons/SushiIcon";
import { SushiWithTextIcon } from "@sushiswap/ui/icons/SushiWithTextIcon";
import React, { type FC, Suspense } from "react";
import { NonStandardChainId, SUPPORTED_NETWORKS } from "src/config";
import { HeaderNetworkSelector } from "src/lib/wagmi/components/header-network-selector";
import { HeaderElements } from "./_common/header-elements";
import { WalletConnector } from "./_common/ui/WalletConnector/WalletConnector";

export const Header: FC<{ className?: string }> = ({ className }) => {
	return (
		<div className={classNames("w-full h-[56px] z-20", className)}>
			<div className="fixed w-full flex z-20">
				<div
					className={classNames(
						"hidden lg:flex justify-between items-center px-1 h-14 flex-shrink-0 bg-gray-100 dark:bg-slate-900 border-gray-200 dark:border-slate-800 border-b"
					)}>
					<SushiNavigationDropdown className="!px-2">
						<SushiWithTextIcon width={90} />
					</SushiNavigationDropdown>
				</div>
				<div className="flex lg:hidden justify-between items-center pl-4 bg-gray-100 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
					<SushiNavigationDropdown>
						<SushiIcon width={24} height={24} />
					</SushiNavigationDropdown>
				</div>
				<Navigation
					className="!pl-0 lg:!pl-4 !z-[unset]"
					hideSushiDropdown
					leftElements={HeaderElements()}
					rightElement={
						<Suspense>
							<HeaderNetworkSelector
								networks={SUPPORTED_NETWORKS}
								selectedNetwork={NonStandardChainId.KADENA}
								className="flex"
							/>
							<WalletConnector variant="secondary" />
						</Suspense>
					}
				/>
			</div>
		</div>
	);
};
