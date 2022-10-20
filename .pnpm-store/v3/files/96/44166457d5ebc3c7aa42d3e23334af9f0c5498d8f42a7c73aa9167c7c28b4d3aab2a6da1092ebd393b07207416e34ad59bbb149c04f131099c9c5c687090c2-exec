type UserHistory = {
    id: string,
    timestamp: number,
    block: number,
    pair: {
        id: string,
        reserve0: number,
        reserve1: number,
        reserveUSD: number,
        token0: {
            id: string
        },
        token1: {
            id: string
        },
    },
    token0PriceUSD: number,
    token1PriceUSD: number,
    reserve0: number,
    reserve1: number,
    reserveUSD: number,
    liquidityTokenTotalSupply: number,
    liquidityTokenBalance: number,
}

export function userHistory({ minTimestamp, maxTimestamp, minBlock, maxBlock, user_address, max }: {
    minTimestamp?: number;
    maxTimestamp?: number;
    minBlock?: number;
    maxBlock?: number;
    user_address: string;
    max?: number;
}): Promise<UserHistory[]>;



type UserPositions = {
    id: string,
    pair: {
        id: string,
        reserve0: number,
        reserve1: number,
        reserveUSD: number,
        token0: {
            id: string,
            symbol: string,
            derivedETH: number
        },
        token1: {
            id: string,
            symbol: string,
            derivedETH: number
        },
        totalSupply: number
    },
    liquidityTokenBalance: number
}

export function userPositions({ block, timestamp, user_address }: {
    block?: number;
    timestamp?: number;
    user_address: string;
}): Promise<UserPositions[]>;
