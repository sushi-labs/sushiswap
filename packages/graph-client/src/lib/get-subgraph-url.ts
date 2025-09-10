import { type EvmChainId, SUSHI_DOMAIN_RESTRICTED_API_KEY } from 'sushi/evm'

type GetSubgraphUrlArgs<CHAIN extends EvmChainId> = {
  chainId: CHAIN
  getter: (
    chainId: CHAIN,
    config: { decentralizedKey: string },
  ) => string | undefined
}

const DECENTRALIZED_NETWORK_KEY =
  process.env['SUSHI_GRAPH_KEY'] ||
  process.env['NEXT_PUBLIC_SUSHI_GRAPH_KEY'] ||
  SUSHI_DOMAIN_RESTRICTED_API_KEY

export function getSubgraphUrl<CHAIN extends EvmChainId>({
  chainId,
  getter,
}: GetSubgraphUrlArgs<CHAIN>) {
  const baseUrl = getter(chainId, {
    decentralizedKey: DECENTRALIZED_NETWORK_KEY,
  })

  if (!baseUrl) {
    throw new Error(`No subgraph URL found for chainId ${chainId}`)
  }

  return `https://${baseUrl}`
}
