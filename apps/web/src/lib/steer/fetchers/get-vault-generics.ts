import type { VaultV1 } from '@sushiswap/graph-client/data-api'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { getWagmiConfig } from 'src/lib/wagmi/config'
import { formatNumber } from 'sushi'
import { EvmToken, tickToPrice } from 'sushi/evm'
import type { Address, PublicClient } from 'viem'
import { getPublicClient } from 'wagmi/actions'
import type { SteerStrategyGeneric } from '../components/steer-strategies'
import { getTokenRatios } from '../utils/get-token-ratios'
import { getVaultPositions } from './get-vault-position'

function getPriceExtremes(
  vault: VaultV1,
): SteerStrategyGeneric['priceExtremes'] {
  const token0 = new EvmToken(vault.token0)
  const token1 = new EvmToken(vault.token1)

  let lowerPrice = tickToPrice(token0, token1, vault.lowerTick).toSignificant(7)
  let upperPrice = tickToPrice(token0, token1, vault.upperTick).toSignificant(7)

  lowerPrice =
    !lowerPrice.includes('.') && lowerPrice.length > 9
      ? formatNumber(lowerPrice)
      : lowerPrice
  upperPrice =
    !upperPrice.includes('.') && upperPrice.length > 9
      ? formatNumber(upperPrice)
      : upperPrice
  return { min: lowerPrice, max: upperPrice }
}

function getAdjustment(vault: VaultV1): SteerStrategyGeneric['adjustment'] {
  const next = formatDistanceToNow(
    (vault.lastAdjustmentTimestamp + vault.adjustmentFrequency) * 1000,
    {
      addSuffix: true,
    },
  )
  const frequency = formatDistanceStrict(vault.adjustmentFrequency * 1000, 0)

  return { next, frequency }
}

export async function getVaultGenerics(
  vault: VaultV1,
): Promise<SteerStrategyGeneric> {
  const client = getPublicClient(getWagmiConfig(), {
    chainId: vault.chainId,
  }) as PublicClient

  const prices = await fetch(`https://api.sushi.com/price/v1/${vault.chainId}`)
    .then((data) => data.json())
    .then(
      (data) =>
        new Map(
          Object.entries(data).map(
            ([key, value]) => [key.toLowerCase(), value] as [Address, number],
          ),
        ),
    )

  const priceExtremes = getPriceExtremes(vault)
  const tokenRatios = await getTokenRatios({
    vault,
    prices,
  })
  const adjustment = getAdjustment(vault)
  const positions =
    (await getVaultPositions({
      client,
      vaultId: vault.id,
    })) || []

  return { priceExtremes, tokenRatios, adjustment, positions }
}
