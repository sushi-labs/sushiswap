import { erc20Abi, nonfungiblePositionManagerAbi, sushiV3FactoryAbi, sushiV3PoolAbi } from '@sushiswap/abi'
import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { CL_MAX_TICK, CL_MIN_TICK, CLTick, RToken, UniV3Pool } from '@sushiswap/tines'
import { Contract } from '@sushiswap/types'
import NonfungiblePositionManager from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'
import WETH9 from 'canonical-weth/build/contracts/WETH9.json'
import { expect } from 'chai'
import seedrandom from 'seedrandom'
import { Address, DeployContractParameters, Hex, WalletClient } from 'viem'
import { readContract, waitForTransactionReceipt } from 'viem/actions'

import ERC20Mock from '../artifacts/contracts/ERC20Mock.sol/ERC20Mock.json'
import TestRouter from '../artifacts/contracts/TestRouter.sol/TestRouter.json'
import UniswapV3Factory from '../artifacts/contracts/UniswapV3FactoryFlat.sol/UniswapV3Factory.json'
import { testRouterAbi } from './abis'
import { getRndLin, getRndLinInt } from './utils'

const ZERO = 0n

const UniswapV3FactoryAddress: Record<number, string> = {
  [ChainId.ETHEREUM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.POLYGON]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.ARBITRUM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.OPTIMISM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.BSC]: '0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7',
  [ChainId.CELO]: '0xAfE208a311B21f13EF87E33A90049fC17A7acDEc',
}

const PositionManagerAddress: Record<number, string> = {
  [ChainId.ETHEREUM]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
  [ChainId.POLYGON]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
}

export const possibleFee: number[] = [100, 500, 3000, 10000]

// Map of fee to tickSpacing
export const feeAmountTickSpacing: number[] = []
feeAmountTickSpacing[100] = 1 // 0.01%
feeAmountTickSpacing[500] = 10 // 0.05%
feeAmountTickSpacing[3000] = 60 // 0.3%
feeAmountTickSpacing[10000] = 200 // 1%

export const getDeploymentAddress = async (client: WalletClient, promise: Promise<Hex>) =>
  waitForTransactionReceipt(client, { hash: await promise }).then((receipt) => receipt.contractAddress as Address)

// Makes artificial environment, deploys factory, smallpositionmanager for mint and swap
export async function createUniV3EnvZero(walletClient: WalletClient, userDeployContracts?: Address) {
  const user = userDeployContracts || (await walletClient.getAddresses())[0]

  const tokenFactory = {
    chain: null,
    abi: erc20Abi,
    bytecode: ERC20Mock.bytecode as Hex,
    account: user,
  } satisfies DeployContractParameters

  const SushiV3FactoryAddress = await getDeploymentAddress(
    walletClient,
    walletClient.deployContract({
      chain: null,
      abi: sushiV3FactoryAbi,
      bytecode: UniswapV3Factory.bytecode as Hex,
      account: user,
    })
  )
  const SushiV3Factory = {
    abi: sushiV3FactoryAbi,
    address: SushiV3FactoryAddress,
  }

  const WETH9Address = await getDeploymentAddress(
    walletClient,
    walletClient.deployContract({
      chain: null,
      abi: WETH9.abi,
      bytecode: WETH9.bytecode as Hex,
      account: user,
    })
  )

  const NonfungiblePositionManagerAddress = await getDeploymentAddress(
    walletClient,
    walletClient.deployContract({
      chain: null,
      abi: nonfungiblePositionManagerAbi,
      bytecode: NonfungiblePositionManager.bytecode as Hex,
      account: user,
      args: [SushiV3Factory.address, WETH9Address, '0x0000000000000000000000000000000000000000'],
    })
  )
  const PositionManager = {
    abi: nonfungiblePositionManagerAbi,
    address: NonfungiblePositionManagerAddress,
  }

  const TestRouterAddress = await getDeploymentAddress(
    walletClient,
    walletClient.deployContract({
      chain: null,
      abi: testRouterAbi,
      bytecode: TestRouter.bytecode as Hex,
      account: user,
      args: [],
    })
  )
  const TestRouterContract = {
    abi: testRouterAbi,
    address: TestRouterAddress,
  }

  const ret = {
    user,
    tokenFactory,
    SushiV3Factory,
    PositionManager,
    swapper: TestRouterContract,
    minter: TestRouterContract,
    mint: async (pool: UniV3PoolInfo, from: number, to: number, liquidity: bigint) => {
      await pool.env.walletClient.writeContract({
        ...pool.env.minter,
        functionName: 'mint',
        args: [pool.contract.address, from, to, liquidity],
        account: pool.env.user,
        chain: null,
      })

      return liquidity
    },
  } satisfies {
    user: Address
    tokenFactory: Omit<DeployContractParameters<typeof erc20Abi>, 'args' | 'type'>
    SushiV3Factory: Contract<typeof sushiV3FactoryAbi>
    PositionManager: Contract<typeof nonfungiblePositionManagerAbi>
    swapper: Contract<typeof testRouterAbi>
    minter: Contract<typeof testRouterAbi>
    mint: (pool: UniV3PoolInfo, from: number, to: number, liquidity: bigint) => Promise<bigint>
  }

  // Weird hack to make typescript happy
  return {
    ...ret,
    walletClient: walletClient,
  } as typeof ret & { walletClient: WalletClient }
}

