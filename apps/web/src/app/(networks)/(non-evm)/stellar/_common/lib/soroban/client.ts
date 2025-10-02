import { Horizon } from '@stellar/stellar-sdk'
import { Server } from '@stellar/stellar-sdk/rpc'
import { RPC_URL } from '../constants'

// Initialize Soroban RPC server
// See https://developers.stellar.org/docs/data/apis/api-providers#publicly-accessible-apis
export const SorobanClient = new Server(RPC_URL, { allowHttp: true })

// Initialize Horizon RPC server
// See https://developers.stellar.org/docs/data/apis/horizon
export const HorizonClient = new Horizon.Server(RPC_URL, { allowHttp: true })
