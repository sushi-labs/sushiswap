import * as axios from "axios";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { TenderlyForkContractUploadRequest } from "./tenderly/types";
export declare class TenderlyNetwork {
    host: string;
    connected: boolean;
    accessKey: string;
    head: string | undefined;
    fork: string | undefined;
    tenderlyAPI: axios.AxiosInstance;
    accounts: Record<string, string> | undefined;
    env: HardhatRuntimeEnvironment;
    private filepath;
    constructor(hre: HardhatRuntimeEnvironment);
    supportsSubscriptions(): false | undefined;
    disconnect(): true | undefined;
    send(payload: any, cb: any): Promise<void>;
    resetFork(): string | undefined;
    verify(...contracts: any[]): Promise<void>;
    verifyAPI(request: TenderlyForkContractUploadRequest, tenderlyProject: string, username: string, forkID: string): Promise<void>;
    getHead(): string | undefined;
    setHead(head: string | undefined): void;
    getFork(): string | undefined;
    setFork(fork: string | undefined): void;
    initializeFork(): Promise<void>;
    private writeHead;
    private filterContracts;
    private getForkContractData;
    private checkNetwork;
}
//# sourceMappingURL=TenderlyNetwork.d.ts.map