export type UniV3Environment = Awaited<ReturnType<typeof createUniV3EnvZero>>

// Uses real environment
export async function createUniV3EnvReal(
  walletClient: WalletClient,
  userDeployContracts?: Address
): Promise<UniV3Environment | undefined> {
  const user = userDeployContracts || (await walletClient.getAddresses())[0]
  const chainId = await walletClient.getChainId()

  if (UniswapV3FactoryAddress[chainId] === undefined || PositionManagerAddress[chainId] === undefined) return

  const tokenFactory = {
    chain: null,
    abi: erc20Abi,
    bytecode: ERC20Mock.bytecode as Hex,
    account: user,
  } satisfies DeployContractParameters

  const SushiV3Factory = {
    abi: sushiV3FactoryAbi,
    address: UniswapV3FactoryAddress[chainId] as Address,
  }

  const PositionManager = {
    abi: nonfungiblePositionManagerAbi,
    address: PositionManagerAddress[chainId] as Address,
  }

  const TestRouterAddress = await getDeploymentAddress(
    walletClient,
    walletClient.deployContract({
      chain: null,
      abi: testRouterAbi,
      bytecode: TestRouter.bytecode as Hex,
      account: user,
      args: [],
    })
  )
  const TestRouterContract = {
    abi: testRouterAbi,
    address: TestRouterAddress,
  }

  return {
    walletClient,
    user,
    tokenFactory,
    SushiV3Factory,
    PositionManager,
    swapper: TestRouterContract,
    minter: TestRouterContract,
    mint: async (pool: UniV3PoolInfo, from: number, to: number, liquidity: bigint) => {
      let res
      try {
        res = await pool.env.walletClient.writeContract({
          ...pool.env.PositionManager,
          functionName: 'mint',
          args: [
            {
              token0: pool.token0Contract.address as Address,
              token1: pool.token1Contract.address as Address,
              fee: pool.fee,
              tickLower: from,
              tickUpper: to,
              amount0Desired: liquidity,
              amount1Desired: liquidity,
              amount0Min: 0n,
              amount1Min: 0n,
              recipient: pool.env.user,
              deadline: BigInt(1e12),
            },
          ],
          account: pool.env.user,
          chain: null,
          value: 0n,
        })
      } catch (e) {
        return ZERO
      }
      const receipt = await waitForTransactionReceipt(walletClient, { hash: res })

      // event IncreaseLiquidity(uint256 indexed tokenId, uint128 liquidity, uint256 amount0, uint256 amount1);
      const increaseLiquidityEvent = receipt.logs.find(
        (ev: { topics: string[] }) =>
          ev.topics[0] === '0x3067048beee31b25b2f1681f88dac838c8bba36af25bfb2b7cf7473a5847e35f'
      )
      if (increaseLiquidityEvent === undefined) throw new Error("Logs doesn't contain IncreaseLiquidity event")
      const liquidityReal = BigInt(increaseLiquidityEvent.data.substring(0, 66))
      return liquidityReal
    },
  }
}

