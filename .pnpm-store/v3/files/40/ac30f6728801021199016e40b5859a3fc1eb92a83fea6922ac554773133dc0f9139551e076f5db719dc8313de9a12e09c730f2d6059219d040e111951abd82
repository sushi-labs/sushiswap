/// <reference types="node" />
import { Address } from 'ethereumjs-util';
export default class TransientStorage {
    /**
     * The current values of the transient storage, keyed by contract address and then slot
     */
    private _storage;
    /**
     * Each change to storage is recorded in the journal. This is never cleared.
     */
    private _changeJournal;
    /**
     * The length of the journal at the beginning of each call in the call stack.
     */
    private _indices;
    /**
     * Get the value for the given address and key
     * @param addr the address for which transient storage is accessed
     * @param key the key of the address to get
     */
    get(addr: Address, key: Buffer): Buffer;
    /**
     * Put the given value for the address and key
     * @param addr the address of the contract for which the key is being set
     * @param key the slot to set for the address
     * @param value the new value of the transient storage slot to set
     */
    put(addr: Address, key: Buffer, value: Buffer): void;
    /**
     * Commit all the changes since the last checkpoint
     */
    commit(): void;
    /**
     * To be called whenever entering a new context. If revert is called after checkpoint, all changes after the latest checkpoint are reverted.
     */
    checkpoint(): void;
    /**
     * Revert transient storage to the last checkpoint
     */
    revert(): void;
    /**
     * Create a JSON representation of the current transient storage state
     */
    toJSON(): {
        [address: string]: {
            [key: string]: string;
        };
    };
}
