import { AbiStateMutability, Address, ContractFunctionParameters } from 'viem'
import { Native, Token, Type } from '../../currency/index.js'
import { RToken, createCurvePoolsForMultipool } from '../../tines/index.js'
import { CurvePoolType, curvePoolABI, getPoolRatio } from '../curve-sdk.js'
import { getCurrencyCombinations } from '../get-currency-combinations.js'
import { CurvePoolCode } from '../pool-codes/CurvePool.js'
import { PoolCode } from '../pool-codes/PoolCode.js'
import CurvePoolWhiteList from './CurvePoolsWhitelist.json'
import { LiquidityProvider, LiquidityProviders } from './LiquidityProvider.js'

interface PoolWhitelistInfo {
  pool: Address
  poolType: CurvePoolType
  tokens: Type[]
}

export class CurveProviderWhiteList extends LiquidityProvider {
  poolsWhiteList: PoolWhitelistInfo[] = []
  foundPools: PoolCode[] = []

  override getType(): LiquidityProviders {
    return LiquidityProviders.CurveSwap
  }

  /**
   * The name of liquidity provider to be used for pool naming. For example, 'SushiSwap'
   */
  override getPoolProviderName(): string {
    return 'Curve'
  }

  /**
   * Initiates event listeners for top pools
   */
  override startFetchPoolsData(): void {
    // simple implementation - no prefetching
    this.poolsWhiteList = CurvePoolWhiteList.pools.map((p) => ({
      pool: p.pool as Address,
      poolType: p.poolType as CurvePoolType,
      tokens: p.tokens.map((t) => {
        if (t.address === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
          return Native.onChain(this.chainId)
        else return new Token({ ...t, chainId: this.chainId })
      }),
    }))
  }

  async getPoolsForTokens(
    t0: Token,
    t1: Token,
    excludePools?: Set<string>,
  ): Promise<Map<Address, [CurvePoolType, Type[]]>> {
    const tokens = new Set(
      getCurrencyCombinations(this.chainId, t0, t1)
        .flat()
        .map((t) => t.address),
    )
    const pools: Map<Address, [CurvePoolType, Type[]]> = new Map()
    this.poolsWhiteList.forEach((p) => {
      if (excludePools?.has(p.pool)) return
      let usedTokens = 0
      for (let i = 0; i < p.tokens.length; ++i) {
        const tok = p.tokens[i]
        if (tok instanceof Token) {
          if (tokens.has(tok.address)) ++usedTokens
        } else if (tokens.has('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'))
          ++usedTokens
        if (usedTokens >= 2) {
          pools.set(p.pool, [p.poolType, p.tokens])
          return
        }
      }
    })
    return pools
  }

  async getPoolRatio(
    pools: [string, [CurvePoolType, Type[]]][],
  ): Promise<(number[] | undefined)[]> {
    return await Promise.all(
      pools.map((p) =>
        getPoolRatio(
          this.client,
          p[0] as Address,
          p[1][1].map((t) =>
            t instanceof Token
              ? t.address
              : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          ),
        ),
      ),
    )
    /*if (this.chainId === ChainId.ETHEREUM) {
      const ratios = await this.client.multicall({
        multicallAddress: this.client.chain?.contracts?.multicall3
          ?.address as '0x${string}',
        allowFailure: true,
        contracts: [
          {
            address: '0xE95A203B1a91a908F9B9CE46459d101078c2c3cb', // ankr
            //chainId: this.chainId,
            abi: parseAbi(['function ratio() pure returns (uint256)'] as const),
            functionName: 'ratio',
          },
          {
            address: '0x9559aaa82d9649c7a7b220e7c461d2e74c9a3593', // rETH
            //chainId: this.chainId,
            abi: parseAbi([
              'function getExchangeRate() pure returns (uint256)',
            ] as const),
            functionName: 'getExchangeRate',
          },
          {
            address: '0x39aa39c021dfbae8fac545936693ac917d5e7563', // cUSDC
            //chainId: this.chainId,
            abi: parseAbi([
              'function exchangeRateCurrent() pure returns (uint256)',
            ] as const),
            functionName: 'exchangeRateCurrent',
          },
          {
            address: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', // cDAI
            //chainId: this.chainId,
            abi: parseAbi([
              'function exchangeRateCurrent() pure returns (uint256)',
            ] as const),
            functionName: 'exchangeRateCurrent',
          },
        ],
      })
      return pools.map(([poolAddress]) => {
        // collection of freaks
        switch (poolAddress.toLowerCase()) {
          case '0xa96a65c051bf88b4095ee1f2451c2a9d43f53ae2': {
            //ankrETH pool
            const _ratio = ratios[0].result
            return _ratio !== undefined ? [1, 1e18 / Number(_ratio)] : undefined
          }
          case '0xf9440930043eb3997fc70e1339dbb11f341de7a8': {
            // rETH pool
            const _ratio = ratios[1].result
            return _ratio !== undefined ? [1, Number(_ratio) / 1e18] : undefined
          }
          case '0xa2b47e3d5c44877cca798226b7b8118f9bfb7a56': {
            // compound pool cUSDC-cDAI
            const _ratio0 = ratios[2].result
            const _ratio1 = ratios[3].result
            return _ratio0 !== undefined && _ratio1 !== undefined
              ? [1, (Number(_ratio0) * 1e12) / Number(_ratio1)]
              : undefined
          }
          default:
            return [1, 1]
        }
      })
    } else return pools.map(() => [1, 1])*/
  }

  async getCurvePoolCodes(
    pools: Map<Address, [CurvePoolType, Type[]]>,
  ): Promise<PoolCode[]> {
    const poolArray = Array.from(pools.entries())
    const poolsMulticall = <
      T extends ContractFunctionParameters<
        (typeof curvePoolABI)[keyof typeof curvePoolABI]
      >['functionName'],
    >(
      functionName: T,
      args?: ContractFunctionParameters<
        (typeof curvePoolABI)[keyof typeof curvePoolABI],
        AbiStateMutability,
        T
      >['args'],
    ) => {
      return this.client.multicall({
        multicallAddress: this.client.chain?.contracts?.multicall3
          ?.address as '0x${string}',
        allowFailure: true,
        contracts: poolArray.map(([address, [poolType]]) => ({
          address: address as Address,
          // //chainId: this.chainId,
          abi: curvePoolABI[poolType],
          functionName: functionName,
          args,
        })) as any,
      })
    }

    const A = await poolsMulticall('A')
    const fee = await poolsMulticall('fee')
    const balance0 = await poolsMulticall('balances', [0n])
    const balance1 = await poolsMulticall('balances', [1n])
    const balance2 = await poolsMulticall('balances', [2n])
    const balance3 = await poolsMulticall('balances', [3n])
    const ratio = await this.getPoolRatio(poolArray)

    const poolCodes = poolArray.flatMap(([poolAddress, [, tokens]], i) => {
      const _fee = fee[i]!.result as bigint
      const _A = A[i]!.result as bigint
      const _balance0 = balance0[i]!.result as bigint
      const _balance1 = balance1[i]!.result as bigint
      const _balance2 = balance2[i]!.result as bigint
      const _balance3 = balance3[i]!.result as bigint
      const _ratio = ratio[i]
      if (
        _fee === undefined ||
        _A === undefined ||
        _balance0 === undefined ||
        _balance1 === undefined ||
        _ratio === undefined
      )
        return []
      const poolTines = createCurvePoolsForMultipool(
        poolAddress,
        tokens as RToken[],
        Number(_fee) / 1e10,
        Number(_A),
        [_balance0, _balance1, _balance2, _balance3].slice(0, tokens.length),
        _ratio,
      )

      return poolTines.map(
        (p) => new CurvePoolCode(p, this.getType(), this.getPoolProviderName()),
      )
    })

    return poolCodes.filter((p) => p !== undefined) as PoolCode[]
  }

  /**
   * Fetches relevant pools for the given tokens
   * @param t0 Token
   * @param t1 Token
   */
  override async fetchPoolsForToken(
    t0: Token,
    t1: Token,
    excludePools?: Set<string>,
  ): Promise<void> {
    const pools = await this.getPoolsForTokens(t0, t1, excludePools)
    this.foundPools = await this.getCurvePoolCodes(pools)
    //console.log(JSON.stringify(this.foundPools, undefined, '   '))
  }

  /**
   * Returns a list of PoolCode
   * @returns PoolCode[]
   */
  override getCurrentPoolList(): PoolCode[] {
    return this.foundPools
  }

  override stopFetchPoolsData(): void {
    // nothing at start - nothing at stop
  }
}
