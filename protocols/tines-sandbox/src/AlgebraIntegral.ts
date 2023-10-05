import AlgebraFactory from '@cryptoalgebra/integral-core/artifacts/contracts/AlgebraFactory.sol/AlgebraFactory.json'
import AlgebraPool from '@cryptoalgebra/integral-core/artifacts/contracts/AlgebraPool.sol/AlgebraPool.json'
import AlgebraPoolDeployer from '@cryptoalgebra/integral-core/artifacts/contracts/AlgebraPoolDeployer.sol/AlgebraPoolDeployer.json'
import NFTDescriptor from '@cryptoalgebra/integral-periphery/artifacts/contracts/libraries/NFTDescriptor.sol/NFTDescriptor.json'
import NonfungiblePositionManager from '@cryptoalgebra/integral-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'
import NonfungibleTokenPositionDescriptor from '@cryptoalgebra/integral-periphery/artifacts/contracts/NonfungibleTokenPositionDescriptor.sol/NonfungibleTokenPositionDescriptor.json'
import SwapRouter from '@cryptoalgebra/integral-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json'
import { ChainId } from '@sushiswap/chain'
import { Token, WNATIVE_ADDRESS } from '@sushiswap/currency'
import { CL_MAX_TICK, CL_MIN_TICK, CLTick, RToken, UniV3Pool } from '@sushiswap/tines'
import seedrandom from 'seedrandom'
import { Abi, Address, getContractAddress, Hex, PublicClient, WalletClient } from 'viem'

import { approve, balanceOf, TestTokens } from './TestTokens'
import { getDeploymentAddress, getRndExp, getRndExpInt, getRndLinInt, getRndVariant } from './utils'

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
  console.assert(bytecode.search(/[_$]/) === -1, 'Unexpected bytecode linking')
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
    poolDeployerAddress.toLowerCase() === poolDeployerAddressReal.toLowerCase(),
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

export async function approveTestTokensToAlgebraPerifery(
  client: WalletClient,
  env: AlgebraIntegralPeriphery,
  tokens: TestTokens
) {
  await Promise.all(
    tokens.tokens.map((t) => approve(client, t, tokens.owner, env.NonfungiblePositionManagerAddress, tokens.supply))
  )
  await Promise.all(tokens.tokens.map((t) => approve(client, t, tokens.owner, env.SwapRouterAddress, tokens.supply)))
}

const Two96 = 2 ** 96
export function encodePriceSqrt(reserve1: number, reserve0: number) {
  return BigInt(Math.round(Math.sqrt(reserve1 / reserve0) * Two96))
}

export interface Range {
  from: number
  to: number
  val: bigint
}

export async function deployAlgebraPoolAndMint(
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
    await Promise.all(mintRanges.map((range) => algebraPoolMint(client, env, token0, token1, user as Address, range)))
  }

  return poolAddress
}

export async function algebraPoolMint(
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

  const [, liquidityActual] = (await client.readContract(mintParams)) as bigint[]
  await client.writeContract(mintParams)
  return liquidityActual
}

