import { utils, ethers, BigNumber, BigNumberish, BytesLike } from 'ethers';
import { SignatureLike } from '@ethersproject/bytes';
import { Address, Eip712Meta, PriorityQueueType, PriorityOpTree, AAParams, DeploymentInfo } from './types';
import { EIP712Signer } from './signer';
import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer';

export const ETH_ADDRESS = '0x0000000000000000000000000000000000000000';

export const ZKSYNC_MAIN_ABI = new utils.Interface(require('../../abi/IZkSync.json').abi);
export const CONTRACT_DEPLOYER = new utils.Interface(require('../../abi/ContractDeployer.json').abi);
export const L1_MESSENGER = new utils.Interface(require('../../abi/L1Messenger.json').abi);
export const IERC20 = new utils.Interface(require('../../abi/IERC20.json').abi);
export const L1_BRIDGE_ABI = new utils.Interface(require('../../abi/IL1Bridge.json').abi);
export const L2_BRIDGE_ABI = new utils.Interface(require('../../abi/IL2Bridge.json').abi);

export const BOOTLOADER_FORMAL_ADDRESS = '0x0000000000000000000000000000000000008001';
export const CONTRACT_DEPLOYER_ADDRESS = '0x0000000000000000000000000000000000008006';
export const L1_MESSENGER_ADDRESS = '0x0000000000000000000000000000000000008008';

export const EIP712_TX_TYPE = 0x71;

export const RECOMMENDED_GAS_LIMIT = {
    // TODO: make better estimates
    DEPOSIT: 600_000,
    EXECUTE: 620_000,
    ERC20_APPROVE: 50_000
};

export function isETH(token: Address) {
    return token.toLowerCase() == ETH_ADDRESS;
}

export function sleep(millis: number) {
    return new Promise((resolve) => setTimeout(resolve, millis));
}

export function layer1TxDefaults() {
    return {
        queueType: PriorityQueueType.Deque,
        opTree: PriorityOpTree.Full
    };
}

export function getHashedL2ToL1Msg(sender: Address, msg: BytesLike) {
    const encodedMsg = new Uint8Array([
        ...ethers.utils.arrayify(L1_MESSENGER_ADDRESS),
        ...ethers.utils.zeroPad(sender, 32),
        ...ethers.utils.arrayify(ethers.utils.keccak256(msg))
    ]);

    return ethers.utils.sha256(encodedMsg);
}

export function getDeployedContracts(receipt: ethers.providers.TransactionReceipt): DeploymentInfo[] {
    const addressBytesLen = 40;
    const deployedContracts = receipt.logs
        .filter(
            (log) =>
                log.topics[0] == utils.id('ContractDeployed(address,bytes32,address)') &&
                log.address == CONTRACT_DEPLOYER_ADDRESS
        )
        // Take the last topic (deployed contract address as U256) and extract address from it (U160).
        .map((log) => {
            const sender = `0x${log.topics[1].slice(log.topics[1].length - addressBytesLen)}`;
            const bytesCodehash = log.topics[2];
            const address = `0x${log.topics[3].slice(log.topics[3].length - addressBytesLen)}`;
            return {
                sender: utils.getAddress(sender),
                bytecodeHash: bytesCodehash,
                deployedAddress: utils.getAddress(address)
            };
        });

    return deployedContracts;
}

export function create2Address(sender: Address, bytecodeHash: BytesLike, salt: BytesLike, input: BytesLike) {
    const prefix = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('zksyncCreate2'));
    const inputHash = ethers.utils.keccak256(input);
    const addressBytes = ethers.utils
        .keccak256(ethers.utils.concat([prefix, ethers.utils.zeroPad(sender, 32), salt, bytecodeHash, inputHash]))
        .slice(26);
    return ethers.utils.getAddress(addressBytes);
}

