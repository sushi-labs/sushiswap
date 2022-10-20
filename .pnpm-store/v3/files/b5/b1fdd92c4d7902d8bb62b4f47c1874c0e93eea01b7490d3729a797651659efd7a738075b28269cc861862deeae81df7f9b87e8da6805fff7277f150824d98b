import { BigNumber, BigNumberish, ethers, BytesLike } from 'ethers';
import { Provider } from './provider';
import { RECOMMENDED_GAS_LIMIT, isETH, ETH_ADDRESS, checkBaseCost, layer1TxDefaults } from './utils';
import { IZkSyncFactory, IL1BridgeFactory, IL2BridgeFactory, IERC20Factory } from '../typechain';
import {
    Address,
    PriorityOpResponse,
    BlockTag,
    Eip712Meta,
    PriorityQueueType,
    TransactionResponse,
    BalancesMap
} from './types';

type Constructor<T = {}> = new (...args: any[]) => T;

interface TxSender {
    sendTransaction(tx: ethers.providers.TransactionRequest): Promise<ethers.providers.TransactionResponse>;
    getAddress(): Promise<Address>;
}

export function AdapterL1<TBase extends Constructor<TxSender>>(Base: TBase) {
    return class Adapter extends Base {
        _providerL2(): Provider {
            throw new Error('Must be implemented by the derived class!');
        }
        _providerL1(): ethers.providers.Provider {
            throw new Error('Must be implemented by the derived class!');
        }
        _signerL1(): ethers.Signer {
            throw new Error('Must be implemented by the derived class!');
        }

        async getMainContract() {
            const address = await this._providerL2().getMainContractAddress();
            return IZkSyncFactory.connect(address, this._signerL1());
        }

        async getL1BridgeContracts() {
            const addresses = await this._providerL2().getDefaultBridgeAddresses();
            return {
                eth: IL1BridgeFactory.connect(addresses.ethL1, this._signerL1()),
                erc20: IL1BridgeFactory.connect(addresses.erc20L1, this._signerL1())
            };
        }

        async getBalanceL1(token?: Address, blockTag?: ethers.providers.BlockTag): Promise<BigNumber> {
            token ??= ETH_ADDRESS;
            if (isETH(token)) {
                return await this._providerL1().getBalance(await this.getAddress(), blockTag);
            } else {
                const erc20contract = IERC20Factory.connect(token, this._providerL1());
                return await erc20contract.balanceOf(await this.getAddress());
            }
        }

        async l2TokenAddress(token: Address) {
            if (token == ETH_ADDRESS) {
                return ETH_ADDRESS;
            } else {
                const erc20Bridge = (await this.getL1BridgeContracts()).erc20;
                return await erc20Bridge.l2TokenAddress(token);
            }
        }

        async approveERC20(
            token: Address,
            amount: BigNumberish,
            overrides?: ethers.Overrides & { bridgeAddress?: Address }
        ): Promise<ethers.providers.TransactionResponse> {
            if (isETH(token)) {
                throw new Error("ETH token can't be approved. The address of the token does not exist on L1.");
            }

            let bridgeAddress = overrides?.bridgeAddress;
            const erc20contract = IERC20Factory.connect(token, this._signerL1());

            if (bridgeAddress == null) {
                bridgeAddress = (await this._providerL2().getDefaultBridgeAddresses()).erc20L1;
            } else {
                delete overrides.bridgeAddress;
            }

            let gasLimit: BigNumberish;
            if (overrides?.gasLimit) {
                gasLimit = await overrides.gasLimit;
            } else {
                // For some reason, gas estimation for approves may be imprecise.
                // At least in the localhost scenario.
                gasLimit = await erc20contract.estimateGas.approve(bridgeAddress, amount);
                gasLimit = gasLimit.gt(RECOMMENDED_GAS_LIMIT.ERC20_APPROVE)
                    ? gasLimit
                    : RECOMMENDED_GAS_LIMIT.ERC20_APPROVE;
            }

            return await erc20contract.approve(bridgeAddress, amount, { gasLimit, ...overrides });
        }

        async getBaseCost(params: {
            ergsLimit: BigNumberish;
            calldataLength: BigNumberish;
            gasPrice?: BigNumberish;
            queueType?: PriorityQueueType;
        }): Promise<BigNumber> {
            const zksyncContract = await this.getMainContract();
            const parameters = { ...layer1TxDefaults(), ...params };
            parameters.gasPrice ??= await this._providerL1().getGasPrice();
            return BigNumber.from(
                await zksyncContract.l2TransactionBaseCost(
                    parameters.gasPrice,
                    parameters.ergsLimit,
                    parameters.calldataLength,
                    parameters.queueType
                )
            );
        }

        async deposit(transaction: {
            token: Address;
            amount: BigNumberish;
            to?: Address;
            queueType?: PriorityQueueType;
            operatorTip?: BigNumberish;
            bridgeAddress?: Address;
            approveERC20?: boolean;
            overrides?: ethers.PayableOverrides;
            approveOverrides?: ethers.Overrides;
        }): Promise<PriorityOpResponse> {
            const bridgeContracts = await this.getL1BridgeContracts();
            if (transaction.bridgeAddress) {
                bridgeContracts.eth.attach(transaction.bridgeAddress);
                bridgeContracts.erc20.attach(transaction.bridgeAddress);
            }

            const { ...tx } = transaction;
            tx.queueType ??= PriorityQueueType.Deque;
            tx.to ??= await this.getAddress();
            tx.operatorTip ??= BigNumber.from(0);
            tx.overrides ??= {};

            const { to, token, amount, queueType, operatorTip, overrides } = tx;
            overrides.gasPrice ??= await this._providerL1().getGasPrice();
            overrides.gasLimit ??= BigNumber.from(RECOMMENDED_GAS_LIMIT.DEPOSIT);

            const baseCost = BigNumber.from(0);
            // TODO
            // const baseCost = await this.getBaseCost({
            //     gasPrice: await overrides.gasPrice,
            //     ergsLimit: 0,
            //     calldataLength: 0,
            //     opTree,
            //     queueType,
            // });

            const args: [Address, Address, BigNumberish, PriorityQueueType] = [to, token, amount, queueType];

            if (token == ETH_ADDRESS) {
                overrides.value ??= baseCost.add(operatorTip).add(amount);

                await checkBaseCost(baseCost, overrides.value);

                return this._providerL2().getPriorityOpResponse(await bridgeContracts.eth.deposit(...args, overrides));
            } else {
                overrides.value ??= baseCost.add(operatorTip);

                await checkBaseCost(baseCost, overrides.value);

                if (transaction.approveERC20) {
                    const approveTx = await this.approveERC20(token, amount, {
                        bridgeAddress: bridgeContracts.erc20.address,
                        ...transaction.approveOverrides
                    });
                    overrides.nonce ??= approveTx.nonce + 1;
                }

                if (overrides.gasLimit == null) {
                    const gasEstimate = await bridgeContracts.erc20.estimateGas
                        .deposit(...args, overrides)
                        .catch(() => BigNumber.from(0));
                    const recommendedGasLimit = RECOMMENDED_GAS_LIMIT.DEPOSIT;
                    overrides.gasLimit = gasEstimate.gte(recommendedGasLimit) ? gasEstimate : recommendedGasLimit;
                }

                return await this._providerL2().getPriorityOpResponse(
                    await bridgeContracts.erc20.deposit(...args, overrides)
                );
            }
        }

        async finalizeWithdrawal(withdrawalHash: BytesLike, index: number = 0) {
            const hash = ethers.utils.hexlify(withdrawalHash);
            const receipt = await this._providerL2().getTransactionReceipt(hash);
            const log = receipt.logs.filter(
                (log) => log.topics[0] == ethers.utils.id('L1MessageSent(address,bytes32,bytes)')
            )[index];
            const sender = ethers.utils.hexDataSlice(log.topics[1], 12);
            const proof = await this._providerL2().getMessageProof(
                receipt.blockNumber,
                sender,
                log.topics[2],
                log.logIndex
            );
            const message = ethers.utils.defaultAbiCoder.decode(['bytes'], log.data)[0];

            const l2Bridge = IL2BridgeFactory.connect(sender, this._providerL2());
            const l1Bridge = IL1BridgeFactory.connect(await l2Bridge.l1Bridge(), this._signerL1());

            return await l1Bridge.finalizeWithdrawal(receipt.blockNumber, proof.id, message, proof.proof);
        }

        async requestExecute(transaction: {
            contractAddress: Address;
            calldata: BytesLike;
            ergsLimit: BigNumberish;
            factoryDeps?: ethers.BytesLike[];
            queueType?: PriorityQueueType;
            operatorTip?: BigNumberish;
            overrides?: ethers.PayableOverrides;
        }): Promise<PriorityOpResponse> {
            const zksyncContract = await this.getMainContract();

            const { ...tx } = transaction;
            tx.queueType ??= PriorityQueueType.Deque;
            tx.operatorTip ??= BigNumber.from(0);
            tx.factoryDeps ??= [];
            tx.overrides ??= {};

            const { contractAddress, calldata, ergsLimit, factoryDeps, queueType, operatorTip, overrides } = tx;
            overrides.gasPrice ??= await this._providerL1().getGasPrice();
            overrides.gasLimit ??= BigNumber.from(RECOMMENDED_GAS_LIMIT.EXECUTE);

            const baseCost = await this.getBaseCost({
                gasPrice: await overrides.gasPrice,
                calldataLength: ethers.utils.hexDataLength(calldata),
                ergsLimit,
                queueType
            });

            overrides.value ??= baseCost.add(operatorTip);

            await checkBaseCost(baseCost, overrides.value);

            return this._providerL2().getPriorityOpResponse(
                await zksyncContract.requestL2Transaction(
                    contractAddress,
                    calldata,
                    ergsLimit,
                    factoryDeps,
                    queueType,
                    overrides
                )
            );
        }
    };
}

