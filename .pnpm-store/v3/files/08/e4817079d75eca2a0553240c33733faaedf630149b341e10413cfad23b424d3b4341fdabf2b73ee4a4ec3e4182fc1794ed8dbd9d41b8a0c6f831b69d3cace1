import { Artifact } from 'hardhat/types';
import { Deployment, FixtureFunc, DeploymentSubmission, ExtendedArtifact } from '../../types';
export interface PartialExtension {
    readDotFile(name: string): Promise<string>;
    saveDotFile(name: string, content: string): Promise<void>;
    deleteDotFile(name: string): Promise<void>;
    save(name: string, deployment: DeploymentSubmission): Promise<void>;
    delete(name: string): Promise<void>;
    get(name: string): Promise<Deployment>;
    getOrNull(name: string): Promise<Deployment | null>;
    getDeploymentsFromAddress(address: string): Promise<Deployment[]>;
    all(): Promise<{
        [name: string]: Deployment;
    }>;
    getExtendedArtifact(name: string): Promise<ExtendedArtifact>;
    getArtifact(name: string): Promise<Artifact>;
    run(tags?: string | string[], options?: {
        resetMemory?: boolean;
        deletePreviousDeployments?: boolean;
        writeDeploymentsToFiles?: boolean;
        export?: string;
        exportAll?: string;
    }): Promise<{
        [name: string]: Deployment;
    }>;
    fixture(tags?: string | string[], options?: {
        fallbackToGlobal?: boolean;
        keepExistingDeployments?: boolean;
    }): Promise<{
        [name: string]: Deployment;
    }>;
    createFixture<T, O>(func: FixtureFunc<T, O>, id?: string): (options?: O) => Promise<T>;
    log(...args: unknown[]): void;
    getNetworkName(): string;
    getGasUsed(): number;
}
//# sourceMappingURL=types.d.ts.map