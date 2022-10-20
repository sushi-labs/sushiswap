export declare const multicall: {
    reducerPath: string;
    reducer: import("redux").Reducer<import("../src").MulticallState, import("redux").AnyAction>;
    actions: import("@reduxjs/toolkit").CaseReducerActions<{
        addMulticallListeners: (state: import("immer/dist/internal").WritableDraft<import("../src").MulticallState>, action: {
            payload: import("../src").MulticallListenerPayload;
            type: string;
        }) => void;
        removeMulticallListeners: (state: import("immer/dist/internal").WritableDraft<import("../src").MulticallState>, action: {
            payload: import("../src").MulticallListenerPayload;
            type: string;
        }) => void;
        fetchingMulticallResults: (state: import("immer/dist/internal").WritableDraft<import("../src").MulticallState>, action: {
            payload: import("../src").MulticallFetchingPayload;
            type: string;
        }) => void;
        errorFetchingMulticallResults: (state: import("immer/dist/internal").WritableDraft<import("../src").MulticallState>, action: {
            payload: import("../src").MulticallFetchingPayload;
            type: string;
        }) => void;
        updateMulticallResults: (state: import("immer/dist/internal").WritableDraft<import("../src").MulticallState>, action: {
            payload: import("../src").MulticallResultsPayload;
            type: string;
        }) => void;
        updateListenerOptions: (state: import("immer/dist/internal").WritableDraft<import("../src").MulticallState>, action: {
            payload: import("../src").MulticallListenerOptionsPayload;
            type: string;
        }) => void;
    }>;
    hooks: {
        useMultipleContractSingleData: (chainId: number | undefined, latestBlockNumber: number | undefined, addresses: (string | undefined)[], contractInterface: import("@ethersproject/abi").Interface, methodName: string, callInputs?: (string | number | import("ethers").BigNumber | import("../src/validation").MethodArg[] | undefined)[] | undefined, options?: Partial<import("../src").ListenerOptionsWithGas> | undefined) => import("../src").CallState[];
        useSingleContractMultipleData: (chainId: number | undefined, latestBlockNumber: number | undefined, contract: import("ethers").Contract | null | undefined, methodName: string, callInputs: ((string | number | import("ethers").BigNumber | import("../src/validation").MethodArg[] | undefined)[] | undefined)[], options?: Partial<import("../src").ListenerOptionsWithGas> | undefined) => import("../src").CallState[];
        useSingleContractWithCallData: (chainId: number | undefined, latestBlockNumber: number | undefined, contract: import("ethers").Contract | null | undefined, callDatas: string[], options?: Partial<import("../src").ListenerOptionsWithGas> | undefined) => import("../src").CallState[];
        useSingleCallResult: (chainId: number | undefined, latestBlockNumber: number | undefined, contract: import("ethers").Contract | null | undefined, methodName: string, inputs?: (string | number | import("ethers").BigNumber | import("../src/validation").MethodArg[] | undefined)[] | undefined, options?: Partial<import("../src").ListenerOptionsWithGas> | undefined) => import("../src").CallState;
        useMultiChainMultiContractSingleData: (chainToBlockNumber: Record<number, number | undefined>, chainToAddresses: Record<number, (string | undefined)[]>, contractInterface: import("@ethersproject/abi").Interface, methodName: string, callInputs?: (string | number | import("ethers").BigNumber | import("../src/validation").MethodArg[] | undefined)[] | undefined, options?: Partial<import("../src").ListenerOptionsWithGas> | undefined) => Record<number, import("../src").CallState[]>;
        useMultiChainSingleContractSingleData: (chainToBlockNumber: Record<number, number | undefined>, chainToAddress: Record<number, string | undefined>, contractInterface: import("@ethersproject/abi").Interface, methodName: string, callInputs?: (string | number | import("ethers").BigNumber | import("../src/validation").MethodArg[] | undefined)[] | undefined, options?: Partial<import("../src").ListenerOptionsWithGas> | undefined) => Record<number, import("../src").CallState>;
    };
    Updater: (props: Pick<import("../src/updater").UpdaterProps, "listenerOptions" | "chainId" | "latestBlockNumber" | "contract" | "isDebug">) => JSX.Element;
};
export declare const useMultipleContractSingleData: (chainId: number | undefined, latestBlockNumber: number | undefined, addresses: (string | undefined)[], contractInterface: import("@ethersproject/abi").Interface, methodName: string, callInputs?: (string | number | import("ethers").BigNumber | import("../src/validation").MethodArg[] | undefined)[] | undefined, options?: Partial<import("../src").ListenerOptionsWithGas> | undefined) => import("../src").CallState[], useSingleCallResult: (chainId: number | undefined, latestBlockNumber: number | undefined, contract: import("ethers").Contract | null | undefined, methodName: string, inputs?: (string | number | import("ethers").BigNumber | import("../src/validation").MethodArg[] | undefined)[] | undefined, options?: Partial<import("../src").ListenerOptionsWithGas> | undefined) => import("../src").CallState, useSingleContractMultipleData: (chainId: number | undefined, latestBlockNumber: number | undefined, contract: import("ethers").Contract | null | undefined, methodName: string, callInputs: ((string | number | import("ethers").BigNumber | import("../src/validation").MethodArg[] | undefined)[] | undefined)[], options?: Partial<import("../src").ListenerOptionsWithGas> | undefined) => import("../src").CallState[], useSingleContractWithCallData: (chainId: number | undefined, latestBlockNumber: number | undefined, contract: import("ethers").Contract | null | undefined, callDatas: string[], options?: Partial<import("../src").ListenerOptionsWithGas> | undefined) => import("../src").CallState[], useMultiChainMultiContractSingleData: (chainToBlockNumber: Record<number, number | undefined>, chainToAddresses: Record<number, (string | undefined)[]>, contractInterface: import("@ethersproject/abi").Interface, methodName: string, callInputs?: (string | number | import("ethers").BigNumber | import("../src/validation").MethodArg[] | undefined)[] | undefined, options?: Partial<import("../src").ListenerOptionsWithGas> | undefined) => Record<number, import("../src").CallState[]>, useMultiChainSingleContractSingleData: (chainToBlockNumber: Record<number, number | undefined>, chainToAddress: Record<number, string | undefined>, contractInterface: import("@ethersproject/abi").Interface, methodName: string, callInputs?: (string | number | import("ethers").BigNumber | import("../src/validation").MethodArg[] | undefined)[] | undefined, options?: Partial<import("../src").ListenerOptionsWithGas> | undefined) => Record<number, import("../src").CallState>;
