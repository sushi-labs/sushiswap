import { Tab } from "@headlessui/react";
import { Card, CardHeader, CardTitle, Container } from "@sushiswap/ui";
import { Button } from "@sushiswap/ui";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import React, { Fragment, useState } from "react";
import { PoolSearchBar } from "./PoolSearchBar";
import { PoolsTable } from "./PoolsTable/PoolsTable";
import { PositionsTable } from "./PositionsTable/PositionsTable";

export const PoolsView = () => {
	const [tab, setTab] = useState<number>(0);
	const { address } = useWallet();
	const [query, setQuery] = useState<string>("");
	const [poolsOnView, setPoolsOnView] = useState<number>(-1);
	const [myPositionsOnView, setMyPositionsOnView] = useState<number>(-1);

	const handlePoolsOnView = (pools: number) => {
		setPoolsOnView(pools);
	};

	const handleMyPositionsOnView = (positions: number) => {
		setMyPositionsOnView(positions);
	};

	return (
		<div className="flex flex-col h-full">
			<Tab.Group defaultIndex={0} selectedIndex={tab} onChange={setTab}>
				<Container maxWidth="7xl" className="px-4 mx-auto">
					<div className="flex items-center gap-2 mb-4">
						<Tab as={Fragment}>
							{({ selected }) => (
								<Button size="sm" variant={selected ? "secondary" : "ghost"}>
									All Pools
								</Button>
							)}
						</Tab>
						{address && (
							<>
								<Tab as={Fragment}>
									{({ selected }) => (
										<Button size="sm" variant={selected ? "secondary" : "ghost"}>
											My Positions
										</Button>
									)}
								</Tab>
							</>
						)}
					</div>
				</Container>
				<Tab.Panels className="py-4 h-full bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4">
					<Container maxWidth="7xl" className="px-4">
						<PoolSearchBar
							query={query}
							setQuery={setQuery}
							placeholder={tab === 0 ? "Search by address" : "Search by address, name, or symbol"}
						/>
					</Container>
					<Tab.Panel>
						<div className="px-4 mx-auto max-w-7xl w-full pb-20">
							<Card className="mt-4">
								<CardHeader>
									<CardTitle>Pools ({poolsOnView === -1 ? "-" : poolsOnView})</CardTitle>
								</CardHeader>
								<PoolsTable handlePoolsOnView={handlePoolsOnView} query={query} />
							</Card>
						</div>
					</Tab.Panel>
					<Tab.Panel>
						<div className="px-4 mx-auto max-w-7xl w-full pb-20">
							<Card className="mt-4">
								<CardHeader>
									<CardTitle>My Positions ({myPositionsOnView === -1 ? "-" : myPositionsOnView})</CardTitle>
								</CardHeader>
								<PositionsTable handleMyPositionsOnView={handleMyPositionsOnView} query={query} />
							</Card>
						</div>
					</Tab.Panel>
					<Tab.Panel />
				</Tab.Panels>
			</Tab.Group>
		</div>
	);
};
