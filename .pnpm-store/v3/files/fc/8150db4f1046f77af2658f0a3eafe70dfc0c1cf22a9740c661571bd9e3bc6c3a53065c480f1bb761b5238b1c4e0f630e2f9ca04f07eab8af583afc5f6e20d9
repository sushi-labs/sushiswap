import { EventEmitter } from 'events';

export interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

export interface ProviderMessage {
  type: string;
  data: unknown;
}

export interface ProviderInfo {
  chainId: string;
}

export interface RequestArguments {
  method: string;
  params?: unknown[] | Record<string, unknown>;
}

export type ProviderChainId = string;

export type ProviderAccounts = string[];

export interface EIP1193Provider extends EventEmitter {
  connect(params?: any): Promise<void>;
  disconnect(): Promise<void>;
  request(args: RequestArguments): Promise<unknown>;
}