export interface UniV3Position {
  from: number
  to: number
  val: number
}

export interface UniV3PoolInfo {
  env: UniV3Environment
  contract: Contract<typeof sushiV3PoolAbi>
  fee: number
  tinesPool: UniV3Pool
  token0Contract: Contract<typeof erc20Abi>
  token1Contract: Contract<typeof erc20Abi>
  token0: Token
  token1: Token
}

function isLess(a: Address, b: Address): boolean {
  const addrA = a.toLowerCase().substring(2).padStart(40, '0')
  const addrB = b.toLowerCase().substring(2).padStart(40, '0')
  return addrA < addrB
}

const tokenSupply = 2n ** 255n
export async function createUniV3Pool(
  env: UniV3Environment,
  fee: number,
  price: number,
  positions: UniV3Position[]
): Promise<UniV3PoolInfo> {
  const sqrtPriceX96 = BigInt(Math.sqrt(price) * 2 ** 96)
  const tickSpacing = feeAmountTickSpacing[fee]
  expect(tickSpacing).not.undefined

  const _token0Address = await getDeploymentAddress(
    env.walletClient,
    env.walletClient.deployContract({
      ...env.tokenFactory,
      args: ['Token0', 'Token0', tokenSupply],
    })
  )
  const _token1Address = await getDeploymentAddress(
    env.walletClient,
    env.walletClient.deployContract({
      ...env.tokenFactory,
      args: ['Token1', 'Token1', tokenSupply],
    })
  )
  const [token0Address, token1Address] = isLess(_token0Address, _token1Address)
    ? [_token0Address, _token1Address]
    : [_token1Address, _token0Address]

  const chainId = await env.walletClient.getChainId()
  const token0 = new Token({
    chainId,
    address: token0Address,
    symbol: 'Token0',
    name: 'Token0',
    decimals: 18,
  })
  const token1 = new Token({
    chainId,
    address: token1Address,
    symbol: 'Token1',
    name: 'Token1',
    decimals: 18,
  })

  await env.walletClient.writeContract({
    abi: env.tokenFactory.abi,
    address: token0Address,
    functionName: 'approve',
    args: [env.minter.address, tokenSupply],
    account: env.user,
    chain: null,
  })
  await env.walletClient.writeContract({
    abi: env.tokenFactory.abi,
    address: token1Address,
    functionName: 'approve',
    args: [env.minter.address, tokenSupply],
    account: env.user,
    chain: null,
  })
  await env.walletClient.writeContract({
    abi: env.tokenFactory.abi,
    address: token0Address,
    functionName: 'approve',
    args: [env.PositionManager.address, tokenSupply],
    account: env.user,
    chain: null,
  })
  await env.walletClient.writeContract({
    abi: env.tokenFactory.abi,
    address: token0Address,
    functionName: 'approve',
    args: [env.PositionManager.address, tokenSupply],
    account: env.user,
    chain: null,
  })

  await env.walletClient.writeContract({
    ...env.PositionManager,
    functionName: 'createAndInitializePoolIfNecessary',
    args: [token0Address, token1Address, fee, sqrtPriceX96],
    account: env.user,
    chain: null,
    value: 0n,
  })

  const poolAddress = await readContract(env.walletClient, {
    ...env.SushiV3Factory,
    functionName: 'getPool',
    args: [token0Address, token1Address, fee],
    account: env.user,
  })

  const SushiV3Pool = {
    abi: sushiV3PoolAbi,
    address: poolAddress,
  }

  const token0Contract = {
    abi: erc20Abi,
    address: token0Address,
  }
  const token1Contract = {
    abi: erc20Abi,
    address: token1Address,
  }

  const poolInfo = {
    env,
    contract: SushiV3Pool,
    fee,
    tinesPool: undefined as unknown as UniV3Pool,
    token0Contract,
    token1Contract,
    token0,
    token1,
  }

  const tickMap = new Map<number, bigint>()
  for (let i = 0; i < positions.length; ++i) {
    const position = positions[i]
    expect(position.from % tickSpacing).to.equal(0)
    expect(position.to % tickSpacing).to.equal(0)

    const liquidityExpected = BigInt(position.val)
    const liquidity = await env.mint(poolInfo, position.from, position.to, liquidityExpected)

    let tickLiquidity = tickMap.get(position.from)
    tickLiquidity = tickLiquidity === undefined ? liquidity : tickLiquidity + liquidity
    tickMap.set(position.from, tickLiquidity)

    tickLiquidity = tickMap.get(position.to) || ZERO
    tickLiquidity = tickLiquidity - liquidity
    tickMap.set(position.to, tickLiquidity)
  }

  const slot = await readContract(env.walletClient, {
    ...SushiV3Pool,
    functionName: 'slot0',
  })
  const liquidity = await readContract(env.walletClient, {
    ...SushiV3Pool,
    functionName: 'liquidity',
  })
  const token0Balance = await readContract(env.walletClient, {
    ...token0Contract,
    functionName: 'balanceOf',
    args: [poolAddress],
  })
  const token1Balance = await readContract(env.walletClient, {
    ...token1Contract,
    functionName: 'balanceOf',
    args: [poolAddress],
  })
  const ticks: CLTick[] = Array.from(tickMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([index, DLiquidity]) => ({ index, DLiquidity }))

  poolInfo.tinesPool = new UniV3Pool(
    SushiV3Pool.address,
    token0 as RToken,
    token1 as RToken,
    fee / 1e6,
    token0Balance,
    token1Balance,
    slot[1],
    liquidity,
    sqrtPriceX96,
    ticks
  )

  return poolInfo
}

