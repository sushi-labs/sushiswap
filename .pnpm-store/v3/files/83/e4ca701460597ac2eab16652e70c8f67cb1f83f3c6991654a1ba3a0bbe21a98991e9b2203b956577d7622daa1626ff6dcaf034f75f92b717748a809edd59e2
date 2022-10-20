import { HardhatRuntimeEnvironment } from "hardhat/types";
import { TenderlyContractUploadRequest, TenderlyForkContractUploadRequest } from "./tenderly/types";
import { TenderlyNetwork } from "./TenderlyNetwork";
export declare class Tenderly {
    env: HardhatRuntimeEnvironment;
    tenderlyNetwork: TenderlyNetwork;
    constructor(hre: HardhatRuntimeEnvironment);
    verify(...contracts: any[]): any;
    verifyAPI(request: TenderlyContractUploadRequest): Promise<void>;
    verifyForkAPI(request: TenderlyForkContractUploadRequest, tenderlyProject: string, username: string, forkID: string): Promise<void>;
    network(): TenderlyNetwork;
    setNetwork(network: TenderlyNetwork): TenderlyNetwork;
    push(...contracts: any[]): any;
    pushAPI(request: TenderlyContractUploadRequest, tenderlyProject: string, username: string): Promise<void>;
    persistArtifacts(...contracts: any[]): Promise<void>;
    private filterContracts;
    private getContractData;
}
//# sourceMappingURL=Tenderly.d.ts.map