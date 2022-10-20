"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTypedDataSignatureCorrect = exports.isMessageSignatureCorrect = exports.getL2HashFromPriorityOp = exports.parseTransaction = exports.hashBytecode = exports.serialize = exports.checkBaseCost = exports.createAddress = exports.create2Address = exports.getDeployedContracts = exports.getHashedL2ToL1Msg = exports.layer1TxDefaults = exports.sleep = exports.isETH = exports.RECOMMENDED_GAS_LIMIT = exports.EIP712_TX_TYPE = exports.L1_MESSENGER_ADDRESS = exports.CONTRACT_DEPLOYER_ADDRESS = exports.BOOTLOADER_FORMAL_ADDRESS = exports.L2_BRIDGE_ABI = exports.L1_BRIDGE_ABI = exports.IERC20 = exports.L1_MESSENGER = exports.CONTRACT_DEPLOYER = exports.ZKSYNC_MAIN_ABI = exports.ETH_ADDRESS = void 0;
const ethers_1 = require("ethers");
const types_1 = require("./types");
const signer_1 = require("./signer");
exports.ETH_ADDRESS = '0x0000000000000000000000000000000000000000';
exports.ZKSYNC_MAIN_ABI = new ethers_1.utils.Interface(require('../../abi/IZkSync.json').abi);
exports.CONTRACT_DEPLOYER = new ethers_1.utils.Interface(require('../../abi/ContractDeployer.json').abi);
exports.L1_MESSENGER = new ethers_1.utils.Interface(require('../../abi/L1Messenger.json').abi);
exports.IERC20 = new ethers_1.utils.Interface(require('../../abi/IERC20.json').abi);
exports.L1_BRIDGE_ABI = new ethers_1.utils.Interface(require('../../abi/IL1Bridge.json').abi);
exports.L2_BRIDGE_ABI = new ethers_1.utils.Interface(require('../../abi/IL2Bridge.json').abi);
exports.BOOTLOADER_FORMAL_ADDRESS = '0x0000000000000000000000000000000000008001';
exports.CONTRACT_DEPLOYER_ADDRESS = '0x0000000000000000000000000000000000008006';
exports.L1_MESSENGER_ADDRESS = '0x0000000000000000000000000000000000008008';
exports.EIP712_TX_TYPE = 0x71;
exports.RECOMMENDED_GAS_LIMIT = {
    // TODO: make better estimates
    DEPOSIT: 600000,
    EXECUTE: 620000,
    ERC20_APPROVE: 50000
};
function isETH(token) {
    return token.toLowerCase() == exports.ETH_ADDRESS;
}
exports.isETH = isETH;
function sleep(millis) {
    return new Promise((resolve) => setTimeout(resolve, millis));
}
exports.sleep = sleep;
function layer1TxDefaults() {
    return {
        queueType: types_1.PriorityQueueType.Deque,
        opTree: types_1.PriorityOpTree.Full
    };
}
exports.layer1TxDefaults = layer1TxDefaults;
function getHashedL2ToL1Msg(sender, msg) {
    const encodedMsg = new Uint8Array([
        ...ethers_1.ethers.utils.arrayify(exports.L1_MESSENGER_ADDRESS),
        ...ethers_1.ethers.utils.zeroPad(sender, 32),
        ...ethers_1.ethers.utils.arrayify(ethers_1.ethers.utils.keccak256(msg))
    ]);
    return ethers_1.ethers.utils.sha256(encodedMsg);
}
exports.getHashedL2ToL1Msg = getHashedL2ToL1Msg;
function getDeployedContracts(receipt) {
    const addressBytesLen = 40;
    const deployedContracts = receipt.logs
        .filter((log) => log.topics[0] == ethers_1.utils.id('ContractDeployed(address,bytes32,address)') &&
        log.address == exports.CONTRACT_DEPLOYER_ADDRESS)
        // Take the last topic (deployed contract address as U256) and extract address from it (U160).
        .map((log) => {
        const sender = `0x${log.topics[1].slice(log.topics[1].length - addressBytesLen)}`;
        const bytesCodehash = log.topics[2];
        const address = `0x${log.topics[3].slice(log.topics[3].length - addressBytesLen)}`;
        return {
            sender: ethers_1.utils.getAddress(sender),
            bytecodeHash: bytesCodehash,
            deployedAddress: ethers_1.utils.getAddress(address)
        };
    });
    return deployedContracts;
}
exports.getDeployedContracts = getDeployedContracts;
function create2Address(sender, bytecodeHash, salt, input) {
    const prefix = ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.toUtf8Bytes('zksyncCreate2'));
    const inputHash = ethers_1.ethers.utils.keccak256(input);
    const addressBytes = ethers_1.ethers.utils
        .keccak256(ethers_1.ethers.utils.concat([prefix, ethers_1.ethers.utils.zeroPad(sender, 32), salt, bytecodeHash, inputHash]))
        .slice(26);
    return ethers_1.ethers.utils.getAddress(addressBytes);
}
exports.create2Address = create2Address;
function createAddress(sender, senderNonce) {
    const prefix = ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.toUtf8Bytes('zksyncCreate'));
    const addressBytes = ethers_1.ethers.utils
        .keccak256(ethers_1.ethers.utils.concat([
        prefix,
        ethers_1.ethers.utils.zeroPad(sender, 32),
        ethers_1.ethers.utils.zeroPad(ethers_1.ethers.utils.hexlify(senderNonce), 32)
    ]))
        .slice(26);
    return ethers_1.ethers.utils.getAddress(addressBytes);
}
exports.createAddress = createAddress;
async function checkBaseCost(baseCost, value) {
    if (baseCost.gt(await value)) {
        throw new Error(`The base cost of performing the priority operation is higher than the provided value parameter ` +
            `for the transaction: baseCost: ${baseCost}, provided value: ${value}`);
    }
}
exports.checkBaseCost = checkBaseCost;
function serialize(transaction, signature) {
    var _a;
    if (transaction.customData == null && transaction.type != exports.EIP712_TX_TYPE) {
        return ethers_1.utils.serializeTransaction(transaction, signature);
    }
    if (!transaction.chainId) {
        throw Error("Transaction chainId isn't set");
    }
    function formatNumber(value, name) {
        const result = ethers_1.utils.stripZeros(ethers_1.BigNumber.from(value).toHexString());
        if (result.length > 32) {
            throw new Error('invalid length for ' + name);
        }
        return result;
    }
    const meta = transaction.customData;
    const fields = [
        formatNumber(transaction.nonce || 0, 'nonce'),
        formatNumber(transaction.gasPrice || 0, 'gasPrice'),
        formatNumber(transaction.gasLimit || 0, 'gasLimit'),
        transaction.to != null ? ethers_1.utils.getAddress(transaction.to) : '0x',
        formatNumber(transaction.value || 0, 'value'),
        transaction.data || '0x'
    ];
    if (signature) {
        const sig = ethers_1.utils.splitSignature(signature);
        fields.push(formatNumber(sig.recoveryParam, 'recoveryParam'));
        fields.push(ethers_1.utils.stripZeros(sig.r));
        fields.push(ethers_1.utils.stripZeros(sig.s));
    }
    else {
        fields.push(formatNumber(transaction.chainId, 'chainId'));
        fields.push('0x');
        fields.push('0x');
    }
    fields.push(formatNumber(transaction.chainId, 'chainId'));
    // Add meta
    fields.push(meta.feeToken || '0x');
    fields.push(formatNumber(meta.ergsPerPubdata || 0, 'ergsPerPubdata'));
    fields.push(((_a = meta.factoryDeps) !== null && _a !== void 0 ? _a : []).map((dep) => ethers_1.utils.hexlify(dep)));
    if (meta.aaParams) {
        fields.push([meta.aaParams.from, ethers_1.ethers.utils.hexlify(meta.aaParams.signature)]);
    }
    else {
        fields.push([]);
    }
    return ethers_1.utils.hexConcat([[exports.EIP712_TX_TYPE], ethers_1.utils.RLP.encode(fields)]);
}
exports.serialize = serialize;
function hashBytecode(bytecode) {
    // For getting the consistent length we first convert the bytecode to UInt8Array
    const bytecodeAsArray = ethers_1.ethers.utils.arrayify(bytecode);
    const hashStr = ethers_1.ethers.utils.sha256(bytecodeAsArray);
    const hash = ethers_1.ethers.utils.arrayify(hashStr);
    // Note that the length of the bytecode
    // should be provided in 32-byte words.
    const bytecodeLength = ethers_1.ethers.utils.arrayify(bytecodeAsArray.length / 32);
    if (bytecodeLength.length > 2) {
        throw new Error('Bytecode length must be less than 2^16 bytes');
    }
    // The bytecode should always take the first 2 bytes of the bytecode hash,
    // so we pad it from the left in case the length is smaller than 2 bytes.
    const bytecodeLengthPadded = ethers_1.ethers.utils.zeroPad(bytecodeLength, 2);
    hash.set(bytecodeLengthPadded, 0);
    return hash;
}
exports.hashBytecode = hashBytecode;
function parseTransaction(payload) {
    var _a;
    function handleAddress(value) {
        if (value === '0x') {
            return null;
        }
        return ethers_1.utils.getAddress(value);
    }
    function handleNumber(value) {
        if (value === '0x') {
            return ethers_1.BigNumber.from(0);
        }
        return ethers_1.BigNumber.from(value);
    }
    function arrayToAAParams(arr) {
        if (arr.length == 0) {
            return undefined;
        }
        if (arr.length != 2) {
            throw new Error(`Invalid AAParams, expected to have length of 2, found ${arr.length}`);
        }
        return {
            from: ethers_1.utils.getAddress(arr[0]),
            signature: ethers_1.utils.arrayify(arr[1])
        };
    }
    const bytes = ethers_1.utils.arrayify(payload);
    if (bytes[0] != exports.EIP712_TX_TYPE) {
        return ethers_1.utils.parseTransaction(bytes);
    }
    const raw = ethers_1.utils.RLP.decode(bytes.slice(1));
    const transaction = {
        type: exports.EIP712_TX_TYPE,
        nonce: handleNumber(raw[0]).toNumber(),
        gasPrice: handleNumber(raw[1]),
        gasLimit: handleNumber(raw[2]),
        to: handleAddress(raw[3]),
        value: handleNumber(raw[4]),
        data: raw[5],
        chainId: handleNumber(raw[9]),
        customData: {
            feeToken: handleAddress(raw[10]),
            ergsPerPubdata: handleNumber(raw[11]),
            factoryDeps: raw[12],
            aaParams: arrayToAAParams(raw[13])
        }
    };
    const ethSignature = {
        v: handleNumber(raw[6]).toNumber(),
        r: raw[7],
        s: raw[8]
    };
    if ((ethers_1.utils.hexlify(ethSignature.r) == '0x' || ethers_1.utils.hexlify(ethSignature.s) == '0x') &&
        !transaction.customData.aaParams) {
        return transaction;
    }
    transaction.hash = ethers_1.utils.keccak256(payload);
    if (ethSignature.v !== 0 && ethSignature.v !== 1 && !transaction.customData.aaParams) {
        throw new Error('Failed to parse signature');
    }
    const digest = signer_1.EIP712Signer.getSignedDigest(transaction);
    transaction.from =
        ((_a = transaction.customData.aaParams) === null || _a === void 0 ? void 0 : _a.from) ||
            ethers_1.utils.recoverAddress(digest, {
                r: ethers_1.utils.hexZeroPad(ethSignature.r, 32),
                s: ethers_1.utils.hexZeroPad(ethSignature.s, 32),
                recoveryParam: ethSignature.v
            });
    return transaction;
}
exports.parseTransaction = parseTransaction;
function getL2HashFromPriorityOp(txReceipt, zkSyncAddress) {
    let txHash = null;
    for (const log of txReceipt.logs) {
        if (log.address.toLowerCase() != zkSyncAddress.toLowerCase()) {
            continue;
        }
        try {
            const priorityQueueLog = exports.ZKSYNC_MAIN_ABI.parseLog(log);
            if (priorityQueueLog && priorityQueueLog.args.txHash != null) {
                txHash = priorityQueueLog.args.txHash;
            }
        }
        catch { }
    }
    if (!txHash) {
        throw new Error('Failed to parse tx logs');
    }
    return txHash;
}
exports.getL2HashFromPriorityOp = getL2HashFromPriorityOp;
// The method with similar functionality is already available in ethers.js,
// the only difference is that we provide additional `try { } catch { }`
// for error-resilience.
//
// It will also pave the road for allowing future EIP-1271 signature verification, by
// letting our SDK have functionality to verify signatures.
function isECDSASignatureCorrect(address, msgHash, signature) {
    try {
        return address == ethers_1.ethers.utils.recoverAddress(msgHash, signature);
    }
    catch {
        // In case ECDSA signature verification has thrown an error,
        // we simply consider the signature as incorrect.
        return false;
    }
}
// Returns `true` or `false` depending on whether or not the account abstraction's
// signature is correct. Note, that while currently it does not do any `async` actions.
// in the future it will. That's why the `Promise<boolean>` is returned.
async function isMessageSignatureCorrect(address, message, signature) {
    const msgHash = ethers_1.ethers.utils.hashMessage(message);
    return isECDSASignatureCorrect(address, msgHash, signature);
}
exports.isMessageSignatureCorrect = isMessageSignatureCorrect;
// Returns `true` or `false` depending on whether or not the account abstraction's
// EIP712 signature is correct. Note, that while currently it does not do any `async` actions.
// in the future it will. That's why the `Promise<boolean>` is returned.
async function isTypedDataSignatureCorrect(address, domain, types, value, signature) {
    const msgHash = ethers_1.ethers.utils._TypedDataEncoder.hash(domain, types, value);
    return isECDSASignatureCorrect(address, msgHash, signature);
}
exports.isTypedDataSignatureCorrect = isTypedDataSignatureCorrect;
