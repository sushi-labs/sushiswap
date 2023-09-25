import AlgebraFactory from '@cryptoalgebra/integral-core/artifacts/contracts/AlgebraFactory.sol/AlgebraFactory.json'
import AlgebraPool from '@cryptoalgebra/integral-core/artifacts/contracts/AlgebraPool.sol/AlgebraPool.json'
import AlgebraPoolDeployer from '@cryptoalgebra/integral-core/artifacts/contracts/AlgebraPoolDeployer.sol/AlgebraPoolDeployer.json'
import NFTDescriptor from '@cryptoalgebra/integral-periphery/artifacts/contracts/libraries/NFTDescriptor.sol/NFTDescriptor.json'
import NonfungiblePositionManager from '@cryptoalgebra/integral-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'
import NonfungibleTokenPositionDescriptor from '@cryptoalgebra/integral-periphery/artifacts/contracts/NonfungibleTokenPositionDescriptor.sol/NonfungibleTokenPositionDescriptor.json'
import SwapRouter from '@cryptoalgebra/integral-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json'
import { ChainId } from '@sushiswap/chain'
import { Token, WNATIVE_ADDRESS } from '@sushiswap/currency'
import { Abi, Address, getContractAddress, Hex, PublicClient, WalletClient } from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'

import { approve, TestTokens } from './TestTokens'

const getDeploymentAddress = async (client: WalletClient, promise: Promise<Hex>) =>
  waitForTransactionReceipt(client, { hash: await promise }).then((receipt) => receipt.contractAddress as Address)

function linkContractLibraries(
  contract: {
    bytecode: string
    linkReferences: Record<string, Record<string, { length: number; start: number }[]>>
  },
  libs: Record<string, Address>
): Hex {
  let bytecode = contract.bytecode
  const pimaryLength = bytecode.length
  Object.values(contract.linkReferences).forEach((links) => {
    Object.entries(links).forEach(([link, places]) => {
      const addr = libs[link]
      if (addr) {
        const address = addr.substring(2).padStart(40, '0')
        console.assert(address.length === 40, 'Unexpected address length')
        places.forEach(({ start }) => {
          bytecode = bytecode.substring(0, start * 2 + 2) + address + bytecode.substring((start + 20) * 2 + 2)
        })
      }
    })
  })
  console.assert(bytecode.search(/[_$]/) === -1, `Unexpected bytecode linking`)
  console.assert(bytecode.length === pimaryLength, 'Unexpected bytecode length')

  return bytecode as Hex
}

export interface AlgebraIntegralPeriphery {
  deployer: Address
  factoryAddress: Address
  poolDeployerAddress: Address
  NonfungibleTokenPositionDescriptorAddress: Address
  NonfungiblePositionManagerAddress: Address
  SwapRouterAddress: Address
}

export async function createAlgebraIntegralPeriphery(
  client: PublicClient & WalletClient,
  deployer?: Address
): Promise<AlgebraIntegralPeriphery> {
  const [addr] = await client.getAddresses()
  deployer = deployer ?? addr

  const nextTransactionNonce = await client.getTransactionCount({ address: deployer })
  const poolDeployerAddress = getContractAddress({ from: deployer, nonce: BigInt(nextTransactionNonce) + 1n })

  async function deploy(
    contract: { abi: unknown; bytecode: string },
    args?: unknown[],
    bytecode?: Hex
  ): Promise<Address> {
    return getDeploymentAddress(
      client,
      client.deployContract({
        chain: null,
        abi: contract.abi as Abi,
        bytecode: bytecode ?? (contract.bytecode as Hex),
        account: deployer as Address,
        args,
      })
    )
  }

  // Algebra Factory
  const factoryAddress = await deploy(AlgebraFactory, [poolDeployerAddress])

  // Algebra Vault
  const vaultAddress = (await client.readContract({
    address: factoryAddress,
    abi: AlgebraFactory.abi,
    functionName: 'communityVault',
  })) as Address

  // Algebra PoolDeployer
  const poolDeployerAddressReal = await deploy(AlgebraPoolDeployer, [factoryAddress, vaultAddress])
  console.assert(
    poolDeployerAddress.toLowerCase() == poolDeployerAddressReal.toLowerCase(),
    `Unexpected deploy behaviour! ${poolDeployerAddress} ${poolDeployerAddressReal}`
  )

  // Algebra NFTDescriptor
  const NFTDescriptorAddress = await deploy(NFTDescriptor)

  // Algebra NonfungibleTokenPositionDescriptor
  const WNativeAddress = WNATIVE_ADDRESS[client.chain?.id as ChainId] ?? '0x0000000000000000000000000000000000000000'
  const NonfungibleTokenPositionDescriptorAddress = await deploy(
    NonfungibleTokenPositionDescriptor,
    [WNativeAddress, 'AA', []],
    linkContractLibraries(NonfungibleTokenPositionDescriptor, { NFTDescriptor: NFTDescriptorAddress })
  )

  // Algebra NonfungiblePositionManager
  const NonfungiblePositionManagerAddress = await deploy(NonfungiblePositionManager, [
    factoryAddress,
    WNativeAddress,
    NonfungibleTokenPositionDescriptorAddress,
    poolDeployerAddress,
  ])

  // Algebra SwapRouter
  const SwapRouterAddress = await deploy(SwapRouter, [factoryAddress, WNativeAddress, poolDeployerAddress])

  return {
    deployer,
    factoryAddress,
    poolDeployerAddress,
    NonfungibleTokenPositionDescriptorAddress,
    NonfungiblePositionManagerAddress,
    SwapRouterAddress,
  }
}

