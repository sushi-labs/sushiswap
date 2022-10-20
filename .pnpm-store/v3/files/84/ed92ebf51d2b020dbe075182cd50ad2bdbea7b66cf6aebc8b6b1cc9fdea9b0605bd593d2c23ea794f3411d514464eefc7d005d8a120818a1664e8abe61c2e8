"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const merkle_patricia_tree_1 = require("merkle-patricia-tree");
const ethereumjs_util_1 = require("ethereumjs-util");
const cache_1 = __importDefault(require("./cache"));
const _1 = require("./");
const opcodes_1 = require("../evm/opcodes");
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
class DefaultStateManager extends _1.BaseStateManager {
    /**
     * Instantiate the StateManager interface.
     */
    constructor(opts = {}) {
        var _a;
        super(opts);
        this._trie = (_a = opts.trie) !== null && _a !== void 0 ? _a : new merkle_patricia_tree_1.SecureTrie();
        this._storageTries = {};
        /*
         * For a custom StateManager implementation adopt these
         * callbacks passed to the `Cache` instantiated to perform
         * the `get`, `put` and `delete` operations with the
         * desired backend.
         */
        const getCb = async (address) => {
            const rlp = await this._trie.get(address.buf);
            return rlp ? ethereumjs_util_1.Account.fromRlpSerializedAccount(rlp) : undefined;
        };
        const putCb = async (keyBuf, accountRlp) => {
            const trie = this._trie;
            await trie.put(keyBuf, accountRlp);
        };
        const deleteCb = async (keyBuf) => {
            const trie = this._trie;
            await trie.del(keyBuf);
        };
        this._cache = new cache_1.default({ getCb, putCb, deleteCb });
    }
    /**
     * Copies the current instance of the `StateManager`
     * at the last fully committed point, i.e. as if all current
     * checkpoints were reverted.
     */
    copy() {
        return new DefaultStateManager({
            trie: this._trie.copy(false),
            common: this._common,
        });
    }
    /**
     * Adds `value` to the state trie as code, and sets `codeHash` on the account
     * corresponding to `address` to reference this.
     * @param address - Address of the `account` to add the `code` for
     * @param value - The value of the `code`
     */
    async putContractCode(address, value) {
        const codeHash = (0, ethereumjs_util_1.keccak256)(value);
        if (codeHash.equals(ethereumjs_util_1.KECCAK256_NULL)) {
            return;
        }
        await this._trie.db.put(codeHash, value);
        const account = await this.getAccount(address);
        if (this.DEBUG) {
            this._debug(`Update codeHash (-> ${(0, opcodes_1.short)(codeHash)}) for account ${address}`);
        }
        account.codeHash = codeHash;
        await this.putAccount(address, account);
    }
    /**
     * Gets the code corresponding to the provided `address`.
     * @param address - Address to get the `code` for
     * @returns {Promise<Buffer>} -  Resolves with the code corresponding to the provided address.
     * Returns an empty `Buffer` if the account has no associated code.
     */
    async getContractCode(address) {
        const account = await this.getAccount(address);
        if (!account.isContract()) {
            return Buffer.alloc(0);
        }
        const code = await this._trie.db.get(account.codeHash);
        return code !== null && code !== void 0 ? code : Buffer.alloc(0);
    }
    /**
     * Creates a storage trie from the primary storage trie
     * for an account and saves this in the storage cache.
     * @private
     */
    async _lookupStorageTrie(address) {
        // from state trie
        const account = await this.getAccount(address);
        const storageTrie = this._trie.copy(false);
        storageTrie.root = account.stateRoot;
        storageTrie.db.checkpoints = [];
        return storageTrie;
    }
    /**
     * Gets the storage trie for an account from the storage
     * cache or does a lookup.
     * @private
     */
    async _getStorageTrie(address) {
        // from storage cache
        const addressHex = address.buf.toString('hex');
        let storageTrie = this._storageTries[addressHex];
        if (!storageTrie) {
            // lookup from state
            storageTrie = await this._lookupStorageTrie(address);
        }
        return storageTrie;
    }
    /**
     * Gets the storage value associated with the provided `address` and `key`. This method returns
     * the shortest representation of the stored value.
     * @param address -  Address of the account to get the storage for
     * @param key - Key in the account's storage to get the value for. Must be 32 bytes long.
     * @returns {Promise<Buffer>} - The storage value for the account
     * corresponding to the provided address at the provided key.
     * If this does not exist an empty `Buffer` is returned.
     */
    async getContractStorage(address, key) {
        if (key.length !== 32) {
            throw new Error('Storage key must be 32 bytes long');
        }
        const trie = await this._getStorageTrie(address);
        const value = await trie.get(key);
        const decoded = ethereumjs_util_1.rlp.decode(value);
        return decoded;
    }
    /**
     * Modifies the storage trie of an account.
     * @private
     * @param address -  Address of the account whose storage is to be modified
     * @param modifyTrie - Function to modify the storage trie of the account
     */
    async _modifyContractStorage(address, modifyTrie) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve) => {
            const storageTrie = await this._getStorageTrie(address);
            modifyTrie(storageTrie, async () => {
                // update storage cache
                const addressHex = address.buf.toString('hex');
                this._storageTries[addressHex] = storageTrie;
                // update contract stateRoot
                const contract = this._cache.get(address);
                contract.stateRoot = storageTrie.root;
                await this.putAccount(address, contract);
                this.touchAccount(address);
                resolve();
            });
        });
    }
    /**
     * Adds value to the state trie for the `account`
     * corresponding to `address` at the provided `key`.
     * @param address -  Address to set a storage value for
     * @param key - Key to set the value at. Must be 32 bytes long.
     * @param value - Value to set at `key` for account corresponding to `address`. Cannot be more than 32 bytes. Leading zeros are stripped. If it is a empty or filled with zeros, deletes the value.
     */
    async putContractStorage(address, key, value) {
        if (key.length !== 32) {
            throw new Error('Storage key must be 32 bytes long');
        }
        if (value.length > 32) {
            throw new Error('Storage value cannot be longer than 32 bytes');
        }
        value = (0, ethereumjs_util_1.unpadBuffer)(value);
        await this._modifyContractStorage(address, async (storageTrie, done) => {
            if (value && value.length) {
                // format input
                const encodedValue = ethereumjs_util_1.rlp.encode(value);
                if (this.DEBUG) {
                    this._debug(`Update contract storage for account ${address} to ${(0, opcodes_1.short)(value)}`);
                }
                await storageTrie.put(key, encodedValue);
            }
            else {
                // deleting a value
                if (this.DEBUG) {
                    this._debug(`Delete contract storage for account`);
                }
                await storageTrie.del(key);
            }
            done();
        });
    }
    /**
     * Clears all storage entries for the account corresponding to `address`.
     * @param address -  Address to clear the storage of
     */
    async clearContractStorage(address) {
        await this._modifyContractStorage(address, (storageTrie, done) => {
            storageTrie.root = storageTrie.EMPTY_TRIE_ROOT;
            done();
        });
    }
    /**
     * Checkpoints the current state of the StateManager instance.
     * State changes that follow can then be committed by calling
     * `commit` or `reverted` by calling rollback.
     */
    async checkpoint() {
        this._trie.checkpoint();
        await super.checkpoint();
    }
    /**
     * Commits the current change-set to the instance since the
     * last call to checkpoint.
     */
    async commit() {
        // setup trie checkpointing
        await this._trie.commit();
        await super.commit();
    }
    /**
     * Reverts the current change-set to the instance since the
     * last call to checkpoint.
     */
    async revert() {
        // setup trie checkpointing
        await this._trie.revert();
        this._storageTries = {};
        await super.revert();
    }
    /**
     * Get an EIP-1186 proof
     * @param address address to get proof of
     * @param storageSlots storage slots to get proof of
     */
    async getProof(address, storageSlots = []) {
        const account = await this.getAccount(address);
        const accountProof = (await merkle_patricia_tree_1.SecureTrie.createProof(this._trie, address.buf)).map((p) => (0, ethereumjs_util_1.bufferToHex)(p));
        const storageProof = [];
        const storageTrie = await this._getStorageTrie(address);
        for (const storageKey of storageSlots) {
            const proof = (await merkle_patricia_tree_1.SecureTrie.createProof(storageTrie, storageKey)).map((p) => (0, ethereumjs_util_1.bufferToHex)(p));
            let value = (0, ethereumjs_util_1.bufferToHex)(await this.getContractStorage(address, storageKey));
            if (value === '0x') {
                value = '0x0';
            }
            const proofItem = {
                key: (0, ethereumjs_util_1.bufferToHex)(storageKey),
                value,
                proof,
            };
            storageProof.push(proofItem);
        }
        const returnValue = {
            address: address.toString(),
            balance: (0, ethereumjs_util_1.bnToHex)(account.balance),
            codeHash: (0, ethereumjs_util_1.bufferToHex)(account.codeHash),
            nonce: (0, ethereumjs_util_1.bnToHex)(account.nonce),
            storageHash: (0, ethereumjs_util_1.bufferToHex)(account.stateRoot),
            accountProof,
            storageProof,
        };
        return returnValue;
    }
    /**
     * Verify an EIP-1186 proof. Throws if proof is invalid, otherwise returns true.
     * @param proof the proof to prove
     */
    async verifyProof(proof) {
        const rootHash = (0, ethereumjs_util_1.keccak256)((0, ethereumjs_util_1.toBuffer)(proof.accountProof[0]));
        const key = (0, ethereumjs_util_1.toBuffer)(proof.address);
        const accountProof = proof.accountProof.map((rlpString) => (0, ethereumjs_util_1.toBuffer)(rlpString));
        // This returns the account if the proof is valid.
        // Verify that it matches the reported account.
        const value = await merkle_patricia_tree_1.SecureTrie.verifyProof(rootHash, key, accountProof);
        if (value === null) {
            // Verify that the account is empty in the proof.
            const emptyBuffer = Buffer.from('');
            const notEmptyErrorMsg = 'Invalid proof provided: account is not empty';
            const nonce = (0, ethereumjs_util_1.unpadBuffer)((0, ethereumjs_util_1.toBuffer)(proof.nonce));
            if (!nonce.equals(emptyBuffer)) {
                throw new Error(`${notEmptyErrorMsg} (nonce is not zero)`);
            }
            const balance = (0, ethereumjs_util_1.unpadBuffer)((0, ethereumjs_util_1.toBuffer)(proof.balance));
            if (!balance.equals(emptyBuffer)) {
                throw new Error(`${notEmptyErrorMsg} (balance is not zero)`);
            }
            const storageHash = (0, ethereumjs_util_1.toBuffer)(proof.storageHash);
            if (!storageHash.equals(ethereumjs_util_1.KECCAK256_RLP)) {
                throw new Error(`${notEmptyErrorMsg} (storageHash does not equal KECCAK256_RLP)`);
            }
            const codeHash = (0, ethereumjs_util_1.toBuffer)(proof.codeHash);
            if (!codeHash.equals(ethereumjs_util_1.KECCAK256_NULL)) {
                throw new Error(`${notEmptyErrorMsg} (codeHash does not equal KECCAK256_NULL)`);
            }
        }
        else {
            const account = ethereumjs_util_1.Account.fromRlpSerializedAccount(value);
            const { nonce, balance, stateRoot, codeHash } = account;
            const invalidErrorMsg = 'Invalid proof provided:';
            if (!nonce.eq(new ethereumjs_util_1.BN((0, ethereumjs_util_1.toBuffer)(proof.nonce)))) {
                throw new Error(`${invalidErrorMsg} nonce does not match`);
            }
            if (!balance.eq(new ethereumjs_util_1.BN((0, ethereumjs_util_1.toBuffer)(proof.balance)))) {
                throw new Error(`${invalidErrorMsg} balance does not match`);
            }
            if (!stateRoot.equals((0, ethereumjs_util_1.toBuffer)(proof.storageHash))) {
                throw new Error(`${invalidErrorMsg} storageHash does not match`);
            }
            if (!codeHash.equals((0, ethereumjs_util_1.toBuffer)(proof.codeHash))) {
                throw new Error(`${invalidErrorMsg} codeHash does not match`);
            }
        }
        const storageRoot = (0, ethereumjs_util_1.toBuffer)(proof.storageHash);
        for (const stProof of proof.storageProof) {
            const storageProof = stProof.proof.map((value) => (0, ethereumjs_util_1.toBuffer)(value));
            const storageValue = (0, ethereumjs_util_1.setLengthLeft)((0, ethereumjs_util_1.toBuffer)(stProof.value), 32);
            const storageKey = (0, ethereumjs_util_1.toBuffer)(stProof.key);
            const proofValue = await merkle_patricia_tree_1.SecureTrie.verifyProof(storageRoot, storageKey, storageProof);
            const reportedValue = (0, ethereumjs_util_1.setLengthLeft)(ethereumjs_util_1.rlp.decode(proofValue), 32);
            if (!reportedValue.equals(storageValue)) {
                throw new Error('Reported trie value does not match storage');
            }
        }
        return true;
    }
    /**
     * Gets the state-root of the Merkle-Patricia trie representation
     * of the state of this StateManager. Will error if there are uncommitted
     * checkpoints on the instance.
     * @returns {Promise<Buffer>} - Returns the state-root of the `StateManager`
     */
    async getStateRoot() {
        await this._cache.flush();
        const stateRoot = this._trie.root;
        return stateRoot;
    }
    /**
     * Sets the state of the instance to that represented
     * by the provided `stateRoot`. Will error if there are uncommitted
     * checkpoints on the instance or if the state root does not exist in
     * the state trie.
     * @param stateRoot - The state-root to reset the instance to
     */
    async setStateRoot(stateRoot) {
        if (this._checkpointCount !== 0) {
            throw new Error('Cannot set state root with uncommitted checkpoints');
        }
        await this._cache.flush();
        if (!stateRoot.equals(this._trie.EMPTY_TRIE_ROOT)) {
            const hasRoot = await this._trie.checkRoot(stateRoot);
            if (!hasRoot) {
                throw new Error('State trie does not contain state root');
            }
        }
        this._trie.root = stateRoot;
        this._cache.clear();
        this._storageTries = {};
    }
    /**
     * Dumps the RLP-encoded storage values for an `account` specified by `address`.
     * @param address - The address of the `account` to return storage for
     * @returns {Promise<StorageDump>} - The state of the account as an `Object` map.
     * Keys are are the storage keys, values are the storage values as strings.
     * Both are represented as hex strings without the `0x` prefix.
     */
    async dumpStorage(address) {
        return new Promise((resolve, reject) => {
            this._getStorageTrie(address)
                .then((trie) => {
                const storage = {};
                const stream = trie.createReadStream();
                stream.on('data', (val) => {
                    storage[val.key.toString('hex')] = val.value.toString('hex');
                });
                stream.on('end', () => {
                    resolve(storage);
                });
            })
                .catch((e) => {
                reject(e);
            });
        });
    }
    /**
     * Checks whether the current instance has the canonical genesis state
     * for the configured chain parameters.
     * @returns {Promise<boolean>} - Whether the storage trie contains the
     * canonical genesis state for the configured chain parameters.
     */
    async hasGenesisState() {
        const root = this._common.genesis().stateRoot;
        return await this._trie.checkRoot((0, ethereumjs_util_1.toBuffer)(root));
    }
    /**
     * Checks whether there is a state corresponding to a stateRoot
     */
    async hasStateRoot(root) {
        return await this._trie.checkRoot(root);
    }
    /**
     * Checks if the `account` corresponding to `address`
     * exists
     * @param address - Address of the `account` to check
     */
    async accountExists(address) {
        const account = this._cache.lookup(address);
        if (account && !account.virtual && !this._cache.keyIsDeleted(address)) {
            return true;
        }
        if (await this._trie.get(address.buf)) {
            return true;
        }
        return false;
    }
}
exports.default = DefaultStateManager;
//# sourceMappingURL=stateManager.js.map