import { tradeValidator02 } from 'src/lib/hooks/react-query/trade/validator02'
import { Amount } from 'sushi'
import { EvmNative, USDC } from 'sushi/evm'
import { erc20Abi } from 'viem'
import * as z from 'zod'
import { chainId, nativeAmount } from '../constants'
import { expect, test } from '../fixtures'
import { account, currencyBalance } from '../fork'
import { SwapPage } from '../helpers/swap'
import reverseSwap from './mock/137-usdc-to-native.json' with { type: 'json' }

const native = EvmNative.fromChainId(chainId)
const usdc = USDC[chainId]
const rpcRequest = z.object({
  id: z.union([z.number(), z.string()]),
  method: z.string(),
})

test('quote API failure disables submission', async ({ page, fork, mocks }) => {
  let requests = 0
  mocks.add((request) => {
    if (new URL(request.url).pathname === '/quote/v7/137') {
      requests++
      return Response.json(
        { error: 'Quote service unavailable' },
        { status: 503 },
      )
    }
  })
  const swap = new SwapPage(page, chainId, fork, mocks)
  await page.goto('/polygon/swap')
  await swap.connect()
  await swap.switchNetwork(chainId)
  await swap.prepare(native, usdc, nativeAmount)
  await expect.poll(() => requests).toBeGreaterThan(0)
  await expect(page.locator('[testdata-id=swap-button]')).toBeDisabled()
  await expect(page.locator('[testdata-id=confirm-swap-button]')).toBeHidden()
})

test('existing allowance skips approval and submits only the swap', async ({
  page,
  fork,
  mocks,
}) => {
  const swap = new SwapPage(page, chainId, fork, mocks)
  await swap.mockSwapApi('test/swap/mock/137-native-to-usdc.json')
  await swap.mockSwapApi('test/swap/mock/137-usdc-to-native.json')
  await page.goto('/polygon/swap')
  await swap.connect()
  await swap.switchNetwork(chainId)
  await swap.swap(native, usdc, nativeAmount)
  const recording = tradeValidator02.parse(reverseSwap)
  if (recording.status !== 'Success' || !recording.tx)
    throw new Error('Expected executable recording')
  const hash = await fork.client.writeContract({
    address: usdc.address,
    abi: erc20Abi,
    functionName: 'approve',
    args: [recording.tx.to, 1_000_000n],
  })
  await fork.client.waitForTransactionReceipt({ hash })
  const before = await fork.client.getTransactionCount({
    address: account.address,
  })
  await swap.swap(usdc, native, new Amount(usdc, 1_000_000n))
  expect(
    await fork.client.getTransactionCount({ address: account.address }),
  ).toBe(before + 1)
})

test('approval rejection leaves allowance unchanged and can be retried', async ({
  page,
  fork,
  mocks,
}) => {
  const swap = new SwapPage(page, chainId, fork, mocks)
  await swap.mockSwapApi('test/swap/mock/137-native-to-usdc.json')
  await swap.mockSwapApi('test/swap/mock/137-usdc-to-native.json')
  await page.goto('/polygon/swap')
  await swap.connect()
  await swap.switchNetwork(chainId)
  await swap.swap(native, usdc, nativeAmount)
  await swap.prepare(usdc, native, new Amount(usdc, 1_000_000n))
  const before = await fork.client.getTransactionCount({
    address: account.address,
  })
  let reject = true
  mocks.addRpc(async (request) => {
    const rpc = rpcRequest.parse(await request.json())
    if (rpc.method === 'eth_sendTransaction' && reject) {
      return Response.json({
        jsonrpc: '2.0',
        id: rpc.id,
        error: { code: 4001, message: 'User rejected the request.' },
      })
    }
  })
  const approve = page.locator('[testdata-id=approve-erc20-button]')
  const [response] = await Promise.all([
    page.waitForResponse(
      async (response) =>
        response.url().startsWith(new URL(fork.url).origin) &&
        response.request().postDataJSON()?.method === 'eth_sendTransaction' &&
        (await response.json()).error?.code === 4001,
    ),
    approve.click(),
  ])
  await response.finished()
  await expect(approve).toBeEnabled()
  expect(
    await fork.client.getTransactionCount({ address: account.address }),
  ).toBe(before)
  reject = false
  await swap.approve(usdc)
  await swap.confirm(usdc, native)
  expect(
    await fork.client.getTransactionCount({ address: account.address }),
  ).toBe(before + 2)
})