export function createAddress(sender: Address, senderNonce: BigNumberish) {
    const prefix = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('zksyncCreate'));
    const addressBytes = ethers.utils
        .keccak256(
            ethers.utils.concat([
                prefix,
                ethers.utils.zeroPad(sender, 32),
                ethers.utils.zeroPad(ethers.utils.hexlify(senderNonce), 32)
            ])
        )
        .slice(26);

    return ethers.utils.getAddress(addressBytes);
}

export async function checkBaseCost(
    baseCost: ethers.BigNumber,
    value: ethers.BigNumberish | Promise<ethers.BigNumberish>
) {
    if (baseCost.gt(await value)) {
        throw new Error(
            `The base cost of performing the priority operation is higher than the provided value parameter ` +
                `for the transaction: baseCost: ${baseCost}, provided value: ${value}`
        );
    }
}

export function serialize(transaction: ethers.providers.TransactionRequest, signature?: SignatureLike) {
    if (transaction.customData == null && transaction.type != EIP712_TX_TYPE) {
        return utils.serializeTransaction(transaction as ethers.PopulatedTransaction, signature);
    }
    if (!transaction.chainId) {
        throw Error("Transaction chainId isn't set");
    }

    function formatNumber(value: BigNumberish, name: string): Uint8Array {
        const result = utils.stripZeros(BigNumber.from(value).toHexString());
        if (result.length > 32) {
            throw new Error('invalid length for ' + name);
        }
        return result;
    }

    const meta: Eip712Meta = transaction.customData;

    const fields: any[] = [
        formatNumber(transaction.nonce || 0, 'nonce'),
        formatNumber(transaction.gasPrice || 0, 'gasPrice'),
        formatNumber(transaction.gasLimit || 0, 'gasLimit'),
        transaction.to != null ? utils.getAddress(transaction.to) : '0x',
        formatNumber(transaction.value || 0, 'value'),
        transaction.data || '0x'
    ];

    if (signature) {
        const sig = utils.splitSignature(signature);
        fields.push(formatNumber(sig.recoveryParam, 'recoveryParam'));
        fields.push(utils.stripZeros(sig.r));
        fields.push(utils.stripZeros(sig.s));
    } else {
        fields.push(formatNumber(transaction.chainId, 'chainId'));
        fields.push('0x');
        fields.push('0x');
    }
    fields.push(formatNumber(transaction.chainId, 'chainId'));
    // Add meta
    fields.push(meta.feeToken || '0x');
    fields.push(formatNumber(meta.ergsPerPubdata || 0, 'ergsPerPubdata'));
    fields.push((meta.factoryDeps ?? []).map((dep) => utils.hexlify(dep)));

    if (meta.aaParams) {
        fields.push([meta.aaParams.from, ethers.utils.hexlify(meta.aaParams.signature)]);
    } else {
        fields.push([]);
    }

    return utils.hexConcat([[EIP712_TX_TYPE], utils.RLP.encode(fields)]);
}

export function hashBytecode(bytecode: ethers.BytesLike): Uint8Array {
    // For getting the consistent length we first convert the bytecode to UInt8Array
    const bytecodeAsArray = ethers.utils.arrayify(bytecode);

    const hashStr = ethers.utils.sha256(bytecodeAsArray);
    const hash = ethers.utils.arrayify(hashStr);

    // Note that the length of the bytecode
    // should be provided in 32-byte words.
    const bytecodeLength = ethers.utils.arrayify(bytecodeAsArray.length / 32);
    if (bytecodeLength.length > 2) {
        throw new Error('Bytecode length must be less than 2^16 bytes');
    }
    // The bytecode should always take the first 2 bytes of the bytecode hash,
    // so we pad it from the left in case the length is smaller than 2 bytes.
    const bytecodeLengthPadded = ethers.utils.zeroPad(bytecodeLength, 2);
    hash.set(bytecodeLengthPadded, 0);

    return hash;
}

