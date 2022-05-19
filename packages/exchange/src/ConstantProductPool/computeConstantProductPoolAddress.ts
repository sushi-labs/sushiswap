import { defaultAbiCoder } from '@ethersproject/abi'
import { getCreate2Address } from '@ethersproject/address'
import { keccak256 } from '@ethersproject/solidity'
import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import constantProductPoolArtifact from '@sushiswap/trident/artifacts/contracts/pool/constant-product/ConstantProductPool.sol/ConstantProductPool.json'
import EXPORTS from '@sushiswap/trident/exports/all.json'
import constantProductPoolArtifactPreview from '@sushiswap/trident-preview/artifacts/contracts/pool/constant-product/ConstantProductPool.sol/ConstantProductPool.json'

import { Fee } from '../Fee'
import { computeInitCodeHash } from './computeInitCodeHash'

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
    [...[token0.address, token1.address].sort(), fee, twap],
  )

  const CONSTANT_PRODUCT_POOL_INIT_CODE_HASH =
    token0.chainId === ChainId.POLYGON
      ? // Compute init code hash based off the bytecode, deployData & masterDeployerAddress
        computeInitCodeHash({
          creationCode: constantProductPoolArtifactPreview.bytecode,
          deployData,
          masterDeployerAddress: (EXPORTS as any)[token0.chainId][0].contracts.MasterDeployer.address,
        })
      : keccak256(['bytes'], [constantProductPoolArtifact.bytecode])

  // Compute pool address
  return getCreate2Address(factoryAddress, keccak256(['bytes'], [deployData]), CONSTANT_PRODUCT_POOL_INIT_CODE_HASH)
}
