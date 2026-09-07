import { erc20Abi, parseEther } from 'viem'
import { createERC20 } from '../erc20'
import { expect, test } from '../fixtures'
import { account, createForkClient, stopFork } from '../fork'

const spender = '0x0000000000000000000000000000000000000001'

test('pending and mined timestamps agree despite elapsed wall time', async ({
  fork,
}) => {
  const latest = await fork.client.getBlock()
  const pending = await fork.client.getBlock({ blockTag: 'pending' })
  expect(pending.timestamp).toBe(latest.timestamp + 1n)
  // Deliberately cross a wall-clock second to catch accidental real-time mining.
  await delay(2100)
  await fork.client.mine({ blocks: 1 })
  expect((await fork.client.getBlock()).timestamp).toBe(pending.timestamp)
})

test('isolates balances, allowances, deployments and nonces between forks', async ({
  fork,
}, info) => {
  const otherUrl = `${new URL(fork.url).origin}/${100_000 + info.workerIndex}`
  const other = createForkClient(otherUrl)
  try {
    await other.getChainId()
    expect(await other.getCode({ address: fork.token.address })).toBeUndefined()
    const otherToken = await createERC20(other)
    expect(otherToken.address).toBe(fork.token.address)
    await fork.client.setBalance({
      address: account.address,
      value: parseEther('1'),
    })
    const hash = await fork.client.writeContract({
      address: fork.token.address,
      abi: erc20Abi,
      functionName: 'approve',
      args: [spender, 123n],
    })
    await fork.client.waitForTransactionReceipt({ hash })
    expect(
      await other.getBalance({ address: account.address }),
    ).toBeGreaterThan(parseEther('100'))
    expect(
      await other.readContract({
        address: otherToken.address,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [account.address, spender],
      }),
    ).toBe(0n)
    expect(await other.getTransactionCount({ address: account.address })).toBe(
      1,
    )
  } finally {
    await stopFork(otherUrl)
  }
})

test('browser RPC and server fetch dispatch reach the same isolated client', async ({
  page,
  fork,
  mocks,
}) => {
  await fork.client.setBalance({ address: account.address, value: 12345n })
  const request = {
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_getBalance',
    params: [account.address, 'latest'],
  }
  const root = new URL(fork.url).origin
  await page.setContent('<p>RPC isolation probe</p>')
  const browser = await page.evaluate(
    async ({ root, request }) => {
      const response = await fetch(root, {
        method: 'POST',
        body: JSON.stringify(request),
        headers: { 'content-type': 'application/json' },
      })
      return response.json()
    },
    { root, request },
  )
  const server = await mocks.dispatch(
    new Request(`${root}/`, { method: 'POST', body: JSON.stringify(request) }),
  )
  expect(server).toBeInstanceOf(Response)
  if (!(server instanceof Response)) throw new Error('Expected RPC response')
  expect(await server.json()).toEqual(browser)
  expect(browser.result).toBe('0x3039')
})

test.describe('snapshot lifecycle', () => {
  test.describe.configure({ mode: 'default' })
  for (const attempt of [1, 2, 3]) {
    test(`starts from the seeded baseline (${attempt})`, async ({ fork }) => {
      expect(
        await fork.client.getTransactionCount({ address: account.address }),
      ).toBe(1)
      expect(
        await fork.client.getBalance({ address: account.address }),
      ).toBeGreaterThan(parseEther('100'))
      expect(
        await fork.client.readContract({
          address: fork.token.address,
          abi: erc20Abi,
          functionName: 'allowance',
          args: [account.address, spender],
        }),
      ).toBe(0n)
      await fork.client.setBalance({ address: account.address, value: 123n })
      await fork.client.setNonce({ address: account.address, nonce: 50 })
    })
  }
})
import { setTimeout as delay } from 'node:timers/promises'
