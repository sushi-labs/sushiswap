"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var merkle_patricia_tree_1 = require("merkle-patricia-tree");
var ethereumjs_util_1 = require("ethereumjs-util");
var cache_1 = __importDefault(require("./cache"));
var _1 = require("./");
var opcodes_1 = require("../evm/opcodes");
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
var DefaultStateManager = /** @class */ (function (_super) {
    __extends(DefaultStateManager, _super);
    /**
     * Instantiate the StateManager interface.
     */
    function DefaultStateManager(opts) {
        if (opts === void 0) { opts = {}; }
        var _this = this;
        var _a;
        _this = _super.call(this, opts) || this;
        _this._trie = (_a = opts.trie) !== null && _a !== void 0 ? _a : new merkle_patricia_tree_1.SecureTrie();
        _this._storageTries = {};
        /*
         * For a custom StateManager implementation adopt these
         * callbacks passed to the `Cache` instantiated to perform
         * the `get`, `put` and `delete` operations with the
         * desired backend.
         */
        var getCb = function (address) { return __awaiter(_this, void 0, void 0, function () {
            var rlp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._trie.get(address.buf)];
                    case 1:
                        rlp = _a.sent();
                        return [2 /*return*/, rlp ? ethereumjs_util_1.Account.fromRlpSerializedAccount(rlp) : undefined];
                }
            });
        }); };
        var putCb = function (keyBuf, accountRlp) { return __awaiter(_this, void 0, void 0, function () {
            var trie;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        trie = this._trie;
                        return [4 /*yield*/, trie.put(keyBuf, accountRlp)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        var deleteCb = function (keyBuf) { return __awaiter(_this, void 0, void 0, function () {
            var trie;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        trie = this._trie;
                        return [4 /*yield*/, trie.del(keyBuf)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        _this._cache = new cache_1.default({ getCb: getCb, putCb: putCb, deleteCb: deleteCb });
        return _this;
    }
    /**
     * Copies the current instance of the `StateManager`
     * at the last fully committed point, i.e. as if all current
     * checkpoints were reverted.
     */
    DefaultStateManager.prototype.copy = function () {
        return new DefaultStateManager({
            trie: this._trie.copy(false),
            common: this._common,
        });
    };
    /**
     * Adds `value` to the state trie as code, and sets `codeHash` on the account
     * corresponding to `address` to reference this.
     * @param address - Address of the `account` to add the `code` for
     * @param value - The value of the `code`
     */
    DefaultStateManager.prototype.putContractCode = function (address, value) {
        return __awaiter(this, void 0, void 0, function () {
            var codeHash, account;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        codeHash = (0, ethereumjs_util_1.keccak256)(value);
                        if (codeHash.equals(ethereumjs_util_1.KECCAK256_NULL)) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this._trie.db.put(codeHash, value)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getAccount(address)];
                    case 2:
                        account = _a.sent();
                        if (this.DEBUG) {
                            this._debug("Update codeHash (-> ".concat((0, opcodes_1.short)(codeHash), ") for account ").concat(address));
                        }
                        account.codeHash = codeHash;
                        return [4 /*yield*/, this.putAccount(address, account)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets the code corresponding to the provided `address`.
     * @param address - Address to get the `code` for
     * @returns {Promise<Buffer>} -  Resolves with the code corresponding to the provided address.
     * Returns an empty `Buffer` if the account has no associated code.
     */
    DefaultStateManager.prototype.getContractCode = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var account, code;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAccount(address)];
                    case 1:
                        account = _a.sent();
                        if (!account.isContract()) {
                            return [2 /*return*/, Buffer.alloc(0)];
                        }
                        return [4 /*yield*/, this._trie.db.get(account.codeHash)];
                    case 2:
                        code = _a.sent();
                        return [2 /*return*/, code !== null && code !== void 0 ? code : Buffer.alloc(0)];
                }
            });
        });
    };
    /**
     * Creates a storage trie from the primary storage trie
     * for an account and saves this in the storage cache.
     * @private
     */
    DefaultStateManager.prototype._lookupStorageTrie = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var account, storageTrie;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAccount(address)];
                    case 1:
                        account = _a.sent();
                        storageTrie = this._trie.copy(false);
                        storageTrie.root = account.stateRoot;
                        storageTrie.db.checkpoints = [];
                        return [2 /*return*/, storageTrie];
                }
            });
        });
    };
    /**
     * Gets the storage trie for an account from the storage
     * cache or does a lookup.
     * @private
     */
    DefaultStateManager.prototype._getStorageTrie = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var addressHex, storageTrie;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        addressHex = address.buf.toString('hex');
                        storageTrie = this._storageTries[addressHex];
                        if (!!storageTrie) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._lookupStorageTrie(address)];
                    case 1:
                        // lookup from state
                        storageTrie = _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, storageTrie];
                }
            });
        });
    };
    /**
     * Gets the storage value associated with the provided `address` and `key`. This method returns
     * the shortest representation of the stored value.
     * @param address -  Address of the account to get the storage for
     * @param key - Key in the account's storage to get the value for. Must be 32 bytes long.
     * @returns {Promise<Buffer>} - The storage value for the account
     * corresponding to the provided address at the provided key.
     * If this does not exist an empty `Buffer` is returned.
     */
    DefaultStateManager.prototype.getContractStorage = function (address, key) {
        return __awaiter(this, void 0, void 0, function () {
            var trie, value, decoded;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (key.length !== 32) {
                            throw new Error('Storage key must be 32 bytes long');
                        }
                        return [4 /*yield*/, this._getStorageTrie(address)];
                    case 1:
                        trie = _a.sent();
                        return [4 /*yield*/, trie.get(key)];
                    case 2:
                        value = _a.sent();
                        decoded = ethereumjs_util_1.rlp.decode(value);
                        return [2 /*return*/, decoded];
                }
            });
        });
    };
    /**
     * Modifies the storage trie of an account.
     * @private
     * @param address -  Address of the account whose storage is to be modified
     * @param modifyTrie - Function to modify the storage trie of the account
     */
    DefaultStateManager.prototype._modifyContractStorage = function (address, modifyTrie) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // eslint-disable-next-line no-async-promise-executor
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var storageTrie;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this._getStorageTrie(address)];
                                case 1:
                                    storageTrie = _a.sent();
                                    modifyTrie(storageTrie, function () { return __awaiter(_this, void 0, void 0, function () {
                                        var addressHex, contract;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    addressHex = address.buf.toString('hex');
                                                    this._storageTries[addressHex] = storageTrie;
                                                    contract = this._cache.get(address);
                                                    contract.stateRoot = storageTrie.root;
                                                    return [4 /*yield*/, this.putAccount(address, contract)];
                                                case 1:
                                                    _a.sent();
                                                    this.touchAccount(address);
                                                    resolve();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * Adds value to the state trie for the `account`
     * corresponding to `address` at the provided `key`.
     * @param address -  Address to set a storage value for
     * @param key - Key to set the value at. Must be 32 bytes long.
     * @param value - Value to set at `key` for account corresponding to `address`. Cannot be more than 32 bytes. Leading zeros are stripped. If it is a empty or filled with zeros, deletes the value.
     */
    DefaultStateManager.prototype.putContractStorage = function (address, key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (key.length !== 32) {
                            throw new Error('Storage key must be 32 bytes long');
                        }
                        if (value.length > 32) {
                            throw new Error('Storage value cannot be longer than 32 bytes');
                        }
                        value = (0, ethereumjs_util_1.unpadBuffer)(value);
                        return [4 /*yield*/, this._modifyContractStorage(address, function (storageTrie, done) { return __awaiter(_this, void 0, void 0, function () {
                                var encodedValue;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(value && value.length)) return [3 /*break*/, 2];
                                            encodedValue = ethereumjs_util_1.rlp.encode(value);
                                            if (this.DEBUG) {
                                                this._debug("Update contract storage for account ".concat(address, " to ").concat((0, opcodes_1.short)(value)));
                                            }
                                            return [4 /*yield*/, storageTrie.put(key, encodedValue)];
                                        case 1:
                                            _a.sent();
                                            return [3 /*break*/, 4];
                                        case 2:
                                            // deleting a value
                                            if (this.DEBUG) {
                                                this._debug("Delete contract storage for account");
                                            }
                                            return [4 /*yield*/, storageTrie.del(key)];
                                        case 3:
                                            _a.sent();
                                            _a.label = 4;
                                        case 4:
                                            done();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Clears all storage entries for the account corresponding to `address`.
     * @param address -  Address to clear the storage of
     */
    DefaultStateManager.prototype.clearContractStorage = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._modifyContractStorage(address, function (storageTrie, done) {
                            storageTrie.root = storageTrie.EMPTY_TRIE_ROOT;
                            done();
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Checkpoints the current state of the StateManager instance.
     * State changes that follow can then be committed by calling
     * `commit` or `reverted` by calling rollback.
     */
    DefaultStateManager.prototype.checkpoint = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._trie.checkpoint();
                        return [4 /*yield*/, _super.prototype.checkpoint.call(this)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Commits the current change-set to the instance since the
     * last call to checkpoint.
     */
    DefaultStateManager.prototype.commit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // setup trie checkpointing
                    return [4 /*yield*/, this._trie.commit()];
                    case 1:
                        // setup trie checkpointing
                        _a.sent();
                        return [4 /*yield*/, _super.prototype.commit.call(this)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Reverts the current change-set to the instance since the
     * last call to checkpoint.
     */
    DefaultStateManager.prototype.revert = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // setup trie checkpointing
                    return [4 /*yield*/, this._trie.revert()];
                    case 1:
                        // setup trie checkpointing
                        _a.sent();
                        this._storageTries = {};
                        return [4 /*yield*/, _super.prototype.revert.call(this)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get an EIP-1186 proof
     * @param address address to get proof of
     * @param storageSlots storage slots to get proof of
     */
    DefaultStateManager.prototype.getProof = function (address, storageSlots) {
        if (storageSlots === void 0) { storageSlots = []; }
        return __awaiter(this, void 0, void 0, function () {
            var account, accountProof, storageProof, storageTrie, storageSlots_1, storageSlots_1_1, storageKey, proof, value, _a, proofItem, e_1_1, returnValue;
            var e_1, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getAccount(address)];
                    case 1:
                        account = _c.sent();
                        return [4 /*yield*/, merkle_patricia_tree_1.SecureTrie.createProof(this._trie, address.buf)];
                    case 2:
                        accountProof = (_c.sent()).map(function (p) { return (0, ethereumjs_util_1.bufferToHex)(p); });
                        storageProof = [];
                        return [4 /*yield*/, this._getStorageTrie(address)];
                    case 3:
                        storageTrie = _c.sent();
                        _c.label = 4;
                    case 4:
                        _c.trys.push([4, 10, 11, 12]);
                        storageSlots_1 = __values(storageSlots), storageSlots_1_1 = storageSlots_1.next();
                        _c.label = 5;
                    case 5:
                        if (!!storageSlots_1_1.done) return [3 /*break*/, 9];
                        storageKey = storageSlots_1_1.value;
                        return [4 /*yield*/, merkle_patricia_tree_1.SecureTrie.createProof(storageTrie, storageKey)];
                    case 6:
                        proof = (_c.sent()).map(function (p) { return (0, ethereumjs_util_1.bufferToHex)(p); });
                        _a = ethereumjs_util_1.bufferToHex;
                        return [4 /*yield*/, this.getContractStorage(address, storageKey)];
                    case 7:
                        value = _a.apply(void 0, [_c.sent()]);
                        if (value === '0x') {
                            value = '0x0';
                        }
                        proofItem = {
                            key: (0, ethereumjs_util_1.bufferToHex)(storageKey),
                            value: value,
                            proof: proof,
                        };
                        storageProof.push(proofItem);
                        _c.label = 8;
                    case 8:
                        storageSlots_1_1 = storageSlots_1.next();
                        return [3 /*break*/, 5];
                    case 9: return [3 /*break*/, 12];
                    case 10:
                        e_1_1 = _c.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 12];
                    case 11:
                        try {
                            if (storageSlots_1_1 && !storageSlots_1_1.done && (_b = storageSlots_1.return)) _b.call(storageSlots_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 12:
                        returnValue = {
                            address: address.toString(),
                            balance: (0, ethereumjs_util_1.bnToHex)(account.balance),
                            codeHash: (0, ethereumjs_util_1.bufferToHex)(account.codeHash),
                            nonce: (0, ethereumjs_util_1.bnToHex)(account.nonce),
                            storageHash: (0, ethereumjs_util_1.bufferToHex)(account.stateRoot),
                            accountProof: accountProof,
                            storageProof: storageProof,
                        };
                        return [2 /*return*/, returnValue];
                }
            });
        });
    };
    /**
     * Verify an EIP-1186 proof. Throws if proof is invalid, otherwise returns true.
     * @param proof the proof to prove
     */
    DefaultStateManager.prototype.verifyProof = function (proof) {
        return __awaiter(this, void 0, void 0, function () {
            var rootHash, key, accountProof, value, emptyBuffer, notEmptyErrorMsg, nonce, balance, storageHash, codeHash, account, nonce, balance, stateRoot, codeHash, invalidErrorMsg, storageRoot, _a, _b, stProof, storageProof, storageValue, storageKey, proofValue, reportedValue, e_2_1;
            var e_2, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        rootHash = (0, ethereumjs_util_1.keccak256)((0, ethereumjs_util_1.toBuffer)(proof.accountProof[0]));
                        key = (0, ethereumjs_util_1.toBuffer)(proof.address);
                        accountProof = proof.accountProof.map(function (rlpString) {
                            return (0, ethereumjs_util_1.toBuffer)(rlpString);
                        });
                        return [4 /*yield*/, merkle_patricia_tree_1.SecureTrie.verifyProof(rootHash, key, accountProof)];
                    case 1:
                        value = _d.sent();
                        if (value === null) {
                            emptyBuffer = Buffer.from('');
                            notEmptyErrorMsg = 'Invalid proof provided: account is not empty';
                            nonce = (0, ethereumjs_util_1.unpadBuffer)((0, ethereumjs_util_1.toBuffer)(proof.nonce));
                            if (!nonce.equals(emptyBuffer)) {
                                throw new Error("".concat(notEmptyErrorMsg, " (nonce is not zero)"));
                            }
                            balance = (0, ethereumjs_util_1.unpadBuffer)((0, ethereumjs_util_1.toBuffer)(proof.balance));
                            if (!balance.equals(emptyBuffer)) {
                                throw new Error("".concat(notEmptyErrorMsg, " (balance is not zero)"));
                            }
                            storageHash = (0, ethereumjs_util_1.toBuffer)(proof.storageHash);
                            if (!storageHash.equals(ethereumjs_util_1.KECCAK256_RLP)) {
                                throw new Error("".concat(notEmptyErrorMsg, " (storageHash does not equal KECCAK256_RLP)"));
                            }
                            codeHash = (0, ethereumjs_util_1.toBuffer)(proof.codeHash);
                            if (!codeHash.equals(ethereumjs_util_1.KECCAK256_NULL)) {
                                throw new Error("".concat(notEmptyErrorMsg, " (codeHash does not equal KECCAK256_NULL)"));
                            }
                        }
                        else {
                            account = ethereumjs_util_1.Account.fromRlpSerializedAccount(value);
                            nonce = account.nonce, balance = account.balance, stateRoot = account.stateRoot, codeHash = account.codeHash;
                            invalidErrorMsg = 'Invalid proof provided:';
                            if (!nonce.eq(new ethereumjs_util_1.BN((0, ethereumjs_util_1.toBuffer)(proof.nonce)))) {
                                throw new Error("".concat(invalidErrorMsg, " nonce does not match"));
                            }
                            if (!balance.eq(new ethereumjs_util_1.BN((0, ethereumjs_util_1.toBuffer)(proof.balance)))) {
                                throw new Error("".concat(invalidErrorMsg, " balance does not match"));
                            }
                            if (!stateRoot.equals((0, ethereumjs_util_1.toBuffer)(proof.storageHash))) {
                                throw new Error("".concat(invalidErrorMsg, " storageHash does not match"));
                            }
                            if (!codeHash.equals((0, ethereumjs_util_1.toBuffer)(proof.codeHash))) {
                                throw new Error("".concat(invalidErrorMsg, " codeHash does not match"));
                            }
                        }
                        storageRoot = (0, ethereumjs_util_1.toBuffer)(proof.storageHash);
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 7, 8, 9]);
                        _a = __values(proof.storageProof), _b = _a.next();
                        _d.label = 3;
                    case 3:
                        if (!!_b.done) return [3 /*break*/, 6];
                        stProof = _b.value;
                        storageProof = stProof.proof.map(function (value) { return (0, ethereumjs_util_1.toBuffer)(value); });
                        storageValue = (0, ethereumjs_util_1.setLengthLeft)((0, ethereumjs_util_1.toBuffer)(stProof.value), 32);
                        storageKey = (0, ethereumjs_util_1.toBuffer)(stProof.key);
                        return [4 /*yield*/, merkle_patricia_tree_1.SecureTrie.verifyProof(storageRoot, storageKey, storageProof)];
                    case 4:
                        proofValue = _d.sent();
                        reportedValue = (0, ethereumjs_util_1.setLengthLeft)(ethereumjs_util_1.rlp.decode(proofValue), 32);
                        if (!reportedValue.equals(storageValue)) {
                            throw new Error('Reported trie value does not match storage');
                        }
                        _d.label = 5;
                    case 5:
                        _b = _a.next();
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_2_1 = _d.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Gets the state-root of the Merkle-Patricia trie representation
     * of the state of this StateManager. Will error if there are uncommitted
     * checkpoints on the instance.
     * @returns {Promise<Buffer>} - Returns the state-root of the `StateManager`
     */
    DefaultStateManager.prototype.getStateRoot = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stateRoot;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._cache.flush()];
                    case 1:
                        _a.sent();
                        stateRoot = this._trie.root;
                        return [2 /*return*/, stateRoot];
                }
            });
        });
    };
    /**
     * Sets the state of the instance to that represented
     * by the provided `stateRoot`. Will error if there are uncommitted
     * checkpoints on the instance or if the state root does not exist in
     * the state trie.
     * @param stateRoot - The state-root to reset the instance to
     */
    DefaultStateManager.prototype.setStateRoot = function (stateRoot) {
        return __awaiter(this, void 0, void 0, function () {
            var hasRoot;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this._checkpointCount !== 0) {
                            throw new Error('Cannot set state root with uncommitted checkpoints');
                        }
                        return [4 /*yield*/, this._cache.flush()];
                    case 1:
                        _a.sent();
                        if (!!stateRoot.equals(this._trie.EMPTY_TRIE_ROOT)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._trie.checkRoot(stateRoot)];
                    case 2:
                        hasRoot = _a.sent();
                        if (!hasRoot) {
                            throw new Error('State trie does not contain state root');
                        }
                        _a.label = 3;
                    case 3:
                        this._trie.root = stateRoot;
                        this._cache.clear();
                        this._storageTries = {};
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Dumps the RLP-encoded storage values for an `account` specified by `address`.
     * @param address - The address of the `account` to return storage for
     * @returns {Promise<StorageDump>} - The state of the account as an `Object` map.
     * Keys are are the storage keys, values are the storage values as strings.
     * Both are represented as hex strings without the `0x` prefix.
     */
    DefaultStateManager.prototype.dumpStorage = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this._getStorageTrie(address)
                            .then(function (trie) {
                            var storage = {};
                            var stream = trie.createReadStream();
                            stream.on('data', function (val) {
                                storage[val.key.toString('hex')] = val.value.toString('hex');
                            });
                            stream.on('end', function () {
                                resolve(storage);
                            });
                        })
                            .catch(function (e) {
                            reject(e);
                        });
                    })];
            });
        });
    };
    /**
     * Checks whether the current instance has the canonical genesis state
     * for the configured chain parameters.
     * @returns {Promise<boolean>} - Whether the storage trie contains the
     * canonical genesis state for the configured chain parameters.
     */
    DefaultStateManager.prototype.hasGenesisState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var root;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        root = this._common.genesis().stateRoot;
                        return [4 /*yield*/, this._trie.checkRoot((0, ethereumjs_util_1.toBuffer)(root))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Checks whether there is a state corresponding to a stateRoot
     */
    DefaultStateManager.prototype.hasStateRoot = function (root) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._trie.checkRoot(root)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Checks if the `account` corresponding to `address`
     * exists
     * @param address - Address of the `account` to check
     */
    DefaultStateManager.prototype.accountExists = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var account;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = this._cache.lookup(address);
                        if (account && !account.virtual && !this._cache.keyIsDeleted(address)) {
                            return [2 /*return*/, true];
                        }
                        return [4 /*yield*/, this._trie.get(address.buf)];
                    case 1:
                        if (_a.sent()) {
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    return DefaultStateManager;
}(_1.BaseStateManager));
exports.default = DefaultStateManager;
//# sourceMappingURL=stateManager.js.map