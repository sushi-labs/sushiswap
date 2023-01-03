import { providers } from 'ethers'

import { DataFetcher } from './DataFetcher'

describe('DataFetcher', () => {
  describe('constructor', () => {
    let dataFetcher: DataFetcher
    it('instanciates', () => {
      dataFetcher = new DataFetcher(new providers.AlchemyProvider('homestead', process.env['ALCHEMY_API_KEY']), 1)
      dataFetcher.startDataFetching()
      expect(dataFetcher).toBeInstanceOf(DataFetcher)
    })
  })
  describe('#startDataFetching', () => {
    //
  })
  describe('#startDataFetching', () => {
    //
  })
})
