type LatestBlock = {
    id: string;
    number: number;
    timestamp: number;
    date: Date;
}

export function latestBlock(): Promise<LatestBlock>;

export function observeLatestBlock(): {
    subscribe({ next, error, complete }: {
        next?(data: LatestBlock): any;
        error?(error: any): any;
        complete?: Function;
    }): any;
};



type GetBlock = {
    id: string;
    number: number;
    timestamp: number;
    author: string;
    difficulty: number;
    gasUsed: number;
    gasLimit: number;
}

export function getBlock({ block, timestamp }: {
    block?: number;
    timestamp?: number;
}): Promise<GetBlock>;
