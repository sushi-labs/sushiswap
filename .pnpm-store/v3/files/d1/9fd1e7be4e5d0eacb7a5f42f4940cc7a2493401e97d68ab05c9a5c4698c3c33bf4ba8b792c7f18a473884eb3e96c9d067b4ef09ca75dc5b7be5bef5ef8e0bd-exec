type Info = {
    decimals: number;
    name: string;
    sushi: string;
    symbol: string;
    totalSupply: number;
    ratio: number;
    xSushiMinted: number;
    xSushiBurned: number;
    sushiStaked: number;
    sushiStakedUSD: number;
    sushiHarvested: number;
    sushiHarvestedUSD: number;
    xSushiAge: number;
    xSushiAgeDestroyed: number;
    updatedAt: number;
}

export function info({ block, timestamp }?: {
    block?: number;
    timestamp?: number;
}): Promise<Info>;

export function observeInfo(): {
    subscribe({ next, error, complete }: {
        next?(data: Info): any;
        error?(error: any): any;
        complete?: Function;
    }): any;
};



type User = {
    xSushi: number;
    xSushiIn: number;
    xSushiOut: number;
    xSushiMinted: number;
    xSushiBurned: number;
    xSushiOffset: number;
    xSushiAge: number;
    xSushiAgeDestroyed: number;
    sushiStaked: number;
    sushiStakedUSD: number;
    sushiHarvested: number;
    sushiHarvestedUSD: number;
    sushiIn: number;
    sushiOut: number;
    usdOut: number;
    usdIn: number;
    updatedAt: number;
    sushiOffset: number;
    usdOffset: number;
}

export function user({ block, timestamp, user_address }: {
    block?: number;
    timestamp?: number;
    user_address: string;
}): Promise<User>;
