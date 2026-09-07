import { expect } from '@playwright/test'
import {
  EvmNative,
  type EvmTxHash,
  SUSHISWAP_V2_FACTORY_ADDRESS,
  SUSHISWAP_V2_ROUTER_ADDRESS,
  SUSHISWAP_V3_POSITION_MANAGER,
  computeSushiSwapV2PoolAddress,
  nonfungiblePositionManagerAbi_createAndInitializePoolIfNecessary,
  nonfungiblePositionManagerAbi_mint,
  nonfungiblePositionManagerAbi_positions,
  sushiSwapV2RouterAbi_addLiquidityETH,
} from 'sushi/evm'
import {
  type TransactionReceipt,
  erc20Abi,
  parseAbi,
  parseEther,
  parseEventLogs,
  zeroAddress,
} from 'viem'
import { chainId, transactionTimeout } from '../constants'
import type { Fork } from '../fixtures'
import { account } from '../fork'

const manager = SUSHISWAP_V3_POSITION_MANAGER[chainId]
const transferAbi = parseAbi([
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
])

export function mintedPosition(receipt: TransactionReceipt): bigint {
  const minted = parseEventLogs({
    abi: transferAbi,
    logs: receipt.logs,
    eventName: 'Transfer',
  }).find(
    (log) =>
      log.address.toLowerCase() === manager.toLowerCase() &&
      log.args.from === zeroAddress &&
      log.args.to.toLowerCase() === account.address.toLowerCase(),
  )
  if (!minted) throw new Error('No position NFT minted to the connected wallet')
  return minted.args.tokenId
}

export async function positionLiquidity(
  fork: Fork,
  tokenId: bigint,
): Promise<bigint> {
  const position = await fork.client.readContract({
    address: manager,
    abi: nonfungiblePositionManagerAbi_positions,
    functionName: 'positions',
    args: [tokenId],
  })
  return position[7]
}

export async function lpBalance(fork: Fork): Promise<bigint> {
  const address = computeSushiSwapV2PoolAddress({
    factoryAddress: SUSHISWAP_V2_FACTORY_ADDRESS[chainId],
    tokenA: EvmNative.fromChainId(chainId).wrap(),
    tokenB: fork.token,
  })
  return fork.client.readContract({
    address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [account.address],
  })
}

async function settled(
  fork: Fork,
  hash: EvmTxHash,
): Promise<TransactionReceipt> {
  const receipt = await fork.client.waitForTransactionReceipt({
    hash,
    timeout: transactionTimeout,
  })
  expect(receipt.status, 'Seed transaction succeeded').toBe('success')
  return receipt
}

export async function seedV2Pool(fork: Fork): Promise<void> {
  const router = SUSHISWAP_V2_ROUTER_ADDRESS[chainId]
  await settled(
    fork,
    await fork.client.writeContract({
      address: fork.token.address,
      abi: erc20Abi,
      functionName: 'approve',
      args: [router, parseEther('1')],
    }),
  )
  const { timestamp } = await fork.client.getBlock()
  await settled(
    fork,
    await fork.client.writeContract({
      address: router,
      abi: sushiSwapV2RouterAbi_addLiquidityETH,
      functionName: 'addLiquidityETH',
      args: [
        fork.token.address,
        parseEther('1'),
        0n,
        0n,
        account.address,
        timestamp + 3600n,
      ],
      value: parseEther('1'),
    }),
  )
  expect(await lpBalance(fork)).toBeGreaterThan(0n)
}

export async function seedV3Position(fork: Fork): Promise<bigint> {
  const wrapped = EvmNative.fromChainId(chainId).wrap()
  const [token0, token1] = wrapped.sortsBefore(fork.token)
    ? [wrapped, fork.token]
    : [fork.token, wrapped]
  await settled(
    fork,
    await fork.client.writeContract({
      address: wrapped.address,
      abi: parseAbi(['function deposit() payable']),
      functionName: 'deposit',
      value: parseEther('1'),
    }),
  )
  for (const token of [wrapped, fork.token]) {
    await settled(
      fork,
      await fork.client.writeContract({
        address: token.address,
        abi: erc20Abi,
        functionName: 'approve',
        args: [manager, parseEther('1')],
      }),
    )
  }
  await settled(
    fork,
    await fork.client.writeContract({
      address: manager,
      abi: nonfungiblePositionManagerAbi_createAndInitializePoolIfNecessary,
      functionName: 'createAndInitializePoolIfNecessary',
      args: [token0.address, token1.address, 10000, 2n ** 96n],
    }),
  )
  const { timestamp } = await fork.client.getBlock()
  const mint = {
    address: manager,
    abi: nonfungiblePositionManagerAbi_mint,
    functionName: 'mint',
    args: [
      {
        token0: token0.address,
        token1: token1.address,
        fee: 10000,
        tickLower: -20000,
        tickUpper: 20000,
        amount0Desired: parseEther('0.1'),
        amount1Desired: parseEther('0.1'),
        amount0Min: 0n,
        amount1Min: 0n,
        recipient: account.address,
        deadline: timestamp + 3600n,
      },
    ],
  } as const
  const receipt = await settled(
    fork,
    await fork.client.writeContract({
      ...mint,
      gas: await fork.client.estimateContractGas({
        ...mint,
        blockTag: 'pending',
      }),
    }),
  )
  const tokenId = mintedPosition(receipt)
  expect(await positionLiquidity(fork, tokenId)).toBeGreaterThan(0n)
  return tokenId
}
