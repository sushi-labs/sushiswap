import { ContractCompiler } from "./Contract";
export interface TenderlyKeyConfig {
    access_key: string;
    head: string | undefined;
}
export interface BytecodeMismatchError {
    contract_id: string;
    expected: string;
    got: string;
}
export interface TenderlyConfig {
    project: string;
    username: string;
    forkNetwork?: string;
    privateVerification?: boolean;
    deploymentsDir?: string;
}
export interface Metadata {
    compiler: ContractCompiler;
    sources: Record<string, MetadataSources>;
}
export interface MetadataSources {
    content: string;
}
//# sourceMappingURL=utils.d.ts.map