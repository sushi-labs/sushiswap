import type { Address, Hex } from 'viem'
import {
  concat,
  getAddress,
  getCreate2Address as _getCreate2Address,
  keccak256,
  pad,
} from 'viem/utils'
import { ChainId } from '../chain/constants.js'

const EMPTY_INPU_HASH =
  '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
const ZKSYNC_PREFIX =
  '0x2020dba91b30cc0006188af794c2fb30dd8520db7e2c088b7fc7c103c00ca494' // keccak256('zksyncCreate2')

type GetCreate2AddressOptions = {
  bytecodeHash: Hex
  from: Address
  salt: Hex
  chainId?: ChainId
}

export function getCreate2Address({
  chainId,
  ...params
}: GetCreate2AddressOptions) {
  if (chainId === ChainId.ZKSYNC_ERA) {
    const { from, salt, bytecodeHash } = params

    return getAddress(
      `0x${keccak256(
        concat([
          ZKSYNC_PREFIX,
          pad(from, { size: 32 }),
          salt,
          bytecodeHash,
          EMPTY_INPU_HASH,
        ]),
      ).slice(26)}`,
    )
  } else {
    return _getCreate2Address(params)
  }
}