export async function algebraPoolSwap(
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

export async function algebraPoolTickLiquidityPrice(client: PublicClient, poolAddress: Address) {
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

export async function updateTinesAlgebraPool(client: PublicClient, pool: UniV3Pool) {
  const { tick, liquidity, price } = await algebraPoolTickLiquidityPrice(client, pool.address)
  pool.updateState(
    await balanceOf(client, pool.token0 as Token, pool.address),
    await balanceOf(client, pool.token1 as Token, pool.address),
    Number(tick),
    liquidity,
    price
  )
  return { tick, liquidity, price }
}

export interface AlgebraPoolInfo {
  poolAddress: Address
  pool: UniV3Pool
  token0: Token
  token1: Token
  res0Max: number
  res1Max: number
}

let token0Index = 0
let token1Index = 1 // each new pool needs a new pair of tokens
export async function createAlgebraPool(
  client: PublicClient & WalletClient,
  env: AlgebraIntegralPeriphery,
  testTokens: TestTokens,
  user: Address,
  fee: number,
  price: number,
  positions: Range[]
): Promise<AlgebraPoolInfo> {
  if (token1Index >= testTokens.tokens.length) throw new Error('Unsufficient tokens number')
  const t0 = testTokens.tokens[token0Index]
  const t1 = testTokens.tokens[token1Index]
  if (++token1Index >= testTokens.tokens.length) token1Index = ++token0Index + 1

  const [token0, token1] = t0.sortsBefore(t1) ? [t0, t1] : [t1, t0]
  const poolAddress = await deployAlgebraPoolAndMint(client, env, token0, token1, fee, price)

  const tickMap = new Map<number, bigint>()
  for (let i = 0; i < positions.length; ++i) {
    const position = positions[i]
    const liquidity = await algebraPoolMint(client, env, token0, token1, user, position)

    let tickLiquidity = tickMap.get(position.from) ?? 0n
    tickLiquidity = tickLiquidity === undefined ? liquidity : tickLiquidity + liquidity
    tickMap.set(position.from, tickLiquidity)

    tickLiquidity = tickMap.get(position.to) ?? 0n
    tickLiquidity = tickLiquidity - liquidity
    tickMap.set(position.to, tickLiquidity)
  }

  const ticks: CLTick[] = Array.from(tickMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([index, DLiquidity]) => ({ index, DLiquidity }))

  const pool = new UniV3Pool(poolAddress, token0 as RToken, token1 as RToken, fee / 1e6, 0n, 0n, 0, 0n, 1n, ticks)
  await updateTinesAlgebraPool(client, pool)

  const res0 = Number(pool.getReserve0())
  const res1 = Number(pool.getReserve1())
  return {
    poolAddress,
    pool,
    token0,
    token1,
    res0Max: pool.calcInByOut(res1, true).inp + res0,
    res1Max: pool.calcInByOut(res0, false).inp + res1,
  }
}

// Algebra pools, like uniV3, has max liquidity per mint.
// This function calculates it
const MAX_LIQUIDITY_PER_TICK = Number(191757638537527648490752896198553n)
function getMaxPositionLiquidity(from: number, to: number): number {
  const price1 = 1.0001 ** (from / 2)
  const price2 = 1.0001 ** (to / 2)
  const max1 = MAX_LIQUIDITY_PER_TICK * (1 / price1 - 1 / price2)
  const max2 = MAX_LIQUIDITY_PER_TICK * (price2 - price1)
  return Math.min(max1, max2)
}

export async function createRandomAlgebraPool(
  client: PublicClient & WalletClient,
  env: AlgebraIntegralPeriphery,
  testTokens: TestTokens,
  user: Address,
  seed: string,
  positionNumber: number,
  fee?: number,
  price?: number,
  minTick = CL_MIN_TICK,
  maxTick = CL_MAX_TICK
): Promise<AlgebraPoolInfo> {
  const rnd: () => number = seedrandom(seed) // random [0, 1)

  const tickSpacing = 120
  const RANGE = Math.floor((maxTick - minTick) / tickSpacing)
  const SHIFT = -Math.floor(-minTick / tickSpacing) * tickSpacing

  const positions: Range[] = []
  for (let i = 0; i < positionNumber; ++i) {
    const pos1 = getRndLinInt(rnd, 0, RANGE)
    const pos2 = (pos1 + getRndLinInt(rnd, 1, RANGE - 1)) % RANGE
    const from = Math.min(pos1, pos2) * tickSpacing + SHIFT
    const to = Math.max(pos1, pos2) * tickSpacing + SHIFT
    console.assert(minTick <= from && from < to && to <= maxTick, `Wrong from-to range ${from} - ${to}`)
    const maxLiquidity = Math.min(getMaxPositionLiquidity(from, to), 30e18)
    const minLiquidity = 1e9
    if (maxLiquidity > minLiquidity)
      positions.push({ from, to, val: BigInt(getRndExpInt(rnd, minLiquidity, maxLiquidity)) })
    else --i // try again
  }
  price = price ?? getRndExp(rnd, 0.01, 100)
  fee = fee ?? getRndVariant(rnd, [500, 1000, 3000, 10000])
  //console.log(positions, price, fee)
  return await createAlgebraPool(client, env, testTokens, user, fee, price, positions)
}
