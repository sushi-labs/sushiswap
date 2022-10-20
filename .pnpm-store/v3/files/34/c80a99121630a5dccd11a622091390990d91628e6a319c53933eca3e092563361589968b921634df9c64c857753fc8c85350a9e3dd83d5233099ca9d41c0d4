/**
 * Tries to pack a list of items into as few bins as possible using the first-fit bin packing algorithm
 * @param calls the calls to chunk
 * @param chunkGasLimit the gas limit of any one chunk of calls, i.e. bin capacity
 * @param defaultGasRequired the default amount of gas an individual call should cost if not specified
 */
export default function chunkCalls<T extends {
    gasRequired?: number;
}>(calls: T[], chunkGasLimit: number, defaultGasRequired?: number): T[][];
