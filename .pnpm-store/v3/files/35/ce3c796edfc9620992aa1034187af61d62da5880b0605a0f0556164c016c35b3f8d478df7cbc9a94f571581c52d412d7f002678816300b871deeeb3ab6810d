/// <reference types="node" />
import { SecureTrie as Trie } from 'merkle-patricia-tree';
import { Address, PrefixedHexString } from 'ethereumjs-util';
import Common from '@ethereumjs/common';
import { StateManager, StorageDump } from './interface';
import { BaseStateManager } from './';
declare type StorageProof = {
    key: PrefixedHexString;
    proof: PrefixedHexString[];
    value: PrefixedHexString;
};
export declare type Proof = {
    address: PrefixedHexString;
    balance: PrefixedHexString;
    codeHash: PrefixedHexString;
    nonce: PrefixedHexString;
    storageHash: PrefixedHexString;
    accountProof: PrefixedHexString[];
    storageProof: StorageProof[];
};
/**
 * Options for constructing a {@link StateManager}.
 */
export interface DefaultStateManagerOpts {
    /**
     * Parameters of the chain {@link Common}
     */
    common?: Common;
    /**
     * A {@link SecureTrie} instance
     */
    trie?: Trie;
}
/**
 * Default StateManager implementation for the VM.
 *
 * The state manager abstracts from the underlying data store
 * by providing higher level access to accounts, contract code
 * and storage slots.
 *
 * The default state manager implementation uses a
 * `merkle-patricia-tree` trie as a data backend.
 */
export default class DefaultStateManager extends BaseStateManager implements StateManager {
    _trie: Trie;
    _storageTries: {
        [key: string]: Trie;
    };
    /**
     * Instantiate the StateManager interface.
     */
    constructor(opts?: DefaultStateManagerOpts);
    /**
     * Copies the current instance of the `StateManager`
     * at the last fully committed point, i.e. as if all current
     * checkpoints were reverted.
     */
    copy(): StateManager;
    /**
     * Adds `value` to the state trie as code, and sets `codeHash` on the account
     * corresponding to `address` to reference this.
     * @param address - Address of the `account` to add the `code` for
     * @param value - The value of the `code`
     */
    putContractCode(address: Address, value: Buffer): Promise<void>;
    /**
     * Gets the code corresponding to the provided `address`.
     * @param address - Address to get the `code` for
     * @returns {Promise<Buffer>} -  Resolves with the code corresponding to the provided address.
     * Returns an empty `Buffer` if the account has no associated code.
     */
    getContractCode(address: Address): Promise<Buffer>;
    /**
     * Creates a storage trie from the primary storage trie
     * for an account and saves this in the storage cache.
     * @private
     */
    _lookupStorageTrie(address: Address): Promise<Trie>;
    /**
     * Gets the storage trie for an account from the storage
     * cache or does a lookup.
     * @private
     */
    _getStorageTrie(address: Address): Promise<Trie>;
    /**
     * Gets the storage value associated with the provided `address` and `key`. This method returns
     * the shortest representation of the stored value.
     * @param address -  Address of the account to get the storage for
     * @param key - Key in the account's storage to get the value for. Must be 32 bytes long.
     * @returns {Promise<Buffer>} - The storage value for the account
     * corresponding to the provided address at the provided key.
     * If this does not exist an empty `Buffer` is returned.
     */
    getContractStorage(address: Address, key: Buffer): Promise<Buffer>;
    /**
     * Modifies the storage trie of an account.
     * @private
     * @param address -  Address of the account whose storage is to be modified
     * @param modifyTrie - Function to modify the storage trie of the account
     */
    _modifyContractStorage(address: Address, modifyTrie: (storageTrie: Trie, done: Function) => void): Promise<void>;
    /**
     * Adds value to the state trie for the `account`
     * corresponding to `address` at the provided `key`.
     * @param address -  Address to set a storage value for
     * @param key - Key to set the value at. Must be 32 bytes long.
     * @param value - Value to set at `key` for account corresponding to `address`. Cannot be more than 32 bytes. Leading zeros are stripped. If it is a empty or filled with zeros, deletes the value.
     */
    putContractStorage(address: Address, key: Buffer, value: Buffer): Promise<void>;
    /**
     * Clears all storage entries for the account corresponding to `address`.
     * @param address -  Address to clear the storage of
     */
    clearContractStorage(address: Address): Promise<void>;
    /**
     * Checkpoints the current state of the StateManager instance.
     * State changes that follow can then be committed by calling
     * `commit` or `reverted` by calling rollback.
     */
    checkpoint(): Promise<void>;
    /**
     * Commits the current change-set to the instance since the
     * last call to checkpoint.
     */
    commit(): Promise<void>;
    /**
     * Reverts the current change-set to the instance since the
     * last call to checkpoint.
     */
    revert(): Promise<void>;
    /**
     * Get an EIP-1186 proof
     * @param address address to get proof of
     * @param storageSlots storage slots to get proof of
     */
    getProof(address: Address, storageSlots?: Buffer[]): Promise<Proof>;
    /**
     * Verify an EIP-1186 proof. Throws if proof is invalid, otherwise returns true.
     * @param proof the proof to prove
     */
    verifyProof(proof: Proof): Promise<boolean>;
    /**
     * Gets the state-root of the Merkle-Patricia trie representation
     * of the state of this StateManager. Will error if there are uncommitted
     * checkpoints on the instance.
     * @returns {Promise<Buffer>} - Returns the state-root of the `StateManager`
     */
    getStateRoot(): Promise<Buffer>;
    /**
     * Sets the state of the instance to that represented
     * by the provided `stateRoot`. Will error if there are uncommitted
     * checkpoints on the instance or if the state root does not exist in
     * the state trie.
     * @param stateRoot - The state-root to reset the instance to
     */
    setStateRoot(stateRoot: Buffer): Promise<void>;
    /**
     * Dumps the RLP-encoded storage values for an `account` specified by `address`.
     * @param address - The address of the `account` to return storage for
     * @returns {Promise<StorageDump>} - The state of the account as an `Object` map.
     * Keys are are the storage keys, values are the storage values as strings.
     * Both are represented as hex strings without the `0x` prefix.
     */
    dumpStorage(address: Address): Promise<StorageDump>;
    /**
     * Checks whether the current instance has the canonical genesis state
     * for the configured chain parameters.
     * @returns {Promise<boolean>} - Whether the storage trie contains the
     * canonical genesis state for the configured chain parameters.
     */
    hasGenesisState(): Promise<boolean>;
    /**
     * Checks whether there is a state corresponding to a stateRoot
     */
    hasStateRoot(root: Buffer): Promise<boolean>;
    /**
     * Checks if the `account` corresponding to `address`
     * exists
     * @param address - Address of the `account` to check
     */
    accountExists(address: Address): Promise<boolean>;
}
export {};
