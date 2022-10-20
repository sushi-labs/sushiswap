import { PayloadAction } from '@reduxjs/toolkit';
import { MulticallFetchingPayload, MulticallListenerPayload, MulticallResultsPayload, MulticallState, MulticallListenerOptionsPayload } from './types';
export declare function createMulticallSlice(reducerPath: string): import("@reduxjs/toolkit").Slice<MulticallState, {
    addMulticallListeners: (state: import("immer/dist/internal").WritableDraft<MulticallState>, action: PayloadAction<MulticallListenerPayload>) => void;
    removeMulticallListeners: (state: import("immer/dist/internal").WritableDraft<MulticallState>, action: PayloadAction<MulticallListenerPayload>) => void;
    fetchingMulticallResults: (state: import("immer/dist/internal").WritableDraft<MulticallState>, action: PayloadAction<MulticallFetchingPayload>) => void;
    errorFetchingMulticallResults: (state: import("immer/dist/internal").WritableDraft<MulticallState>, action: PayloadAction<MulticallFetchingPayload>) => void;
    updateMulticallResults: (state: import("immer/dist/internal").WritableDraft<MulticallState>, action: PayloadAction<MulticallResultsPayload>) => void;
    updateListenerOptions: (state: import("immer/dist/internal").WritableDraft<MulticallState>, action: PayloadAction<MulticallListenerOptionsPayload>) => void;
}, string>;
export declare type MulticallActions = ReturnType<typeof createMulticallSlice>['actions'];
