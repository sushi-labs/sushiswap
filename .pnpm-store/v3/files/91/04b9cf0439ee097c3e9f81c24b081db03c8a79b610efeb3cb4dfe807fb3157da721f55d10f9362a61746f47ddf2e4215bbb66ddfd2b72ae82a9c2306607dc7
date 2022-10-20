/* eslint-disable @typescript-eslint/no-explicit-any */
import 'hardhat/types/runtime';
import 'hardhat/types/config';
import {
  Address,
  DeploymentsExtension,
  DeterministicDeploymentInfo,
} from '../types';
import {EthereumProvider} from 'hardhat/types';

declare module 'hardhat/types/config' {
  interface HardhatUserConfig {
    namedAccounts?: {
      [name: string]:
        | string
        | number
        | {[network: string]: null | number | string};
    };
    deterministicDeployment?:
      | {
          [network: string]: DeterministicDeploymentInfo;
        }
      | ((network: string) => DeterministicDeploymentInfo | undefined);
    external?: {
      deployments?: {
        [networkName: string]: string[];
      };
      contracts?: {
        artifacts: string | string[];
        deploy?: string;
      }[];
    };
    verify?: {etherscan?: {apiKey?: string}};
  }

  interface HardhatConfig {
    namedAccounts: {
      [name: string]:
        | string
        | number
        | {[network: string]: null | number | string};
    };
    deterministicDeployment?:
      | {
          [network: string]: DeterministicDeploymentInfo;
        }
      | ((network: string) => DeterministicDeploymentInfo | undefined);
    external?: {
      deployments?: {
        [networkName: string]: string[];
      };
      contracts?: {
        artifacts: string[];
        deploy?: string;
      }[];
    };
    verify: {etherscan?: {apiKey?: string}};
  }

  interface HardhatNetworkUserConfig {
    live?: boolean;
    saveDeployments?: boolean;
    tags?: string[];
    deploy?: string | string[];
    companionNetworks?: {[name: string]: string};
    verify?: {etherscan?: {apiKey?: string; apiUrl?: string}};
    zksync?: boolean;
    autoImpersonate?: boolean;
  }

  interface HttpNetworkUserConfig {
    live?: boolean;
    saveDeployments?: boolean;
    tags?: string[];
    deploy?: string | string[];
    companionNetworks?: {[name: string]: string};
    verify?: {etherscan?: {apiKey?: string; apiUrl?: string}};
    zksync?: boolean;
    autoImpersonate?: boolean;
  }

  interface ProjectPathsUserConfig {
    deploy?: string | string[];
    deployments?: string;
    imports?: string;
  }

  interface HardhatNetworkConfig {
    live: boolean;
    saveDeployments: boolean;
    tags: string[];
    deploy?: string[];
    companionNetworks: {[name: string]: string};
    verify?: {etherscan?: {apiKey?: string; apiUrl?: string}};
    zksync?: boolean;
    autoImpersonate?: boolean;
  }

  interface HttpNetworkConfig {
    live: boolean;
    saveDeployments: boolean;
    tags: string[];
    deploy?: string[];
    companionNetworks: {[name: string]: string};
    verify?: {etherscan?: {apiKey?: string; apiUrl?: string}};
    zksync?: boolean;
    autoImpersonate?: boolean;
  }

  interface ProjectPathsConfig {
    deploy: string[];
    deployments: string;
    imports: string;
  }
}

declare module 'hardhat/types/runtime' {
  interface HardhatRuntimeEnvironment {
    deployments: DeploymentsExtension;
    getNamedAccounts: () => Promise<{
      [name: string]: Address;
    }>;
    getUnnamedAccounts: () => Promise<string[]>;
    getChainId(): Promise<string>;
    companionNetworks: {
      [name: string]: {
        deployments: DeploymentsExtension;
        getNamedAccounts: () => Promise<{
          [name: string]: Address;
        }>;
        getUnnamedAccounts: () => Promise<string[]>;
        getChainId(): Promise<string>;
        provider: EthereumProvider;
      };
    };
  }

  interface Network {
    live: boolean;
    saveDeployments: boolean;
    tags: Record<string, boolean>;
    deploy: string[];
    companionNetworks: {[name: string]: string};
    verify?: {etherscan?: {apiKey?: string; apiUrl?: string}};
    zksync?: boolean;
    autoImpersonate?: boolean;
  }
}
