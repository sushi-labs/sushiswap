import type { Address } from '@solana/addresses'
import { initGraphQLTada } from 'gql.tada'
import type { Scalars } from 'src/lib/types/scalars.js'
import type { EvmAddress } from 'sushi/evm'
import type { StellarAddress, StellarContractAddress } from 'sushi/stellar'
import type { introspection } from './data-api-env.js'

export const graphql = initGraphQLTada<{
  introspection: introspection
  scalars: Scalars & {
    Address: EvmAddress | Address | StellarAddress
    ContractAddress: EvmAddress | Address | StellarContractAddress
    SvmAddress: Address
  }
}>()
