export interface Call {
    address: string;
    callData: string;
    gasRequired?: number;
}
export interface CallStateResult extends ReadonlyArray<any> {
    readonly [key: string]: any;
}
export interface CallState {
    readonly valid: boolean;
    readonly result: CallStateResult | undefined;
    readonly loading: boolean;
    readonly syncing: boolean;
    readonly error: boolean;
}
export interface CallResult {
    readonly valid: boolean;
    readonly data: string | undefined;
    readonly blockNumber: number | undefined;
}
export interface MulticallState {
    callListeners?: {
        [chainId: number]: {
            [callKey: string]: {
                [blocksPerFetch: number]: number;
            };
        };
    };
    callResults: {
        [chainId: number]: {
            [callKey: string]: {
                data?: string | null;
                blockNumber?: number;
                fetchingBlockNumber?: number;
            };
        };
    };
    listenerOptions?: {
        [chainId: number]: ListenerOptions;
    };
}
export interface WithMulticallState {
    [path: string]: MulticallState;
}
export interface ListenerOptions {
    readonly blocksPerFetch: number;
}
export interface ListenerOptionsWithGas extends ListenerOptions {
    readonly gasRequired?: number;
}
export interface MulticallListenerPayload {
    chainId: number;
    calls: Call[];
    options: ListenerOptions;
}
export interface MulticallFetchingPayload {
    chainId: number;
    calls: Call[];
    fetchingBlockNumber: number;
}
export interface MulticallResultsPayload {
    chainId: number;
    blockNumber: number;
    results: {
        [callKey: string]: string | null;
    };
}
export interface MulticallListenerOptionsPayload {
    chainId: number;
    listenerOptions: ListenerOptions;
}
