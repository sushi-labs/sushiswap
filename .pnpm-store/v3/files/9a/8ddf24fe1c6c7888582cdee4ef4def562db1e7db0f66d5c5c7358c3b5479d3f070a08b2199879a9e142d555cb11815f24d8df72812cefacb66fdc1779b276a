export interface MulticallOptions {
    reducerPath?: string;
}
export declare function createMulticall(options?: MulticallOptions): {
    reducerPath: string;
    reducer: import("redux").Reducer<import("./types").MulticallState, import("redux").AnyAction>;
    actions: import("@reduxjs/toolkit").CaseReducerActions<{
        addMulticallListeners: (state: import("immer/dist/internal").WritableDraft<import("./types").MulticallState>, action: {
            payload: import("./types").MulticallListenerPayload;
            type: string;
        }) => void;
        removeMulticallListeners: (state: import("immer/dist/internal").WritableDraft<import("./types").MulticallState>, action: {
            payload: import("./types").MulticallListenerPayload;
            type: string;
        }) => void;
        fetchingMulticallResults: (state: import("immer/dist/internal").WritableDraft<import("./types").MulticallState>, action: {
            payload: import("./types").MulticallFetchingPayload;
            type: string;
        }) => void;
        errorFetchingMulticallResults: (state: import("immer/dist/internal").WritableDraft<import("./types").MulticallState>, action: {
            payload: import("./types").MulticallFetchingPayload;
            type: string;
        }) => void;
        updateMulticallResults: (state: import("immer/dist/internal").WritableDraft<import("./types").MulticallState>, action: {
            payload: import("./types").MulticallResultsPayload;
            type: string;
        }) => void;
        updateListenerOptions: (state: import("immer/dist/internal").WritableDraft<import("./types").MulticallState>, action: {
            payload: import("./types").MulticallListenerOptionsPayload;
            type: string;
        }) => void;
    }>;
    hooks: {
        useMultipleContractSingleData: (chainId: number | undefined, latestBlockNumber: number | undefined, addresses: (string | undefined)[], contractInterface: import("@ethersproject/abi").Interface, methodName: string, callInputs?: (string | number | import("ethers").BigNumber | import("./validation").MethodArg[] | undefined)[] | undefined, options?: Partial<import("./types").ListenerOptionsWithGas> | undefined) => import("./types").CallState[];
        useSingleContractMultipleData: (chainId: number | undefined, latestBlockNumber: number | undefined, contract: import("ethers").Contract | null | undefined, methodName: string, callInputs: ((string | number | import("ethers").BigNumber | import("./validation").MethodArg[] | undefined)[] | undefined)[], options?: Partial<import("./types").ListenerOptionsWithGas> | undefined) => import("./types").CallState[];
        useSingleContractWithCallData: (chainId: number | undefined, latestBlockNumber: number | undefined, contract: import("ethers").Contract | null | undefined, callDatas: string[], options?: Partial<import("./types").ListenerOptionsWithGas> | undefined) => import("./types").CallState[];
        useSingleCallResult: (chainId: number | undefined, latestBlockNumber: number | undefined, contract: import("ethers").Contract | null | undefined, methodName: string, inputs?: (string | number | import("ethers").BigNumber | import("./validation").MethodArg[] | undefined)[] | undefined, options?: Partial<import("./types").ListenerOptionsWithGas> | undefined) => import("./types").CallState;
        useMultiChainMultiContractSingleData: (chainToBlockNumber: Record<number, number | undefined>, chainToAddresses: Record<number, (string | undefined)[]>, contractInterface: import("@ethersproject/abi").Interface, methodName: string, callInputs?: (string | number | import("ethers").BigNumber | import("./validation").MethodArg[] | undefined)[] | undefined, options?: Partial<import("./types").ListenerOptionsWithGas> | undefined) => Record<number, import("./types").CallState[]>;
        useMultiChainSingleContractSingleData: (chainToBlockNumber: Record<number, number | undefined>, chainToAddress: Record<number, string | undefined>, contractInterface: import("@ethersproject/abi").Interface, methodName: string, callInputs?: (string | number | import("ethers").BigNumber | import("./validation").MethodArg[] | undefined)[] | undefined, options?: Partial<import("./types").ListenerOptionsWithGas> | undefined) => Record<number, import("./types").CallState>;
    };
    Updater: (props: Pick<import("./updater").UpdaterProps, "listenerOptions" | "chainId" | "latestBlockNumber" | "contract" | "isDebug">) => JSX.Element;
};
