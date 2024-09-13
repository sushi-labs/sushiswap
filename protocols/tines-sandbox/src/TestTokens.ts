import { erc20Abi_approve, erc20Abi_balanceOf } from 'sushi/abi'
import { ChainId } from 'sushi/chain'
import { Token } from 'sushi/currency'
import { Address, Hex, PublicClient, WalletClient } from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
import ERC20Mock from '../artifacts/contracts/ERC20Mock.sol/ERC20Mock.json' assert {
  type: 'json',
}

const getDeploymentAddress = async (
  client: WalletClient,
  promise: Promise<Hex>,
) =>
  waitForTransactionReceipt(client, { hash: await promise }).then(
    (receipt) => receipt.contractAddress as Address,
  )

export interface TestTokens {
  owner: Address
  tokens: Token[]
  supply: bigint
}

export async function createTestTokens(
  client: PublicClient & WalletClient,
  testTokensNumber = 2,
  owner?: Address,
  supply = 2n ** 255n,
): Promise<TestTokens> {
  const [deployer] = await client.getAddresses()
  owner = owner ?? deployer

  const tokens: Token[] = []
  for (let i = 0; i < testTokensNumber; ++i) {
    const tokenName = `Token${i}`
    const address = await getDeploymentAddress(
      client,
      client.deployContract({
        chain: null,
        abi: ERC20Mock.abi,
        bytecode: ERC20Mock.bytecode as Hex,
        account: owner,
        args: [tokenName, tokenName, supply],
      }),
    )
    tokens[i] = new Token({
      chainId: client.chain?.id as ChainId,
      address,
      decimals: 18,
      symbol: tokenName,
      name: tokenName,
    })
  }

  return {
    owner,
    tokens,
    supply,
  }
}

export async function approve(
  client: WalletClient,
  token: Token,
  user: Address,
  spender: Address,
  amount: bigint,
) {
  return await client.writeContract({
    chain: null,
    abi: erc20Abi_approve,
    address: token.address as Address,
    account: user,
    functionName: 'approve',
    args: [spender, amount],
  })
}

export async function balanceOf(
  client: PublicClient,
  token: Token,
  owner: Address,
) {
  return await client.readContract({
    abi: erc20Abi_balanceOf,
    address: token.address as Address,
    account: owner,
    functionName: 'balanceOf',
    args: [owner],
  })
}
