import { getCreate2Address } from '@ethersproject/address'
import { Address, PublicClient, encodePacked, keccak256, parseAbi } from 'viem'
import { ChainId } from '../../chain/index.js'
import { Token } from '../../currency/index.js'
import { DataFetcherOptions } from '../data-fetcher.js'
import { getCurrencyCombinations } from '../get-currency-combinations.js'
import { memoizer } from '../memoizer.js'
import { RainUniswapV2BaseProvider } from '../rain/RainUniswapV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'
import { StaticPool } from './UniswapV2Base.js'

const GetFeesAbi = parseAbi([
  'function getFee(bool _stable) public view returns(uint256)',
])

export class LynexV1Provider extends RainUniswapV2BaseProvider {
  STABLE_FEE = 0.0001
  VOLATILE_FEE = 0.0025
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.LINEA]: '0xBc7695Fd00E3b32D08124b7a4287493aEE99f9ee',
    } as const
    const initCodeHash = {
      [ChainId.LINEA]:
        '0xf40e8808230a29863f9f7f99beb90d28bca2c60094e78d93cca67f746dbfd142',
    } as const
    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.LynexV1
  }
  getPoolProviderName(): string {
    return 'LynexV1'
  }

  // overriden to read the fees from the factory,
  // LynexV1 can have different fee for pools that are `stable` or not
  // so read the stable and non stable fees before generating pools
  // addresses and use those fees for fetched pools and then reading the pools reserves
  override async fetchPoolsForToken(
    t0: Token,
    t1: Token,
    excludePools?: Set<string>,
    options?: DataFetcherOptions,
  ): Promise<void> {
    // get current fees
    const multicallMemoize = await memoizer.fn(this.client.multicall)
    const getFeesData = {
      multicallAddress: this.client.chain?.contracts?.multicall3
        ?.address as Address,
      allowFailure: false,
      blockNumber: options?.blockNumber,
      contracts: [true, false].map(
        (isStable) =>
          ({
            address: this.factory[
              this.chainId as keyof typeof this.factory
            ] as Address,
            chainId: this.chainId,
            abi: GetFeesAbi,
            functionName: 'getFee',
            args: [isStable],
          }) as const,
      ),
    }
    const fees = options?.memoize
      ? await (multicallMemoize(getFeesData) as Promise<any>).catch((e) => {
          console.warn(
            `${this.getLogPrefix()} - UPDATE: on-demand pools multicall failed, message: ${
              e.message
            }`,
          )
          return undefined
        })
      : await this.client.multicall(getFeesData).catch((e) => {
          console.warn(
            `${this.getLogPrefix()} - UPDATE: on-demand pools multicall failed, message: ${
              e.message
            }`,
          )
          return undefined
        })
    // convert to % in number
    // returned values are represented in 1/100th of a percent
    // so returned value of 25 is 0.25%, ie 0.0025 in numeric value
    this.STABLE_FEE = Number(fees[0]) * 0.0001
    this.VOLATILE_FEE = Number(fees[1]) * 0.0001

    // proceed the rest as a normal univ2 based dex
    await this.getOnDemandPools(t0, t1, excludePools, options)
  }

  // LynexV1 has an extra bool variable in its pool address salt
  _getPoolAddresses(t1: Token, t2: Token): Address[] {
    return [
      getCreate2Address(
        this.factory[this.chainId as keyof typeof this.factory]!,
        keccak256(
          encodePacked(
            ['address', 'address', 'bool'],
            [t1.address as Address, t2.address as Address, true],
          ),
        ),
        this.initCodeHash[this.chainId as keyof typeof this.initCodeHash]!,
      ) as Address,
      getCreate2Address(
        this.factory[this.chainId as keyof typeof this.factory]!,
        keccak256(
          encodePacked(
            ['address', 'address', 'bool'],
            [t1.address as Address, t2.address as Address, false],
          ),
        ),
        this.initCodeHash[this.chainId as keyof typeof this.initCodeHash]!,
      ) as Address,
    ]
  }

  // same as original getStaticPools() in RainUniswapV2BaseProvider, but
  // just overriden to do flatMap() to flatten array of pool addresses
  // per token pair, since LynexV1 also has bool variable in the pool address salt
  // also has 2 fees if the pair is `stable` or not
  override getStaticPools(t1: Token, t2: Token): StaticPool[] {
    const currencyCombination = getCurrencyCombinations(
      this.chainId,
      t1,
      t2,
    ).map(([c0, c1]) => (c0.sortsBefore(c1) ? [c0, c1] : [c1, c0]))
    return currencyCombination.flatMap((combination) => {
      const poolAddresses = this._getPoolAddresses(
        combination[0]!,
        combination[1]!,
      )
      return poolAddresses.map((poolAddress, i) => ({
        address: poolAddress,
        token0: combination[0]!,
        token1: combination[1]!,
        // set fee for stable and volatile
        fee: i === 0 ? this.STABLE_FEE : this.VOLATILE_FEE,
      }))
    })
  }
}