export function AdapterL2<TBase extends Constructor<TxSender>>(Base: TBase) {
    return class Adapter extends Base {
        _providerL2(): Provider {
            throw new Error('Must be implemented by the derived class!');
        }
        _signerL2(): ethers.Signer {
            throw new Error('Must be implemented by the derived class!');
        }

        async getBalance(token?: Address, blockTag: BlockTag = 'committed') {
            return await this._providerL2().getBalance(await this.getAddress(), blockTag, token);
        }

        async getAllBalances(): Promise<BalancesMap> {
            return await this._providerL2().getAllAccountBalances(await this.getAddress());
        }

        async getL2BridgeContracts() {
            const addresses = await this._providerL2().getDefaultBridgeAddresses();
            return {
                eth: IL2BridgeFactory.connect(addresses.ethL2, this._signerL2()),
                erc20: IL2BridgeFactory.connect(addresses.erc20L2, this._signerL2())
            };
        }

        _fillCustomData(data: Eip712Meta): Eip712Meta {
            const customData = { ...data };
            customData.feeToken ??= ETH_ADDRESS;
            customData.ergsPerPubdata ??= 0;
            customData.factoryDeps ??= [];
            return customData;
        }

        async withdraw(transaction: {
            token: Address;
            amount: BigNumberish;
            to?: Address;
            bridgeAddress?: Address;
            overrides?: ethers.Overrides;
        }): Promise<TransactionResponse> {
            const withdrawTx = await this._providerL2().getWithdrawTx({
                from: await this.getAddress(),
                ...transaction
            });
            const txResponse = await this.sendTransaction(withdrawTx);
            return this._providerL2()._wrapTransaction(txResponse);
        }

        async transfer(transaction: {
            to: Address;
            amount: BigNumberish;
            token?: Address;
            overrides?: ethers.Overrides;
        }): Promise<TransactionResponse> {
            const transferTx = await this._providerL2().getTransferTx({
                from: await this.getAddress(),
                ...transaction
            });
            const txResponse = await this.sendTransaction(transferTx);
            return this._providerL2()._wrapTransaction(txResponse);
        }
    };
}
