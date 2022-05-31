import { ChainId } from '@sushiswap/core-sdk'
import { getExplorerLink } from 'app/functions/explorer'

describe('utils', () => {
  describe('#getExplorerLink', () => {
    it('correct for tx', () => {
      expect(getExplorerLink(1, 'abc', 'transaction')).toEqual('https://etherscan.io/tx/abc')
    })
    it('correct for token', () => {
      expect(getExplorerLink(1, 'abc', 'token')).toEqual('https://etherscan.io/token/abc')
    })
    it('correct for address', () => {
      expect(getExplorerLink(1, 'abc', 'address')).toEqual('https://etherscan.io/address/abc')
    })
    /*it('unrecognized chain id defaults to mainnet', () => {
      expect(getExplorerLink(2, 'abc', 'address')).toEqual('https://etherscan.io/address/abc')
    })*/
    it('ropsten', () => {
      expect(getExplorerLink(3, 'abc', 'address')).toEqual('https://ropsten.etherscan.io/address/abc')
    })
    it('enum', () => {
      expect(getExplorerLink(ChainId.RINKEBY, 'abc', 'address')).toEqual('https://rinkeby.etherscan.io/address/abc')
    })
  })
})
