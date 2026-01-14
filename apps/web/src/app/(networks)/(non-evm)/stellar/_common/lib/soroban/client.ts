import { Horizon } from '@stellar/stellar-sdk'
import { Server } from '@stellar/stellar-sdk/rpc'
import { Client as FactoryContractClient } from '@sushiswap/stellar-contract-binding-factory'
import { Client as PoolContractClient } from '@sushiswap/stellar-contract-binding-pool'
import { Client as PoolLensContractClient } from '@sushiswap/stellar-contract-binding-pool-lens'
import { Client as PositionManagerContractClient } from '@sushiswap/stellar-contract-binding-position-manager'
import { Client as RouterContractClient } from '@sushiswap/stellar-contract-binding-router'
import { Client as TokenContractClient } from '@sushiswap/stellar-contract-binding-token'
import { Client as ZapRouterContractClient } from '@sushiswap/stellar-contract-binding-zap-router'
import { NETWORK_PASSPHRASE, RPC_URL } from '../constants'

// Initialize Soroban RPC server
// See https://developers.stellar.org/docs/data/apis/api-providers#publicly-accessible-apis
export const SorobanClient = new Server(RPC_URL, { allowHttp: true })

// Initialize Horizon RPC server
// See https://developers.stellar.org/docs/data/apis/horizon
export const HorizonClient = new Horizon.Server(RPC_URL, { allowHttp: true })

type ContractClientParams = {
  contractId: string
  publicKey?: string
}

export const getFactoryContractClient = ({
  contractId,
  publicKey,
}: ContractClientParams) =>
  new FactoryContractClient({
    contractId: contractId,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
    publicKey: publicKey,
  })

export const getRouterContractClient = ({
  contractId,
  publicKey,
}: ContractClientParams) =>
  new RouterContractClient({
    contractId: contractId,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
    publicKey: publicKey,
  })

export const getPoolContractClient = ({
  contractId,
  publicKey,
}: ContractClientParams) =>
  new PoolContractClient({
    contractId: contractId,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
    publicKey: publicKey,
  })

export const getPoolLensContractClient = ({
  contractId,
  publicKey,
}: ContractClientParams) =>
  new PoolLensContractClient({
    contractId: contractId,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
    publicKey: publicKey,
  })

export const getTokenContractClient = ({
  contractId,
  publicKey,
}: ContractClientParams) =>
  new TokenContractClient({
    contractId: contractId,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
    publicKey: publicKey,
  })

export const getPositionManagerContractClient = ({
  contractId,
  publicKey,
}: ContractClientParams) =>
  new PositionManagerContractClient({
    contractId: contractId,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
    publicKey: publicKey,
  })

export const getZapRouterContractClient = ({
  contractId,
  publicKey,
}: ContractClientParams) =>
  new ZapRouterContractClient({
    contractId: contractId,
    networkPassphrase: NETWORK_PASSPHRASE,
    rpcUrl: RPC_URL,
    publicKey: publicKey,
  })
