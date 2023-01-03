import { ChainId } from '@sushiswap/chain'
import { Native, USDC } from '@sushiswap/currency'
import { RouteStatus } from '@sushiswap/tines'
import { BigNumber, providers } from 'ethers'

import { DataFetcher } from './DataFetcher'
import { Router } from './Router'

describe('Router', () => {
  let dataFetcher: DataFetcher

  describe('constructor', () => {
    it('instanciates', () => {
      dataFetcher = new DataFetcher(new providers.JsonRpcProvider('https://api.securerpc.com/v1', 'homestead'), 1)
      dataFetcher.startDataFetching()
      expect(dataFetcher).toBeInstanceOf(DataFetcher)
    })
  })
  describe('#startRouting', () => {
    it('returns a successful route', () => {
      const fromToken = Native.onChain(ChainId.ETHEREUM)
      const toToken = USDC[ChainId.ETHEREUM]
      dataFetcher.fetchPoolsForToken(fromToken, toToken)
      const router = new Router(dataFetcher, fromToken, BigNumber.from(1_000_000), toToken, 50e9)
      router.startRouting((p) => {
        expect(p.status).toEqual(RouteStatus.Success)
      })
    })
  })
})
