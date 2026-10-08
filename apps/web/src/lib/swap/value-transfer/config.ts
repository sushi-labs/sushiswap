import { type EvmAddress, EvmChainId } from 'sushi/evm'

export const VALUE_TRANSFER_API_URL = 'https://transfer.layerzero-api.com/v1'
export const VALUE_TRANSFER_DISCOVERY_CACHE_SECONDS = 60
export const VALUE_TRANSFER_REQUEST_TIMEOUT_MS = 30_000

// TODO: Configure the 35 bps Sushi partner commission with LayerZero for
// LAYERZERO_VALUE_TRANSFER_API_KEY. The API configures fees per partner key;
// there is no documented per-quote fee recipient or commission parameter.

// TODO: Confirm these Sushi HYPE deployments are indexed by Value Transfer.
// This registry identifies HYPE pairs that prefer Value Transfer. It does not
// make a token selectable or a route executable before the API reports support.
export const VALUE_TRANSFER_PENDING_HYPE_DEPLOYMENTS = {
  [EvmChainId.HYPEREVM]: {
    contractAddress: '0x0e867974275Cd31C25015C2753C9d75F9f355379',
    kind: 'native-oft-adapter',
  },
  [EvmChainId.ROBINHOOD]: {
    contractAddress: '0xd6AdcE5eac5F40d29e2101436C38cF1ceE8F4856',
    kind: 'oft',
  },
  [EvmChainId.ARBITRUM]: {
    contractAddress: '0x0e867974275Cd31C25015C2753C9d75F9f355379',
    kind: 'oft',
  },
} as const satisfies Partial<
  Record<
    EvmChainId,
    {
      contractAddress: EvmAddress
      kind: 'native-oft-adapter' | 'oft'
    }
  >
>
