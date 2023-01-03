import { providers } from 'ethers'

import { DataFetcher } from './DataFetcher'

describe('DataFetcher', () => {
  describe('constructor', () => {
    let dataFetcher: DataFetcher
    it('instanciates', () => {
      dataFetcher = new DataFetcher(new providers.JsonRpcProvider('https://api.securerpc.com/v1', 'homestead'), 1)
      dataFetcher.startDataFetching()
      expect(dataFetcher).toBeInstanceOf(DataFetcher)
    })
  })
  describe('#startDataFetching', () => {
    //
  })
  describe('#stopDataFetching', () => {
    //
  })
})
