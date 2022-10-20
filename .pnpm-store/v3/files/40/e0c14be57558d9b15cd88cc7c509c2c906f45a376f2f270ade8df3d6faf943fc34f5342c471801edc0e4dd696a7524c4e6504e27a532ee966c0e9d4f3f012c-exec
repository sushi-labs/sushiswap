type Price = number;

export function priceUSD({ block, timestamp }?: {
    block?: number;
    timestamp?: number;
}): Promise<Price>;

export function priceETH({ block, timestamp }?: {
    block?: number;
    timestamp?: number;
}): Promise<Price>;

export function observePriceETH(): {
    subscribe({ next, error, complete }: {
        next?(data: Price): any;
        error?(error: any): any;
        complete?: Function;
    }): any;
};
