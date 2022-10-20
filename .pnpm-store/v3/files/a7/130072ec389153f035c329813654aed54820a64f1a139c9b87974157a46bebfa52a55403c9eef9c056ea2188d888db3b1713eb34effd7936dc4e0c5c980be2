type Factory = [
    [
        {
            id: number,
            date: Date,
            volumeETH: number,
            volumeUSD: number,
            liquidityETH: number,
            liquidityUSD: number,
            txCount: number
        }
    ],
    [
        {
            date: Date,
            weeklyVolumeUSD: number
        }
    ]
];

export function factory(): Promise<Factory>;



type Token = {
    id: string,
    date: Date,
    timestamp: number,
    volume: number,
    volumeETH: number,
    volumeUSD: number,
    liquidity: number,
    liquidityETH: number,
    liquidityUSD: number,
    priceUSD: number,
    txCount: number
};

type TokenHourly = {
    id: string,
    symbol: string,
    name: string,
    decimals: number,
    totalSupply: number,
    volume: number | undefined,
    volumeUSD: number | undefined,
    untrackedVolumeUSD: number | undefined,
    txCount: number | undefined,
    liquidity: number | undefined,
    derivedETH: number,
    timestamp: number,
    priceUSD: number,
    open: number,
    close: number | undefined
};

export function tokenHourly({token_address, startTime}: {
    token_address: string;
    startTime?: number;
}): Promise<TokenHourly[]>;

export function tokenDaily({token_address}: {
    token_address: string;
}): Promise<Token[]>;



type Pair = {
    id: string,
    date: Date,
    timestamp: number,
    volumeUSD: number,
    volumeToken0: number,
    volumeToken1: number,
    liquidityUSD: number,
    txCount: number
};

type PairHourly = {
    id: string,
    token0: {
        id: string,
        name: string,
        symbol: string,
        totalSupply: number,
        derivedETH: number
    },
    token1: {
        id: string,
        name: string,
        symbol: string,
        totalSupply: number,
        derivedETH: number
    },
    reserve0: number,
    reserve1: number,
    totalSupply: number,
    reserveETH: number,
    reserveUSD: number,
    trackedReserveETH: number,
    token0Price: number,
    token1Price: number,
    volumeToken0: number | undefined,
    volumeToken1: number | undefined,
    volumeUSD: number,
    untrackedVolumeUSD: number,
    txCount: number | undefined,
    timestamp: number,
    rate0: {
        open: number,
        close: number | undefined,
    },
    rate1: {
        open: number,
        close: number | undefined,
    },
};

export function pairHourly({pair_address, startTime}: {
    pair_address: string;
    startTime?: number;
}): Promise<PairHourly[]>;

export function pairDaily({pair_address}: {
    pair_address: string;
}): Promise<Pair[]>;