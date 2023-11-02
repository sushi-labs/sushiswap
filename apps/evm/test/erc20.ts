import { ChainId } from 'sushi/chain'
import { erc20Contract } from 'sushi/contract'
import { Token } from 'sushi/currency'
import { createTestClient, http, publicActions, walletActions } from 'viem'
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

export async function impersonateAccount({
  chainId,
  address,
}: {
  chainId: number
  address: `0x${string}`
}) {
  let chain: Chain
  if (chainId === ChainId.POLYGON) {
    chain = polygon
  } else {
    throw new Error('Unsupported chain')
  }

  const client = createTestClient({
    chain,
    mode: 'anvil',
    transport: http(localHttpUrl, { timeout: 120_000 }),
  })
    .extend(walletActions)
    .extend(publicActions)

  await client.impersonateAccount({
    address,
  })
}

// export async function prepareERC20Balance({
//   chainId,
// }: {
//   chainId: number
// }) {
//   let chain: Chain
//   let tokenAddress: `0x${string}`
//   if (chainId === ChainId.POLYGON) {
//     chain = polygon
//     tokenAddress = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
//     // }
//     // } else if (chainId === ChainId.ETHEREUM) {
//     //   chain = mainnet
//     // } else if (chainId === ChainId.ARBITRUM) {
//     //   chain = arbitrum
//   } else {
//     throw new Error('Unsupported chain')
//   }

//   const account = privateKeyToAccount(
//     '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
//   )
//   const publicAddress = publicKeyToAddress(account.publicKey)
//   const impersonatedAccount = '0x23DefC2Ca207e7FBD84AE43B00048Fb5Cb4DB5B2'
//   const amount = parseUnits('10', 6)

//   const client = createTestClient({
//     chain,
//     mode: 'anvil',
//     transport: http(localHttpUrl, { timeout: 120_000 }),
//   })
//     .extend(walletActions)
//     .extend(publicActions)

//   await client.impersonateAccount({
//     address: impersonatedAccount,
//   })

//   await client.writeContract({
//     ...erc20Contract,
//     address: tokenAddress as Address,
//     functionName: 'transfer',
//     account: impersonatedAccount,
//     args: [publicAddress, amount],
//   })

//   await client.stopImpersonatingAccount({
//     address: impersonatedAccount,
//   })
//   const balance = await client.readContract({
//     abi: erc20Contract.abi,
//     address: tokenAddress as Address,
//     functionName: 'balanceOf',
//     args: [publicAddress],
//   })
//   console.log(
//     `${impersonatedAccount} gave ${publicAddress} ${formatUnits(
//       balance,
//       6,
//     )} USDC`,
//   )
// }
