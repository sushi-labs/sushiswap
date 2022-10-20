type QueuedTxs = {
    txHash: string,
    description: string,
    value: number,
    etaTs: number,
    etaDate: Date,
    functionName: string,
    data: string,
    targetAddress: string,
    createdBlock: number,
    createdTs: number,
    createdDate: Date,
    expiresTs: number,
    expiresDate: Date,
    createdTx: number,
}

export function queuedTxs({ minTimestamp, maxTimestamp, minBlock, maxBlock, max }?: {
    minTimestamp?: number;
    maxTimestamp?: number;
    minBlock?: number;
    maxBlock?: number;
    max?: number;
}): Promise<QueuedTxs[]>;



type CanceledTxs = {
    txHash: string,
    description: string,
    value: number,
    etaTs: number,
    etaDate: Date,
    functionName: string,
    data: string,
    targetAddress: string,
    createdBlock: number,
    createdTs: number,
    createdDate: Date,
    expiresTs: number,
    expiresDate: Date,
    canceledBlock: number | null,
    canceledTs: number | null,
    canceledDate: Date | null,
    createdTx: string,
    canceledTx: string,
}

export function canceledTxs({ minTimestamp, maxTimestamp, minBlock, maxBlock, max }?: {
    minTimestamp?: number;
    maxTimestamp?: number;
    minBlock?: number;
    maxBlock?: number;
    max?: number;
}): Promise<CanceledTxs[]>;



type ExecutedTxs = {
    txHash: string,
    description: string,
    value: number,
    etaTs: number,
    etaDate: Date,
    functionName: string,
    data: string,
    targetAddress: string,
    createdBlock: number,
    createdTs: number,
    createdDate: Date,
    expiresTs: number,
    expiresDate: Date,
    executedBlock: number | null,
    executedTs: number | null,
    executedDate: Date | null,
    createdTx: string,
    executedTx: string
}

export function executedTxs({ minTimestamp, maxTimestamp, minBlock, maxBlock, max }?: {
    minTimestamp?: number;
    maxTimestamp?: number;
    minBlock?: number;
    maxBlock?: number;
    max?: number;
}): Promise<ExecutedTxs[]>;



type AllTxs = {
    txHash: string,
    description: string,
    value: number,
    etaTs: number,
    etaDate: Date,
    functionName: string,
    data: string,
    targetAddress: string,
    isCanceled: string,
    isExecuted: string,
    createdBlock: number,
    createdTs: number,
    createdDate: Date,
    expiresTs: number,
    expiresDate: Date,
    canceledBlock: number | null,
    canceledTs: number | null,
    canceledDate: Date | null,
    executedTs: number | null,
    executedDate: Date | null,
    createdTx: string,
    canceledTx: string,
    executedTx: string
}

export function allTxs({ minTimestamp, maxTimestamp, minBlock, maxBlock, max }?: {
    minTimestamp?: number;
    maxTimestamp?: number;
    minBlock?: number;
    maxBlock?: number;
    max?: number;
}): Promise<AllTxs[]>;