test('a missing route prevents submission', async ({ page, fork, mocks }) => {
  const swap = new SwapPage(page, chainId, fork, mocks)
  await page.goto('/polygon/swap')
  await swap.connect()
  await swap.switchNetwork(chainId)
  await swap.prepare(native, usdc, nativeAmount)
  await expect(
    page.getByRole('button', { name: 'No trade found', exact: true }),
  ).toBeDisabled()
  await expect(page.locator('[testdata-id=confirm-swap-button]')).toBeHidden()
})

test('insufficient native balance prevents submission', async ({
  page,
  fork,
  mocks,
}) => {
  const swap = new SwapPage(page, chainId, fork, mocks)
  await page.goto('/polygon/swap')
  await swap.connect()
  await swap.switchNetwork(chainId)
  await swap.prepare(native, native.wrap(), new Amount(native, 10n ** 30n))
  await expect(
    page.getByRole('button', { name: 'Insufficient Balance', exact: true }),
  ).toBeDisabled()
  await expect(page.locator('[testdata-id=confirm-swap-button]')).toBeHidden()
})

test('wallet rejection keeps review actionable and retry submits exactly once', async ({
  page,
  fork,
  mocks,
}) => {
  const swap = new SwapPage(page, chainId, fork, mocks)
  await page.goto('/polygon/swap')
  await swap.connect()
  await swap.switchNetwork(chainId)
  await swap.mockSwapApi('test/swap/mock/137-wrap.json')
  await swap.prepare(native, native.wrap(), nativeAmount)
  await swap.review()
  const nonce = await fork.client.getTransactionCount({
    address: account.address,
  })
  let rejected = false
  mocks.addRpc(async (request) => {
    const rpc = rpcRequest.parse(await request.json())
    if (rpc.method === 'eth_sendTransaction' && !rejected) {
      rejected = true
      return Response.json({
        jsonrpc: '2.0',
        id: rpc.id,
        error: { code: 4001, message: 'User rejected the request.' },
      })
    }
  })
  const confirm = page.locator('[testdata-id=confirm-swap-button]')
  const [rejection] = await Promise.all([
    page.waitForResponse(async (response) => {
      if (!response.url().startsWith(new URL(fork.url).origin)) return false
      const body = response.request().postDataJSON()
      return (
        body?.method === 'eth_sendTransaction' &&
        (await response.json()).error?.code === 4001
      )
    }),
    confirm.click(),
  ])
  await rejection.finished()
  expect(rejected).toBe(true)
  await expect(confirm).toBeEnabled()
  expect(
    await fork.client.getTransactionCount({ address: account.address }),
  ).toBe(nonce)
  await swap.transact('Retry rejected wrap', () => confirm.click())
  await expect(
    page.getByRole('heading', { name: 'Success!', exact: true }),
  ).toBeVisible()
  expect(
    await fork.client.getTransactionCount({ address: account.address }),
  ).toBe(nonce + 1)
})

test('a mined revert shows failure without crediting output tokens', async ({
  page,
  fork,
  mocks,
}) => {
  const swap = new SwapPage(page, chainId, fork, mocks)
  await page.goto('/polygon/swap')
  await swap.connect()
  await swap.switchNetwork(chainId)
  await swap.mockSwapApi('test/swap/mock/137-wrap.json')
  await swap.prepare(native, native.wrap(), nativeAmount)
  await swap.review()
  const before = await currencyBalance(fork.client, native.wrap())
  // Force a mined revert after review, rather than a simulation error.
  // The snapshot fixture restores the original wrapped-native contract.
  const originalCode = await fork.client.getCode({
    address: native.wrap().address,
  })
  if (!originalCode) throw new Error('Wrapped native contract is missing')
  await fork.client.setCode({
    address: native.wrap().address,
    bytecode: '0x60006000fd',
  })
  mocks.addRpc(async (request) => {
    const rpc = rpcRequest.parse(await request.json())
    if (rpc.method === 'eth_estimateGas')
      return Response.json({ jsonrpc: '2.0', id: rpc.id, result: '0x186a0' })
  })
  await page.locator('[testdata-id=confirm-swap-button]').click()
  await expect(
    page.getByRole('heading', { name: 'Oops!', exact: true }),
  ).toBeVisible({ timeout: 60_000 })
  await expect(
    page.getByRole('heading', { name: 'Success!', exact: true }),
  ).toBeHidden()
  // Restore the bytecode before reading the token balance.
  // Account storage remains unchanged by the reverted transaction.
  await fork.client.setCode({
    address: native.wrap().address,
    bytecode: originalCode,
  })
  expect(await currencyBalance(fork.client, native.wrap())).toBe(before)
})
