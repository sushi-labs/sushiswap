import { TransactionResponse } from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';
import { DeploymentsExtension, Receipt, DeploymentSubmission } from '../types';
import { PartialExtension } from './internal/types';
import { Artifact, EthereumProvider } from 'hardhat/types';
import { DeploymentsManager } from './DeploymentsManager';
export declare function addHelpers(deploymentManager: DeploymentsManager, partialExtension: PartialExtension, network: any, // TODO work out right config type
getArtifact: (name: string) => Promise<Artifact>, saveDeployment: (name: string, deployment: DeploymentSubmission, artifactName?: string) => Promise<void>, willSaveToDisk: () => boolean, onPendingTx: (txResponse: TransactionResponse, name?: string, data?: any) => Promise<TransactionResponse>, getGasPrice: () => Promise<{
    gasPrice: BigNumber | undefined;
    maxFeePerGas: BigNumber | undefined;
    maxPriorityFeePerGas: BigNumber | undefined;
}>, log: (...args: any[]) => void, print: (msg: string) => void): {
    extension: DeploymentsExtension;
    utils: {
        dealWithPendingTransactions: (pendingTxs: {
            [txHash: string]: {
                name: string;
                deployment?: any;
                rawTx: string;
                decoded: {
                    from: string;
                    gasPrice?: string;
                    maxFeePerGas?: string;
                    maxPriorityFeePerGas?: string;
                    gasLimit: string;
                    to: string;
                    value: string;
                    nonce: number;
                    data: string;
                    r: string;
                    s: string;
                    v: number;
                    chainId: number;
                };
            };
        }, pendingTxPath: string, globalGasPrice: string | undefined) => Promise<void>;
    };
};
export declare function waitForTx(ethereum: EthereumProvider, txHash: string, isContract: boolean): Promise<Receipt>;
//# sourceMappingURL=helpers.d.ts.map