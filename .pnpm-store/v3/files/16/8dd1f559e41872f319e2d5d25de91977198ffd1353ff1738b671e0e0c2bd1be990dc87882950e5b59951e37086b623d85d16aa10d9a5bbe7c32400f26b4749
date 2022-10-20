import { TenderlyContractUploadRequest, TenderlyForkContractUploadRequest } from "./types";
import { TenderlyPublicNetwork } from "./types/Network";
export declare const TENDERLY_API_BASE_URL = "https://api.tenderly.co";
export declare const TENDERLY_DASHBOARD_BASE_URL = "https://dashboard.tenderly.co";
export declare const TENDERLY_RPC_BASE = "https://rpc.tenderly.co";
export declare class TenderlyService {
    static getPublicNetworks(): Promise<TenderlyPublicNetwork[]>;
    static verifyContracts(request: TenderlyContractUploadRequest): Promise<void>;
    static pushContracts(request: TenderlyContractUploadRequest, tenderlyProject: string, username: string): Promise<void>;
    static verifyForkContracts(request: TenderlyForkContractUploadRequest, tenderlyProject: string, username: string, fork: string): Promise<void>;
}
//# sourceMappingURL=TenderlyService.d.ts.map