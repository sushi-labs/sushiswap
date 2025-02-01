import { PublicClient } from 'viem'
import { ChainId } from '../../chain/index.js'
import { AlgebraV2BaseProvider } from './AlgebraV2Base.js'
import { LiquidityProviders } from './LiquidityProvider.js'

export class ScribeProvider extends AlgebraV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.SCROLL]: '0xDc62aCDF75cc7EA4D93C69B2866d9642E79d5e2e',
    } as const
    const poolDeployer = {
      [ChainId.SCROLL]: '0xbAE27269D777D6fc0AefFa9DfAbA8960291E51eB',
    } as const
    const initCodeHash = {
      [ChainId.SCROLL]:
        '0x4b9e4a8044ce5695e06fce9421a63b6f5c3db8a561eebb30ea4c775469e36eaf',
    } as const
    const tickLens = {
      [ChainId.SCROLL]: '0xECd0DD811B55f5b7e20e7999f1e986Ba7d7df901',
    } as const
    super(chainId, web3Client, factory, initCodeHash, tickLens, poolDeployer)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.Scribe
  }
  getPoolProviderName(): string {
    return 'Scribe'
  }
}
