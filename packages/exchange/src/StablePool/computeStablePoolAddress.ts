import { defaultAbiCoder } from '@ethersproject/abi'
import { getCreate2Address } from '@ethersproject/address'
import { keccak256 } from '@ethersproject/solidity'
import { Token } from '@sushiswap/currency'
import stablePoolArtifact from '@sushiswap/trident/artifacts/contracts/pool/stable/StablePool.sol/StablePool.json'

import { Fee } from '../Fee'

export const computeStablePoolAddress = ({
  factoryAddress,
  tokenA,
  tokenB,
  fee,
}: {
  factoryAddress: string
  tokenA: Token
  tokenB: Token
  fee: Fee
}): string => {
  // does safety checks
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]

  const deployData = defaultAbiCoder.encode(['address', 'address', 'uint256'], [token0.address, token1.address, fee])

  const STABLE_POOL_INIT_CODE_HASH = keccak256(['bytes'], [stablePoolArtifact.bytecode])

  // Compute pool address
  return getCreate2Address(factoryAddress, keccak256(['bytes'], [deployData]), STABLE_POOL_INIT_CODE_HASH)
}
