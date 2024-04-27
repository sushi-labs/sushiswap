import { getCreate2Address } from '@ethersproject/address'
import { Address, PublicClient, encodePacked, keccak256 } from 'viem'
import { ChainId } from '../../chain/index.js'

import { Token } from '../../currency/Token.js'
import { getCurrencyCombinations } from '../get-currency-combinations.js'
import { LiquidityProviders } from './LiquidityProvider.js'
import { StaticPool, UniswapV2BaseProvider } from './UniswapV2Base.js'

// Enosys has different initCodeHash, so it is required to override the pool address
// calculations methods to use all the available initCodeHashes
export class EnosysProvider extends UniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.FLARE]: '0x28b70f6Ed97429E40FE9a9CD3EB8E86BCBA11dd4',
    } as const
    const initCodeHash = {
      [ChainId.FLARE]: [
        '0x99e82d1f1ab2914f983fb7f2b987a3e30a55ad1fa8c38239d1f7c1a24fb93e3d',
        '0xa1ab3f6a293fb82d68afb63ad2a5352fc49d5f3dfa28b151a85c382a91dd574b',
      ],
    } as const
    super(chainId, web3Client, factory, initCodeHash as any)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.Enosys
  }
  getPoolProviderName(): string {
    return 'Enosys'
  }

  // uses all availbale initCodeHashes to return array of calculated pool addresses
  _getPoolAddresses(t1: Token, t2: Token): Address[] {
    return (this.initCodeHash[this.chainId] as any as string[]).map(
      (initCodeHash) => {
        return getCreate2Address(
          this.factory[this.chainId as keyof typeof this.factory]!,
          keccak256(
            encodePacked(
              ['address', 'address'],
              [t1.address as Address, t2.address as Address],
            ),
          ),
          initCodeHash,
        ) as Address
      },
    )
  }

  // override the original method to just flatMap() the calculated pool addresses
  // instead of map() as in original method one pool address is calculated
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
      return poolAddresses.map((poolAddress) => ({
        address: poolAddress,
        token0: combination[0]!,
        token1: combination[1]!,
        fee: this.fee,
      }))
    })
  }
}
