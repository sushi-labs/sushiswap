import { Wallet } from './wallet';
import { Signer } from './signer';
import { BigNumber, Contract, ContractInterface, ethers, utils } from 'ethers';
import {
    hashBytecode,
    CONTRACT_DEPLOYER,
    CONTRACT_DEPLOYER_ADDRESS,
    EIP712_TX_TYPE,
    getDeployedContracts
} from './utils';
import { DeploymentType } from './types';
export { Contract } from 'ethers';

export class ContractFactory extends ethers.ContractFactory {
    override readonly signer: Wallet | Signer;
    readonly deploymentType: DeploymentType;

    constructor(
        abi: ContractInterface,
        bytecode: ethers.BytesLike,
        signer: Wallet | Signer,
        deploymentType?: DeploymentType
    ) {
        super(abi, bytecode, signer);
        this.deploymentType = deploymentType || 'create';
    }

    override getDeployTransaction(...args: any[]): ethers.providers.TransactionRequest {
        // TODO: the users should be able to provide the salt
        let salt = '0x0000000000000000000000000000000000000000000000000000000000000000';

        // The overrides will be popped out in this call:
        const txRequest = super.getDeployTransaction(...args);
        let overrides: ethers.PayableOverrides = {};
        if (this.interface.deploy.inputs.length + 1 == args.length) {
            // pop out the overrides
            overrides = args.pop();
        }

        // Salt argument is not used, so we provide a placeholder value.
        const bytecodeHash = hashBytecode(this.bytecode);
        const value = BigNumber.from(overrides.value ?? 0);
        const constructorCalldata = utils.arrayify(this.interface.encodeDeploy(args));
        const deployCalldata = CONTRACT_DEPLOYER.encodeFunctionData(this.deploymentType, [
            salt,
            bytecodeHash,
            value,
            constructorCalldata
        ]);

        txRequest.type = EIP712_TX_TYPE;
        txRequest.to = CONTRACT_DEPLOYER_ADDRESS;
        txRequest.data = deployCalldata;
        txRequest.customData ??= {};
        txRequest.customData.factoryDeps ??= [];
        txRequest.customData.factoryDeps.push(this.bytecode);

        return txRequest;
    }

    override async deploy(...args: Array<any>): Promise<Contract> {
        const contract = await super.deploy(...args);

        const deployTxReceipt = await contract.deployTransaction.wait();

        const deployedAddresses = getDeployedContracts(deployTxReceipt).map((info) => info.deployedAddress);

        const contractWithCorrectAddress = new ethers.Contract(
            deployedAddresses[deployedAddresses.length - 1],
            contract.interface,
            contract.signer
        );
        utils.defineReadOnly(contractWithCorrectAddress, 'deployTransaction', contract.deployTransaction);
        return contractWithCorrectAddress;
    }
}
