import { getBuiltGraphSDK, QueryResolvers, Resolvers, UserWithFarm } from '../.graphclient'
import { fetchBalances } from '../lib/wagmi'

export const crossChainUserWithFarms: QueryResolvers['crossChainUserWithFarms'] = async (
  root,
  args,
  context,
  info
): Promise<UserWithFarm[]> => {
  // const farms: Query['farms'] = await context.Farm.Query.farms({ root, args, context, info })

  // const prices: Query['prices'] = await context.Price.Query.prices({ root, args: [], context, info })
  // console.log({ prices })

  const sdk = getBuiltGraphSDK()

  const { crossChainLiquidityPositions: liquidityPositions } = await sdk.CrossChainLiquidityPositions({
    chainIds: args.chainIds,
    where: {
      user: args.id,
      balance_gt: 0,
    },
  })
  // console.log({ liquidityPositions: liquidityPositions.shift() })

  const { crossChainChefUser: chefUser } = await sdk.CrossChainChefUser({
    chainIds: args.chainIds,
    where: {
      address: args.id.toLowerCase(),
      amount_gt: 0,
    },
  })
  // console.log({ chefUser: chefUser.shift() })

  const stakedPoolChainIds = chefUser.map((chefUser) => chefUser?.chainId)
  const stakedPoolIds = chefUser.map((chefUser) => `${String(chefUser?.chainId)}:${String(chefUser?.pool?.pair)}`)
  const stakedPoolBalances = Object.fromEntries(
    chefUser.map((chefUser) => [`${chefUser.chainId}:${chefUser?.pool?.pair}`, chefUser?.amount])
  )

  const liquidityPositionChainIds = liquidityPositions.map(({ chainId }) => chainId)
  const liquidityPositionPairIds = liquidityPositions.map(({ id, chainId }) => `${chainId}:${id.split('-')[0]}`)

  // WARNING: this is currently broken, will be a while until it's usable again across all subgraphs
  // we ensure that the liquidity position calls above are minimal,
  // so we can fetch the pairs at the end
  const unstakedPoolBalances = Object.fromEntries(
    liquidityPositions.map((liquidityPosition) => [
      `${liquidityPosition.chainId}:${liquidityPosition.id.split('-')[0]}`,
      liquidityPosition.balance,
    ])
  )
  // CONT. so for the time being we'll take balances directly from the blockchain instead
  const _unstakedPoolBalances = await fetchBalances(
    liquidityPositions.map((lp) => ({
      token: lp.id.split('-')[0],
      chainId: lp.chainId,
      user: args.id,
    }))
  )

  const pools = await Promise.all(
    Array.from(new Set([...stakedPoolChainIds, ...liquidityPositionChainIds])).map((chainId) =>
      sdk.CrossChainPairs({
        chainIds: [chainId],
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
  ).then((pools) =>
    pools
      .flat()
      .map(({ crossChainPairs }) => crossChainPairs)
      .flat()
  )
  // console.log({ pools: pools.flat() })

  console.log(`Fetched ${Object.keys(stakedPoolBalances).length} staked pool balances`, stakedPoolBalances)
  console.log(`Fetched ${Object.keys(unstakedPoolBalances).length} unstaked pool balances`, unstakedPoolBalances)
  console.log(`Fetched ${Object.keys(_unstakedPoolBalances).length} _unstaked pool balances`, _unstakedPoolBalances)
  console.log(`Fetched ${pools.length} pools`)

  console.log(
    Array.from(new Set([...liquidityPositionPairIds, ...stakedPoolIds]))
      .filter(
        (id) =>
          // this will filter out pair with no staked or unstaked balances...
          (id in _unstakedPoolBalances || id in stakedPoolBalances) &&
          // and kashi pairs or other unknown pairs
          pools.find((el) => {
            return `${el.chainId}:${el.id}` === id
          })
      )
      .map((id: string) => {
        const unstakedBalance = _unstakedPoolBalances[id]
        const stakedBalance = stakedPoolBalances[id]
        const pair = pools.find((el) => el.id === id.split(':')[1])
        const balance = Number(unstakedBalance ?? 0) + Number(stakedBalance ?? 0)
        const valueUSD = (balance / Number(pair?.liquidity ?? 0)) * Number(pair?.liquidityUSD ?? 0)
        return {
          id: pair?.id,
          chainId: pair?.chainId,
          stakedBalance,
          unstakedBalance,
          valueUSD,
          pair,
        }
      })
  )

  return Array.from(new Set([...liquidityPositionPairIds, ...stakedPoolIds]))
    .filter(
      (id) =>
        // this will filter out pair with no staked or unstaked balances...
        (id in _unstakedPoolBalances || id in stakedPoolBalances) &&
        // and kashi pairs or other unknown pairs
        pools.find((el) => {
          return `${el.chainId}:${el.id}` === id
        })
    )
    .map((id: string) => {
      const unstakedBalance = _unstakedPoolBalances[id]
      const stakedBalance = stakedPoolBalances[id]
      const pair = pools.find((el) => el.id === id.split(':')[1])
      const balance = Number(unstakedBalance ?? 0) + Number(stakedBalance ?? 0)

      if (id.includes('0x193008eaade86658df8237a436261e23e3bcbbaa')) {
        console.log({ stakedBalance, unstakedBalance, pair })
      }

      const valueUSD = (balance / Number(pair?.liquidity ?? 0)) * Number(pair?.liquidityUSD ?? 0)
      return {
        id: pair?.id,
        chainId: pair?.chainId,
        stakedBalance,
        unstakedBalance,
        valueUSD,
        pair,
      }
    }) as UserWithFarm[]
}

export const resolvers: Resolvers = {
  Query: {
    crossChainUserWithFarms,
  },
}
