import { sz } from 'sushi'
import type { EvmAddress } from 'sushi/evm'
import { isAddressEqual } from 'viem'
import * as z from 'zod'

export const robinhoodStockTokensSchema = z.object({
  assets: z.array(
    z.object({
      tokenSymbol: z.string(),
      tokenName: z.string(),
      deployments: z.array(
        z.object({
          chainId: z.number().int().positive(),
          contractAddress: sz.evm.address(),
        }),
      ),
    }),
  ),
})

export type RobinhoodStockToken = z.infer<
  typeof robinhoodStockTokensSchema
>['assets'][number]

/** Only canonical chain/address matches establish Robinhood issuance. */
export function isRobinhoodStockToken(
  token: { chainId: number; address: EvmAddress },
  stockTokens: readonly RobinhoodStockToken[] | undefined,
): boolean {
  return (
    stockTokens?.some((stockToken) =>
      stockToken.deployments.some(
        (deployment) =>
          deployment.chainId === token.chainId &&
          isAddressEqual(deployment.contractAddress, token.address),
      ),
    ) ?? false
  )
}
