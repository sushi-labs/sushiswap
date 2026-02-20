import {
  type VaultV1,
  getVault,
  isSmartPoolChainId,
} from '@sushiswap/graph-client/data-api'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import {
  SteerBaseStrategy,
  type SteerStrategyGeneric,
} from 'src/lib/steer/components/steer-strategies'
import { getVaultPositions } from 'src/lib/steer/fetchers/get-vault-position'
import { getTokenRatios } from 'src/lib/steer/utils'
import { getWagmiConfig } from 'src/lib/wagmi/config'
import { formatNumber } from 'sushi'
import {
  type EvmChainId,
  EvmToken,
  isSushiSwapV3ChainId,
  tickToPrice,
} from 'sushi/evm'
import { type Address, type PublicClient, isAddress } from 'viem'
import { getPublicClient } from 'wagmi/actions'
import { getCachedV3Pool } from '../../_lib/get-cached-v3-pool'

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

async function getGenerics(vault: VaultV1): Promise<SteerStrategyGeneric> {
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
  // console.log('vault', vault)
  // console.log('tokenRatios', tokenRatios)
  const adjustment = getAdjustment(vault)
  const positions =
    (await getVaultPositions({
      client,
      vaultId: vault.id,
    })) || []

  return { priceExtremes, tokenRatios, adjustment, positions }
}

export default async function SteerVaultPage(props: {
  params: Promise<{ chainId: string; vault: string; address: string }>
}) {
  const params = await props.params
  const chainId = Number(params.chainId) as EvmChainId
  const vaultAddress = params.vault
  const poolAddress = params.address

  if (
    !isSushiSwapV3ChainId(chainId) ||
    !isSmartPoolChainId(chainId) ||
    !isAddress(poolAddress, { strict: false }) ||
    !isAddress(vaultAddress, { strict: false })
  ) {
    return notFound()
  }

  const pool = (await getCachedV3Pool({ chainId, address: poolAddress }))!

  const vault = (await unstable_cache(
    async () =>
      await getVault({
        chainId,
        vaultAddress,
      }),
    ['vault', `${params.chainId}:${params.vault}`],
    { revalidate: 60 * 15 },
  )()) as NonNullable<VaultV1>

  // const generics = await unstable_cache(
  //   async () => await getGenerics(vault),
  //   ['steer-vault-generics', `${params.chainId}:${params.vault}`],
  //   {
  //     // revalidate: 60 * 15,
  //   },
  // )()

  const generics = await getGenerics(vault)

  const Component = SteerBaseStrategy

  return <Component pool={pool} vault={vault} generic={generics} />
}