export async function createRandomUniV3Pool(
  env: UniV3Environment,
  seed: string,
  positionNumber: number,
  price?: number,
  _fee?: number,
  minTick = CL_MIN_TICK,
  maxTick = CL_MAX_TICK
): Promise<UniV3PoolInfo> {
  const rnd: () => number = seedrandom(seed) // random [0, 1)

  const fee = _fee || possibleFee[getRndLinInt(rnd, 0, possibleFee.length)]
  const tickSpacing = feeAmountTickSpacing[fee]
  const RANGE = Math.floor((maxTick - minTick) / tickSpacing)
  const SHIFT = -Math.floor(-minTick / tickSpacing) * tickSpacing

  const positions: UniV3Position[] = []
  for (let i = 0; i < positionNumber; ++i) {
    const pos1 = getRndLinInt(rnd, 0, RANGE)
    const pos2 = (pos1 + getRndLinInt(rnd, 1, RANGE - 1)) % RANGE
    const from = Math.min(pos1, pos2) * tickSpacing + SHIFT
    const to = Math.max(pos1, pos2) * tickSpacing + SHIFT
    console.assert(minTick <= from && from < to && to <= maxTick, `Wrong from-to range ${from} - ${to}`)
    positions.push({ from, to, val: getRndLin(rnd, 0.01, 30) * 1e18 })
  }
  price = price === undefined ? getRndLin(rnd, 0.01, 100) : price
  //console.log(positions, price, fee)
  return await createUniV3Pool(env, fee, price, positions)
}
