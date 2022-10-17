import { defaultAbiCoder } from '@ethersproject/abi'
import { getCreate2Address } from '@ethersproject/address'
import { keccak256 } from '@ethersproject/solidity'
import { Token } from '@sushiswap/currency'
import constantProductPoolArtifact from '@sushiswap/trident/artifacts/contracts/pool/constant-product/ConstantProductPool.sol/ConstantProductPool.json'

import { Fee } from '../Fee'

export const computeConstantProductPoolAddress = ({
  factoryAddress,
  tokenA,
  tokenB,
  fee,
  twap,
}: {
  factoryAddress: string
  tokenA: Token
  tokenB: Token
  fee: Fee
  twap: boolean
}): string => {
  // does safety checks
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]

  const deployData = defaultAbiCoder.encode(
    ['address', 'address', 'uint256', 'bool'],
    [token0.address, token1.address, fee, twap]
  )

  const CONSTANT_PRODUCT_POOL_INIT_CODE_HASH = keccak256(['bytes'], [constantProductPoolArtifact.bytecode])

  // Compute pool address
  return getCreate2Address(factoryAddress, keccak256(['bytes'], [deployData]), CONSTANT_PRODUCT_POOL_INIT_CODE_HASH)
}
