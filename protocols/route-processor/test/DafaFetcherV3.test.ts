import { ChainId } from '@sushiswap/chain'
import { getBigNumber } from '@sushiswap/tines'
import { expect } from 'chai'
import { Contract, Signer } from 'ethers'
import { ethers } from 'hardhat'

import ERC20Mock from '../artifacts/contracts/ERC20Mock.sol/ERC20Mock.json'

const UniswapV3Factory: Record<number, string> = {
  [ChainId.POLYGON]: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
}

const PositionManager: Record<number, string> = {
  [ChainId.POLYGON]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
}

// Map of fee to tickSpacing
const feeAmountTickSpacing: number[] = []
feeAmountTickSpacing[500] = 10 // 0.05%
feeAmountTickSpacing[3000] = 60 // 0.3%
feeAmountTickSpacing[10000] = 200 // 1%

const PositionManagerABI = [
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'token0',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'token1',
            type: 'address',
          },
          {
            internalType: 'uint24',
            name: 'fee',
            type: 'uint24',
          },
          {
            internalType: 'int24',
            name: 'tickLower',
            type: 'int24',
          },
          {
            internalType: 'int24',
            name: 'tickUpper',
            type: 'int24',
          },
          {
            internalType: 'uint256',
            name: 'amount0Desired',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'amount1Desired',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'amount0Min',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'amount1Min',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'deadline',
            type: 'uint256',
          },
        ],
        internalType: 'struct INonfungiblePositionManager.MintParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'mint',
    outputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint128',
        name: 'liquidity',
        type: 'uint128',
      },
      {
        internalType: 'uint256',
        name: 'amount0',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount1',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token0',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token1',
        type: 'address',
      },
      {
        internalType: 'uint24',
        name: 'fee',
        type: 'uint24',
      },
      {
        internalType: 'uint160',
        name: 'sqrtPriceX96',
        type: 'uint160',
      },
    ],
    name: 'createAndInitializePoolIfNecessary',
    outputs: [
      {
        internalType: 'address',
        name: 'pool',
        type: 'address',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
]

interface UniV3Environment {
  user: Signer
  fee: number
  token0Contract: Contract
  token1Contract: Contract
  positionManager: Contract
}

interface UniV3Position {
  from: number
  to: number
  val: number
}

const tokenLiquidity = getBigNumber(1e50)
async function createUniV3Pool(
  user: Signer,
  fee: number,
  price: number,
  positions: UniV3Position[]
): Promise<UniV3Environment | undefined> {
  const provider = user.provider
  if (provider === undefined) return
  const chainId = (await provider.getNetwork()).chainId
  if (UniswapV3Factory[chainId] === undefined || PositionManager[chainId] === undefined) return
  const tokenFactory = await ethers.getContractFactory(ERC20Mock.abi, ERC20Mock.bytecode, user)
  const token0Contract = await tokenFactory.deploy('Token0', 'Token0', tokenLiquidity)
  const token1Contract = await tokenFactory.deploy('Token1', 'Token1', tokenLiquidity)
  await token0Contract.approve(PositionManager[chainId], tokenLiquidity)
  await token1Contract.approve(PositionManager[chainId], tokenLiquidity)
  // const factory = new Contract(
  //   UniswapV3Factory[chainId],
  //   ['function createPool(address, address, uint24) external returns (address)'],
  //   user
  // )
  // await factory.createPool(token0Contract.address, token1Contract.address, fee)
  const positionManager = new Contract(PositionManager[chainId], PositionManagerABI, user)
  const sqrtPriceX96 = getBigNumber(Math.sqrt(price) * Math.pow(2, 96))
  await positionManager.createAndInitializePoolIfNecessary(
    token0Contract.address,
    token1Contract.address,
    fee,
    sqrtPriceX96
  )

  const env = {
    user,
    fee,
    token0Contract,
    token1Contract,
    positionManager,
  }

  const tickSpacing = feeAmountTickSpacing[fee]
  expect(tickSpacing).not.undefined
  for (let i = 0; i < positions.length; ++i) {
    const position = positions[i]
    expect(position.from % tickSpacing).to.equal(0)
    expect(position.to % tickSpacing).to.equal(0)

    await uniV3PoolMint(env, position)

    // let tickLiquidity = tickMap.get(position.from)
    // tickLiquidity = tickLiquidity === undefined ? liquidity : tickLiquidity.add(liquidity)
    // tickMap.set(position.from, tickLiquidity)

    // tickLiquidity = tickMap.get(position.to) || ZERO
    // tickLiquidity = tickLiquidity.sub(liquidity)
    // tickMap.set(position.to, tickLiquidity)
  }

  return env
}

async function uniV3PoolMint(env: UniV3Environment, position: UniV3Position) {
  const inpLiquidity = getBigNumber(position.val)
  const MintParams = {
    token0: env.token0Contract.address,
    token1: env.token1Contract.address,
    fee: env.fee,
    tickLower: position.from,
    tickUpper: position.to,
    amount0Desired: inpLiquidity,
    amount1Desired: inpLiquidity,
    amount0Min: 0,
    amount1Min: 0,
    recipient: env.user.getAddress(),
    deadline: 1e12,
  }
  const res = await env.positionManager.mint(MintParams)
  const receipt = await res.wait()

  // event IncreaseLiquidity(uint256 indexed tokenId, uint128 liquidity, uint256 amount0, uint256 amount1);
  const increaseLiquidityEvent = receipt.events.find(
    (ev: { topics: string[] }) => ev.topics[0] == '0x3067048beee31b25b2f1681f88dac838c8bba36af25bfb2b7cf7473a5847e35f'
  )
  const liquidity = parseInt(increaseLiquidityEvent.data.substring(0, 66), 16)
  console.log(liquidity)
}

it('DataFetcher test', async () => {
  const [user] = await ethers.getSigners()
  const poolEnv = await createUniV3Pool(user, 500, 5, [{ from: -120000, to: -10000, val: 1e18 }])
})
