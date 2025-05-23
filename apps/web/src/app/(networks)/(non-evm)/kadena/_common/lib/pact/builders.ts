import { Pact } from '@kadena/client'

export const buildGetBalanceTx = (
  account: string,
  chainId: number,
  networkId: string,
) =>
  Pact.builder
    // @ts-expect-error
    .execution(Pact.modules.coin['get-balance'](account))
    .setMeta({ chainId: String(chainId) })
    .setNetworkId(networkId)
    .createTransaction()

export const buildGetTokenMetaTx = (
  tokenContract: string,
  chainId: number,
  networkId: string,
) =>
  Pact.builder
    .execution(`(${tokenContract}.get-meta)`)
    .setMeta({ chainId: String(chainId) })
    .setNetworkId(networkId)
    .createTransaction()
