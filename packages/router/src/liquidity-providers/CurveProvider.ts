import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { getContract, parseAbi, PublicClient } from 'viem'

import { PoolCode } from '../pools/PoolCode'
import { LiquidityProvider, LiquidityProviders } from './LiquidityProvider'
import { string } from 'zod'

export enum CurvePoolType {
  Legacy = 'Legacy', // 'exchange(int128 i, int128 j, uint256 dx, uint256 min_dy) -> uint256'
  LegacyV2 = 'LegacyV2', // 'function coins(int128) pure returns (address)'
  LegacyV3 = 'LegacyV3',
  Factory = 'Factory',
}

export const CURVE_NON_FACTORY_POOLS: Record<number, [string, CurvePoolType][]> = {
  [ChainId.ETHEREUM]: [
    ['0xdc24316b9ae028f1497c275eb9192a3ea0f67022', CurvePoolType.Legacy],
    ['0xdcef968d416a41cdac0ed8702fac8128a64241a2', CurvePoolType.Legacy],
    ['0xf253f83aca21aabd2a20553ae0bf7f65c755a07f', CurvePoolType.Legacy],
    ['0xc5424b857f758e906013f3555dad202e4bdb4567', CurvePoolType.Legacy],
    ['0xa1f8a6807c402e4a15ef4eba36528a3fed24e577', CurvePoolType.Legacy],
    ['0x0ce6a5ff5217e38315f87032cf90686c96627caa', CurvePoolType.Legacy],
    ['0xa96a65c051bf88b4095ee1f2451c2a9d43f53ae2', CurvePoolType.Legacy],
    ['0xeb16ae0052ed37f479f7fe63849198df1765a733', CurvePoolType.Legacy],
    ['0xf9440930043eb3997fc70e1339dbb11f341de7a8', CurvePoolType.Legacy],
    ['0xa2b47e3d5c44877cca798226b7b8118f9bfb7a56', CurvePoolType.LegacyV2],
    ['0xfd5db7463a3ab53fd211b4af195c5bccc1a03890', CurvePoolType.Legacy],
    ['0xf178c0b5bb7e7abf4e12a4838c7b7c5ba2c623c0', CurvePoolType.Legacy],
    ['0x4ca9b3063ec5866a4b82e437059d2c43d1be596f', CurvePoolType.LegacyV3],
    ['0x93054188d876f558f4a66b2ef1d97d16edf0895b', CurvePoolType.LegacyV2],
  ],
}

export const CURVE_FACTORY_ADDRESSES = {
  [ChainId.ETHEREUM]: [
    '0x0959158b6040d32d04c301a72cbfd6b39e21c9ae',
    '0xb9fc157394af804a3578134a6585c0dc9cc990d4',
    //'0xf18056bbd320e96a48e3fbf8bc061322531aac99', for crypto2 pools only
  ],
}

async function getAllSupportedCurvePools(publicClient: PublicClient): Promise<Map<string, CurvePoolType>> {
  const result: Map<string, CurvePoolType> = new Map()
  const chainId = await publicClient.getChainId()
  const factoryABI = parseAbi([
    'function pool_count() pure returns (uint256)',
    'function pool_list(uint256) pure returns (address)',
    //'function get_n_coins(address) pure returns (uint256)',
  ])
  const promises = CURVE_FACTORY_ADDRESSES[chainId as keyof typeof CURVE_FACTORY_ADDRESSES].map(async (factory) => {
    const factoryContract = getContract({
      address: factory as '0x${string}',
      abi: factoryABI,
      publicClient,
    })

    const poolNum = await factoryContract.read.pool_count()
    for (let i = 0n; i < poolNum; ++i) {
      const poolAddress = await factoryContract.read.pool_list([i])
      result.set(poolAddress, CurvePoolType.Factory)
    }
  })
  await Promise.all(promises)

  CURVE_NON_FACTORY_POOLS[chainId as keyof typeof CURVE_FACTORY_ADDRESSES].forEach((pool) =>
    result.set(pool[0], pool[1])
  )

  return result
}

/*async function getCurvePoolCode(publicClient: PublicClient, poolAddress: string, poolType: CurvePoolType): Promise<PoolCode> {
  const poolContract = new Contract(
    poolAddress,
    [
      poolType !== CurvePoolType.LegacyV2 && poolType !== CurvePoolType.LegacyV3
        ? 'function exchange(int128 i, int128 j, uint256 dx, uint256 min_dy) payable returns (uint256)'
        : 'function exchange(int128 i, int128 j, uint256 dx, uint256 min_dy) payable returns ()',
      'function A() pure returns (uint256)',
      'function fee() pure returns (uint256)',
      poolType !== CurvePoolType.LegacyV2
        ? 'function coins(uint256) pure returns (address)'
        : 'function coins(int128) pure returns (address)',
      poolType !== CurvePoolType.LegacyV2
        ? 'function balances(uint256) pure returns (uint256)'
        : 'function balances(int128) pure returns (uint256)',
    ],
    user
  )

  const userAddress = await user.getAddress()
  const tokenContracts = []
  const tokenTines: RToken[] = []
  for (let i = 0; i < 100; ++i) {
    let token
    try {
      token = await poolContract.coins(i)
    } catch (e) {
      break
    }
    if (token == '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') {
      // native
      tokenContracts.push(undefined)
      tokenTines.push({ address: token, name: token, symbol: token, chainId: 1, decimals: 18 })
    } else {
      const res = await setTokenBalance(token, userAddress, initialBalance)
      expect(res).equal(true, 'Wrong setTokenBalance for ' + token)

      const tokenContract = new Contract(token, erc20Abi, user)
      try {
        await tokenContract.approve(poolAddress, initialBalance.toString())
      } catch (_) {
        // in try block because crv token (0xD533a949740bb3306d119CC777fa900bA034cd52) doesn't allow re-approve (((
      }
      tokenContracts.push(tokenContract)

      const decimals = await tokenContract.decimals()
      tokenTines.push({ address: token, name: token, symbol: token, chainId: 1, decimals })
    }
}*/

export class CurveProvider extends LiquidityProvider {
  foundPools: Map<string, PoolCode> = new Map()

  constructor(chainId: ChainId, web3Client: PublicClient) {
    super(chainId, web3Client)
  }

  override getType(): LiquidityProviders {
    return LiquidityProviders.CurveSwap
  }

  /**
   * The name of liquidity provider to be used for pool naming. For example, 'SushiSwap'
   */
  override getPoolProviderName(): string {
    return 'CurveSwap'
  }

  /**
   * Initiates event listeners for top pools
   */
  override startFetchPoolsData(): void {
    // simple implementation - no prefetching
  }

  /**
   * Fetches relevant pools for the given tokens
   * @param t0 Token
   * @param t1 Token
   */
  override fetchPoolsForToken(t0: Token, t1: Token, excludePools?: Set<string>): Promise<void> {}

  /**
   * Returns a list of PoolCode
   * @returns PoolCode[]
   */
  override getCurrentPoolList(): PoolCode[] {
    return Array.from(this.foundPools.values())
  }

  override stopFetchPoolsData(): void {
    // nothing at start - nothing at stop
  }
}
