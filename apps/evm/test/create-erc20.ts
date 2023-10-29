import { ChainId } from 'sushi/chain'
import { erc20Contract } from 'sushi/contract'
import { Token } from 'sushi/currency'
import { http, createTestClient, publicActions, walletActions } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { Chain, arbitrum, mainnet, polygon } from 'viem/chains'
import { localHttpUrl } from './constants'

export async function createERC20({
  chainId,
  name = 'FakeToken',
  symbol = 'FT',
  decimals = 18,
}: {
  chainId: number
  name: string
  symbol: string
  decimals: number
}): Promise<Token> {
  let chain: Chain

  if (chainId === ChainId.POLYGON) {
    chain = polygon
  } else if (chainId === ChainId.ETHEREUM) {
    chain = mainnet
  } else if (chainId === ChainId.ARBITRUM) {
    chain = arbitrum
  } else {
    throw new Error('Unsupported chain')
  }

  const account = privateKeyToAccount(
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  )

  const client = createTestClient({
    chain,
    mode: 'anvil',
    transport: http(localHttpUrl, { timeout: 120_000 }),
  })
    .extend(walletActions)
    .extend(publicActions)

  const hash = await client.deployContract({
    ...erc20Contract,
    account,
    args: [name, symbol, BigInt(decimals)],
  })
  // await client.mine({ blocks: 1 })
  const transaction = await client.waitForTransactionReceipt({
    hash,
  })
  // const transaction = await client.getTransactionReceipt({ hash })
  if (!transaction?.contractAddress) {
    throw new Error('No contract address was found')
  }
  // const balance = await client.readContract({
  //   abi: erc20Abi,
  //   address: contractAddress,
  //   functionName: 'balanceOf',
  //   args: [publicKeyToAddress(account.publicKey)],
  // });

  return new Token({
    chainId,
    address: transaction.contractAddress,
    decimals,
    symbol,
    name,
  })
}
