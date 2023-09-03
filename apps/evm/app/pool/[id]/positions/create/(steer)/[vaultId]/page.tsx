import { getSteerVault } from '@sushiswap/client'
import { SteerVault } from '@sushiswap/client/src/pure/steer-vault/vault'
import { Token } from '@sushiswap/currency'
import { formatNumber, unsanitize } from '@sushiswap/format'
import { getSteerVaultPositions, getTokenRatios } from '@sushiswap/steer-sdk'
import { tickToPrice } from '@sushiswap/v3-sdk'
import { config } from '@sushiswap/viem-config'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { SteerStrategyComponents, SteerStrategyGeneric } from 'ui/pool/Steer/Strategies'
import { createPublicClient, PublicClient } from 'viem'

function getPriceExtremes(vault: SteerVault): SteerStrategyGeneric['priceExtremes'] {
  const token0 = new Token({ chainId: vault.pool.chainId, ...vault.pool.token0 })
  const token1 = new Token({ chainId: vault.pool.chainId, ...vault.pool.token1 })

  let lowerPrice = tickToPrice(token0, token1, vault.lowerTick).toSignificant(7)
  let upperPrice = tickToPrice(token0, token1, vault.upperTick).toSignificant(7)

  lowerPrice = !lowerPrice.includes('.') && lowerPrice.length > 9 ? formatNumber(lowerPrice) : lowerPrice
  upperPrice = !upperPrice.includes('.') && upperPrice.length > 9 ? formatNumber(upperPrice) : upperPrice

  return { min: lowerPrice, max: upperPrice }
}

function getAdjustment(vault: SteerVault): SteerStrategyGeneric['adjustment'] {
  const next = formatDistanceToNow((vault.lastAdjustmentTimestamp + vault.adjustmentFrequency) * 1000, {
    addSuffix: true,
  })
  const frequency = formatDistanceStrict(vault.adjustmentFrequency * 1000, 0)

  return { next, frequency }
}

async function getGenerics(vault: SteerVault): Promise<SteerStrategyGeneric> {
  const priceExtremes = getPriceExtremes(vault)
  const tokenRatios = await getTokenRatios(vault)
  const adjustment = getAdjustment(vault)
  const positions = (await getSteerVaultPositions({ client: getClient(vault), vaultId: vault.id })) || []

  return { priceExtremes, tokenRatios, adjustment, positions }
}

// Temporary
function getClient(vault: SteerVault): PublicClient {
  return createPublicClient(config[vault.pool.chainId])
}

export default async function SteerVaultPage({ params }: { params: { vaultId: string } }) {
  const vaultId = unsanitize(params.vaultId)

  const vault = await getSteerVault(vaultId)

  const Component = SteerStrategyComponents[vault.strategy]

  return <Component vault={vault} generic={await getGenerics(vault)} />
}
