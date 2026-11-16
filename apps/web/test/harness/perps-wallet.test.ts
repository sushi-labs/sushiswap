import { expect, test } from '@playwright/test'
import { EvmChainId, multicall3Abi_getEthBalance } from 'sushi/evm'
import {
  http,
  createPublicClient,
  createWalletClient,
  encodeFunctionData,
  erc20Abi,
  numberToHex,
  parseEther,
} from 'viem'
import { mainnet } from 'viem/chains'
import {
  PERPS_ROUTER_ADDRESS,
  PERPS_TEST_ADDRESS,
  PERPS_TRANSACTION_HASH,
  PerpsWalletMocks,
} from '../perps/wallet'

function createClients() {
  const wallet = new PerpsWalletMocks(EvmChainId.ETHEREUM)
  const transport = http('http://127.0.0.1:8545/?chainId=1', {
    fetchFn: (url, init) => wallet.handle(new Request(url, init)),
  })
  const client = createPublicClient({
    chain: mainnet,
    transport,
    batch: { multicall: true },
    pollingInterval: 50,
  })
  const signer = createWalletClient({
    account: PERPS_TEST_ADDRESS,
    chain: mainnet,
    transport,
  })
  return { wallet, client, signer }
}

test('perps wallet decodes batched native balances, ERC20 allowances and ENS reverse names', async () => {
  const { wallet, client } = createClients()
  const [name, balance, allowance] = await Promise.all([
    client.getEnsName({ address: PERPS_TEST_ADDRESS }),
    client.readContract({
      address: mainnet.contracts.multicall3.address,
      abi: multicall3Abi_getEthBalance,
      functionName: 'getEthBalance',
      args: [PERPS_TEST_ADDRESS],
    }),
    client.readContract({
      address: PERPS_ROUTER_ADDRESS,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [PERPS_TEST_ADDRESS, PERPS_ROUTER_ADDRESS],
    }),
  ])
  expect(name).toBeNull()
  expect(balance).toBe(parseEther('10'))
  expect(allowance).toBe(0n)
  // Exercise the actual batched calldata that previously broke browser startup.
  expect(
    wallet.rpcRequests.some((request) => {
      const call = request.params[0]
      return (
        request.method === 'eth_call' &&
        typeof call === 'object' &&
        call !== null &&
        'data' in call &&
        typeof call.data === 'string' &&
        call.data.startsWith('0x82ad56cb')
      )
    }),
  ).toBe(true)
})

test('perps wallet observes source receipts and debits only mined successful transfers', async () => {
  const { wallet, client, signer } = createClients()
  const hash = await signer.sendTransaction({
    to: PERPS_ROUTER_ADDRESS,
    value: parseEther('1'),
    data: '0x12345678',
  })
  const receipt = await client.waitForTransactionReceipt({ hash })
  expect(hash).toBe(PERPS_TRANSACTION_HASH)
  expect(receipt.status).toBe('success')
  expect(wallet.transactions).toHaveLength(1)
  expect(wallet.transactions[0].transaction.chainId).toBe(
    numberToHex(EvmChainId.ETHEREUM),
  )
  expect(await client.getBalance({ address: PERPS_TEST_ADDRESS })).toBe(
    parseEther('9'),
  )
})

test('perps wallet rejection and mined reverts do not debit funds or grant allowance', async () => {
  const { wallet, client, signer } = createClients()
  wallet.rejectNextTransaction()
  await expect(
    signer.sendTransaction({
      to: PERPS_ROUTER_ADDRESS,
      value: parseEther('1'),
    }),
  ).rejects.toThrow('User rejected')
  expect(wallet.transactions).toHaveLength(0)

  wallet.setReceiptStatus('pending')
  const hash = await signer.sendTransaction({
    to: PERPS_ROUTER_ADDRESS,
    data: encodeFunctionData({
      abi: erc20Abi,
      functionName: 'approve',
      args: [PERPS_ROUTER_ADDRESS, 1_000_000n],
    }),
  })
  expect(wallet.transactions[0].status).toBe('pending')
  wallet.setReceiptStatus('reverted')
  const receipt = await client.waitForTransactionReceipt({ hash })
  expect(receipt.status).toBe('reverted')
  expect(await client.getBalance({ address: PERPS_TEST_ADDRESS })).toBe(
    parseEther('10'),
  )
  expect(
    await client.readContract({
      address: PERPS_ROUTER_ADDRESS,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [PERPS_TEST_ADDRESS, PERPS_ROUTER_ADDRESS],
    }),
  ).toBe(0n)
})

test('perps wallet rejects wrong-chain transactions and unhandled RPC methods', async () => {
  const { wallet } = createClients()
  function request(
    method: string,
    params: unknown[],
    chainId: EvmChainId = EvmChainId.ETHEREUM,
  ): Request {
    return new Request(`http://127.0.0.1:8545/?chainId=${chainId}`, {
      method: 'POST',
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    })
  }
  await expect(
    wallet.handle(
      request(
        'eth_sendTransaction',
        [
          {
            from: PERPS_TEST_ADDRESS,
            to: PERPS_ROUTER_ADDRESS,
            value: '0x1',
          },
        ],
        EvmChainId.ARBITRUM,
      ),
    ),
  ).rejects.toThrow('instead of 1')
  await expect(
    wallet.handle(
      request('eth_sendTransaction', [
        {
          chainId: numberToHex(EvmChainId.ARBITRUM),
          from: PERPS_TEST_ADDRESS,
          to: PERPS_ROUTER_ADDRESS,
        },
      ]),
    ),
  ).rejects.toThrow('disagrees with its RPC endpoint')
  await expect(
    wallet.handle(
      new Request('http://127.0.0.1:8545', {
        method: 'POST',
        body: JSON.stringify({
          id: 1,
          method: 'eth_sendTransaction',
          params: [
            {
              chainId: numberToHex(EvmChainId.ETHEREUM),
              from: PERPS_TEST_ADDRESS,
              to: PERPS_ROUTER_ADDRESS,
            },
          ],
        }),
      }),
    ),
  ).rejects.toThrow('endpoint must identify its chain')
  await expect(wallet.handle(request('eth_unrecorded', []))).rejects.toThrow(
    'Unmocked perps wallet RPC',
  )
  expect(wallet.transactions).toHaveLength(0)
})
