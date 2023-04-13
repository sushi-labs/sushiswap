import { ChainId } from '@sushiswap/chain'
import { getBigNumber } from '@sushiswap/tines'
import { Contract, Signer } from 'ethers'
import { ethers } from 'hardhat'

import ERC20Mock from '../artifacts/contracts/ERC20Mock.sol/ERC20Mock.json'

const UniswapV3Factory: Record<number, string> = {
  [ChainId.POLYGON]: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
}

const PositionManager: Record<number, string> = {
  [ChainId.POLYGON]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
}

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
  token0Contract: Contract
  token1Contract: Contract
  positionManager: Contract
}

async function createUniV3Pool(user: Signer, fee: number): Promise<UniV3Environment | undefined> {
  const provider = user.provider
  if (provider === undefined) return
  const chainId = (await provider.getNetwork()).chainId
  if (UniswapV3Factory[chainId] === undefined || PositionManager[chainId]) return
  const tokenFactory = await ethers.getContractFactory(ERC20Mock.abi, ERC20Mock.bytecode, user)
  const token0Contract = await tokenFactory.deploy('Token0', 'Token0', getBigNumber(1e50))
  const token1Contract = await tokenFactory.deploy('Token1', 'Token1', getBigNumber(1e50))
  const factory = new Contract(
    UniswapV3Factory[chainId],
    ['function createPool(address, address, uint24) external returns (address)'],
    user
  )
  await factory.createPool(token0Contract.address, token1Contract.address, fee)
  const positionManager = new Contract(PositionManager[chainId], PositionManagerABI, user)

  return {
    user,
    token0Contract,
    token1Contract,
    positionManager,
  }
}

// async function uniV3PoolMint(env: UniV3Environment, ) {
//   struct MintParams {
//     address token0;
//     address token1;
//     uint24 fee;
//     int24 tickLower;
//     int24 tickUpper;
//     uint256 amount0Desired;
//     uint256 amount1Desired;
//     uint256 amount0Min;
//     uint256 amount1Min;
//     address recipient;
//     uint256 deadline;
// }
// }

it('DataFetcher test', async () => {
  const [user] = await ethers.getSigners()
  const poolEnv = await createUniV3Pool(user, 500)
  //console.log(poolEnv)
})
