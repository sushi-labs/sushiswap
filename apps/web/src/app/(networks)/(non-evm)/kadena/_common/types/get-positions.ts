export type WalletPosition = {
	id: string;
	pairId: string;
	pair: {
		address: string;
		id: string;
		reserve0: string;
		reserve1: string;
		token0: {
			address: string;
			chainId: string;
			id: string;
			name: string;
		};
		token1: {
			address: string;
			chainId: string;
			id: string;
			name: string;
		};
		tvlUsd: number;
		totalSupply: string;
	};
	liquidity: string;
	valueUsd: string;
	apr24h: string;
};

export type WalletPositionsResponse = {
	success: boolean;
	data: WalletPosition[];
};
