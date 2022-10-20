import { ChainInfo as _ChainInfo } from '@gnosis.pm/safe-react-gateway-sdk';
import { BigNumberish, BytesLike } from 'ethers';

export type ChainInfo = Pick<
  _ChainInfo,
  'chainName' | 'chainId' | 'shortName' | 'nativeCurrency' | 'blockExplorerUriTemplate'
>;

export { NativeCurrency } from '@gnosis.pm/safe-react-gateway-sdk';

export type BaseTransaction = {
  to: string;
  value: string;
  data: string;
};

export type GetTxBySafeTxHashParams = {
  safeTxHash: string;
};

export interface SendTransactionRequestParams {
  safeTxGas?: number;
}

export interface SendTransactionsParams {
  txs: BaseTransaction[];
  params?: SendTransactionRequestParams;
}

export type GetBalanceParams = { currency?: string };

export type SignMessageParams = {
  message: string;
};

export interface TypedDataDomain {
  name?: string;
  version?: string;
  chainId?: BigNumberish;
  verifyingContract?: string;
  salt?: BytesLike;
}

export interface TypedDataTypes {
  name: string;
  type: string;
}

export type TypedMessageTypes = { [key: string]: TypedDataTypes[] };

export type EIP712TypedData = {
  domain: TypedDataDomain;
  types: TypedMessageTypes;
  message: Record<string, any>;
};

export type SignTypedMessageParams = {
  typedData: EIP712TypedData;
};

export type SendTransactionsResponse = {
  safeTxHash: string;
};

export type SafeInfo = {
  safeAddress: string;
  chainId: number;
  threshold: number;
  owners: string[];
  isReadOnly: boolean;
};

export type EnvironmentInfo = {
  origin: string;
};

export type PostMessageOptions = {
  transfer?: any[];
};

export type AddressBookItem = {
  address: string;
  chainId: string;
  name: string;
};

export const isObjectEIP712TypedData = (obj?: unknown): obj is EIP712TypedData => {
  return typeof obj === 'object' && obj != null && 'domain' in obj && 'types' in obj && 'message' in obj;
};