export async function approveTestTokensToPerifery(
  client: WalletClient,
  env: AlgebraIntegralPeriphery,
  tokens: TestTokens
) {
  await Promise.all(
    tokens.tokens.map((t) => approve(client, t, tokens.owner, env.NonfungiblePositionManagerAddress, tokens.supply))
  )
  await Promise.all(tokens.tokens.map((t) => approve(client, t, tokens.owner, env.SwapRouterAddress, tokens.supply)))
}

const Two96 = Math.pow(2, 96)
export function encodePriceSqrt(reserve1: number, reserve0: number) {
  return BigInt(Math.round(Math.sqrt(reserve1 / reserve0) * Two96))
}

export interface Range {
  from: number
  to: number
  val: bigint
}

export async function deployPoolAndMint(
  client: PublicClient & WalletClient,
  env: AlgebraIntegralPeriphery,
  token0: Token,
  token1: Token,
  fee: number, // 1e-6
  price: number,
  mintRanges?: Range[],
  user?: Address
): Promise<Address> {
  await client.writeContract({
    chain: null,
    abi: NonfungiblePositionManager.abi,
    address: env.NonfungiblePositionManagerAddress,
    account: env.deployer,
    functionName: 'createAndInitializePoolIfNecessary',
    args: [token0.address, token1.address, BigInt(Math.sqrt(price) * 2 ** 96)],
  })

  const poolAddress = (await client.readContract({
    abi: AlgebraFactory.abi,
    address: env.factoryAddress,
    functionName: 'poolByPair',
    args: [token0.address, token1.address],
  })) as Address

  await client.writeContract({
    chain: null,
    abi: AlgebraPool.abi,
    address: poolAddress,
    account: env.deployer,
    functionName: 'setFee',
    args: [fee],
  })

  if (mintRanges) {
    user = user ?? env.deployer
    await Promise.all(mintRanges.map((range) => mint(client, env, token0, token1, user as Address, range)))
  }

  return poolAddress
}

export async function mint(
  client: PublicClient & WalletClient,
  env: AlgebraIntegralPeriphery,
  token0: Token,
  token1: Token,
  recipient: Address,
  range: Range
) {
  const mintParams = {
    chain: null,
    abi: NonfungiblePositionManager.abi,
    address: env.NonfungiblePositionManagerAddress,
    account: env.deployer,
    functionName: 'mint',
    args: [
      {
        token0: token0.address,
        token1: token1.address,
        tickLower: range.from,
        tickUpper: range.to,
        amount0Desired: range.val,
        amount1Desired: range.val,
        amount0Min: 0,
        amount1Min: 0,
        recipient,
        deadline: 2n ** 32n - 1n,
      },
    ],
  }

  const [, , liquidityActual] = (await client.readContract(mintParams)) as bigint[]
  await client.writeContract(mintParams)
  return liquidityActual
}

export async function swap(
  client: PublicClient & WalletClient,
  env: AlgebraIntegralPeriphery,
  token0: Token,
  token1: Token,
  user: Address,
  amountIn: bigint
): Promise<bigint> {
  const swapParams = {
    chain: null,
    abi: SwapRouter.abi,
    address: env.SwapRouterAddress,
    account: user,
    functionName: 'exactInputSingle',
    args: [
      {
        tokenIn: token0.address,
        tokenOut: token1.address,
        recipient: user,
        deadline: 2n ** 32n - 1n,
        amountIn,
        amountOutMinimum: 0,
        limitSqrtPrice: 0n,
      },
    ],
  }
  const amountOut = (await client.readContract(swapParams)) as bigint
  await client.writeContract(swapParams)
  return amountOut
}

export async function tickLiquidityPrice(client: PublicClient, poolAddress: Address) {
  const [price, tick] = (await client.readContract({
    abi: AlgebraPool.abi,
    address: poolAddress,
    functionName: 'globalState',
  })) as bigint[]
  const liquidity = (await client.readContract({
    abi: AlgebraPool.abi,
    address: poolAddress,
    functionName: 'liquidity',
  })) as bigint
  return { tick, liquidity, price }
}
