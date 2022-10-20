type Info = {
    address: string;
    sushiServed: number;
}

export function info({ block, timestamp }?: {
    block?: number;
    timestamp?: number;
}): Promise<Info>;



type Servings = {
    serverAddress: string,
    tx: string,
    pair: string,
    token0: string,
    token1: string,
    sushiServed: number,
    block: number,
    timestamp: number,
    date: Date
}

export function servings({ minTimestamp, maxTimestamp, minBlock, maxBlock, max }?: {
    minTimestamp?: number;
    maxTimestamp?: number;
    minBlock?: number;
    maxBlock?: number;
    max?: number;
}): Promise<Servings[]>;



type Servers = {
    serverAddress: string,
    sushiServed: number,
    servings: {
        tx: string,
        block: number,
        pair: string,
        sushiServed: number
    }[]
}

export function servers({ block, timestamp, max }?: {
    block?: number;
    timestamp?: number;
    max?: number;
}): Promise<Servers[]>;



type PendingServings = {
    address: string,
    token0: {
        id: string,
        name: string,
        symbol: string
    },
    token1: {
        id: string,
        name: string,
        symbol: string
    },
    valueUSD: number
}

export function pendingServings({ block, timestamp, max }?: {
    block?: number;
    timestamp?: number;
    max?: number;
}): Promise<PendingServings[]>;

export function observePendingServings(): {
    subscribe({ next, error, complete }: {
        next?(data: PendingServings): any;
        error?(error: any): any;
        complete?: Function;
    }): any;
};