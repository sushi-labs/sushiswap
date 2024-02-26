import { keccak256 } from '@ethersproject/solidity'
import { describe, expect, it } from 'vitest'

import IUniswapV3Pool from '@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json' assert {
  type: 'json',
}
import { ChainId } from '../chain/index.js'
import { UNISWAP_V3_INIT_CODE_HASH } from './uniswap-v3.js'

// this _could_ go in constants, except that it would cost every consumer of the sdk the CPU to compute the hash
// and load the JSON.
const COMPUTED_INIT_CODE_HASH = keccak256(['bytes'], [IUniswapV3Pool.bytecode])

describe('constants', () => {
  describe('INIT_CODE_HASH', () => {
    it('matches computed bytecode hash', () => {
      expect(COMPUTED_INIT_CODE_HASH).toEqual(
        UNISWAP_V3_INIT_CODE_HASH[ChainId.ETHEREUM],
      )
    })
  })
})