export function parseTransaction(payload: ethers.BytesLike): ethers.Transaction {
    function handleAddress(value: string): string {
        if (value === '0x') {
            return null;
        }
        return utils.getAddress(value);
    }

    function handleNumber(value: string): BigNumber {
        if (value === '0x') {
            return BigNumber.from(0);
        }
        return BigNumber.from(value);
    }

    function arrayToAAParams(arr: string[]): AAParams | undefined {
        if (arr.length == 0) {
            return undefined;
        }
        if (arr.length != 2) {
            throw new Error(`Invalid AAParams, expected to have length of 2, found ${arr.length}`);
        }

        return {
            from: utils.getAddress(arr[0]),
            signature: utils.arrayify(arr[1])
        };
    }

    const bytes = utils.arrayify(payload);
    if (bytes[0] != EIP712_TX_TYPE) {
        return utils.parseTransaction(bytes);
    }

    const raw = utils.RLP.decode(bytes.slice(1));
    const transaction: any = {
        type: EIP712_TX_TYPE,
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

    if (
        (utils.hexlify(ethSignature.r) == '0x' || utils.hexlify(ethSignature.s) == '0x') &&
        !transaction.customData.aaParams
    ) {
        return transaction;
    }

    transaction.hash = utils.keccak256(payload);

    if (ethSignature.v !== 0 && ethSignature.v !== 1 && !transaction.customData.aaParams) {
        throw new Error('Failed to parse signature');
    }

    const digest = EIP712Signer.getSignedDigest(transaction);
    transaction.from =
        transaction.customData.aaParams?.from ||
        utils.recoverAddress(digest, {
            r: utils.hexZeroPad(ethSignature.r, 32),
            s: utils.hexZeroPad(ethSignature.s, 32),
            recoveryParam: ethSignature.v
        });

    return transaction;
}

export function getL2HashFromPriorityOp(
    txReceipt: ethers.providers.TransactionReceipt,
    zkSyncAddress: Address
): string {
    let txHash: string = null;
    for (const log of txReceipt.logs) {
        if (log.address.toLowerCase() != zkSyncAddress.toLowerCase()) {
            continue;
        }

        try {
            const priorityQueueLog = ZKSYNC_MAIN_ABI.parseLog(log);
            if (priorityQueueLog && priorityQueueLog.args.txHash != null) {
                txHash = priorityQueueLog.args.txHash;
            }
        } catch {}
    }
    if (!txHash) {
        throw new Error('Failed to parse tx logs');
    }

    return txHash;
}

// The method with similar functionality is already available in ethers.js,
// the only difference is that we provide additional `try { } catch { }`
// for error-resilience.
//
// It will also pave the road for allowing future EIP-1271 signature verification, by
// letting our SDK have functionality to verify signatures.
function isECDSASignatureCorrect(address: string, msgHash: string, signature: SignatureLike): boolean {
    try {
        return address == ethers.utils.recoverAddress(msgHash, signature);
    } catch {
        // In case ECDSA signature verification has thrown an error,
        // we simply consider the signature as incorrect.
        return false;
    }
}

// Returns `true` or `false` depending on whether or not the account abstraction's
// signature is correct. Note, that while currently it does not do any `async` actions.
// in the future it will. That's why the `Promise<boolean>` is returned.
export async function isMessageSignatureCorrect(
    address: string,
    message: ethers.Bytes | string,
    signature: SignatureLike
): Promise<boolean> {
    const msgHash = ethers.utils.hashMessage(message);
    return isECDSASignatureCorrect(address, msgHash, signature);
}

// Returns `true` or `false` depending on whether or not the account abstraction's
// EIP712 signature is correct. Note, that while currently it does not do any `async` actions.
// in the future it will. That's why the `Promise<boolean>` is returned.
export async function isTypedDataSignatureCorrect(
    address: string,
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>,
    signature: SignatureLike
): Promise<boolean> {
    const msgHash = ethers.utils._TypedDataEncoder.hash(domain, types, value);
    return isECDSASignatureCorrect(address, msgHash, signature);
}
