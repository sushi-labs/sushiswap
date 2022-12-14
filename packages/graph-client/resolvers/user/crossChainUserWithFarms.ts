// @ts-nocheck
import { chainShortName } from '@sushiswap/chain'

import { getBuiltGraphSDK, Pair, Query, QueryResolvers, UserWithFarm } from '../../.graphclient'
import { getFarms } from '../../lib/farms'
import { fetchBalances } from '../../lib/wagmi'
import { transformPair } from '../../transformers'
// import { userWithLiquidityPositions } from './userWithLiquidityPositions'

export const crossChainUserWithFarms: QueryResolvers['crossChainUserWithFarms'] = async (
  root,
  args,
  context,
  info
): Promise<Query['crossChainUserWithFarms']> => {
  const sdk = getBuiltGraphSDK()

  const [farms, { liquidityPositions }, { crossChainChefUser: chefUser }] = await Promise.all([
    getFarms(),
    sdk.LiquidityPositions({
      chainIds: args.chainIds,
      where: {
        user: args.id.toLowerCase(),
        balance_gt: 0,
      },
    }),
    sdk.CrossChainChefUser({
      chainIds: args.chainIds,
      where: {
        address: args.id.toLowerCase(),
        amount_gt: 0,
      },
    }),
  ])
  // console.log({ chefUser: chefUser.shift() })

  const stakedLiquidityPositionChainIds = chefUser.map((chefUser) => chefUser?.chainId)
  const stakedLiquidityPositionBalances = Object.fromEntries(
    chefUser.map((chefUser) => [`${chefUser.chainId}:${chefUser?.pool?.pair}`, chefUser?.amount])
  )

  const unstakedLiquidityPositionChainIds = liquidityPositions.map(({ chainId }) => chainId)
  // WARNING: this is currently broken, will be a while until it's usable again across all subgraphs
  // we ensure that the liquidity position calls above are minimal,
  // so we can fetch the pairs at the end
  const unstakedLiquidityPositionBalances = Object.fromEntries(
    liquidityPositions.map((liquidityPosition) => [
      `${liquidityPosition.chainId}:${liquidityPosition.id.split('-')[0]}`,
      liquidityPosition.balance,
    ])
  )
  // CONT. so for the time being we'll take balances directly from the blockchain instead
  const _unstakedLiquidityPositionBalances = await fetchBalances(
    liquidityPositions.map((lp) => ({
      token: lp.id.split('-')[0],
      chainId: lp.chainId,
      user: args.id,
    }))
  )

  const chainIds = Array.from(new Set([...stakedLiquidityPositionChainIds, ...unstakedLiquidityPositionChainIds]))

  const pairs = await Promise.all(
    chainIds.map((chainId) =>
      sdk.PairsByChainId({
        chainId,
        where: {
          id_in: [
            ...liquidityPositions
              .filter((liquidityPosition) => liquidityPosition.chainId === chainId)
              .map(({ id }) => id.split('-')[0]),
            ...chefUser
              .filter((chefUser) => chefUser.chainId === chainId && typeof chefUser?.pool?.pair === 'string')
              .map((chefUser) => chefUser?.pool?.pair as string),
          ],
        },
      })
    )
  ).then((res) => res.flatMap(({ pairs }) => pairs))

  // console.log(`Fetched ${Object.keys(stakedPoolBalances).length} staked pool balances`, stakedPoolBalances)
  // console.log(`Fetched ${Object.keys(unstakedPoolBalances).length} unstaked pool balances`, unstakedPoolBalances)
  // console.log(`Fetched ${Object.keys(_unstakedPoolBalances).length} _unstaked pool balances`, _unstakedPoolBalances)
  // console.log(`Fetched ${pools.length} pools`)

  return Array.isArray(pairs)
    ? pairs
        .filter((pair) => {
          const id = `${pair.chainId}:${pair.id}`
          return id in _unstakedLiquidityPositionBalances || id in stakedLiquidityPositionBalances
        })
        .map((pair) => {
          const id = `${pair.chainId}:${pair.id}`
          const unstakedBalance = _unstakedLiquidityPositionBalances[id]
          const stakedBalance = stakedLiquidityPositionBalances[id]
          const balance = Number(unstakedBalance ?? 0) + Number(stakedBalance ?? 0)
          const valueUSD = (balance / Number(pair?.liquidity ?? 0)) * Number(pair?.liquidityUSD ?? 0)
          const farm = farms?.[pair.chainId]?.farms?.[pair.id]
          return {
            id: `${chainShortName[pair.chainId]}:${pair.id}`,
            chainId: pair.chainId,
            stakedBalance,
            unstakedBalance,
            valueUSD,
            pair: transformPair({ pair: pair as Pair, farm }),
          } as UserWithFarm
        })
    : []
}
