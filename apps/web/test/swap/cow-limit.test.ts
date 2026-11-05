import { OrderSigningUtils } from '@cowprotocol/cow-sdk'
import type { Page } from '@playwright/test'
import { getCowSettlement, getCowSpender } from 'src/lib/swap/cow/order'
import { EvmNative, USDC, evmAddress } from 'sushi/evm'
import {
  concatHex,
  erc20Abi,
  hashTypedData,
  recoverTypedDataAddress,
  toHex,
} from 'viem'
import * as z from 'zod'
import { chainId } from '../constants'
import { expect, test } from '../fixtures'
import { account } from '../fork'
import { BaseActions } from '../helpers/base'

async function approveForCow(page: Page): Promise<void> {
  const approve = page.locator('[testdata-id=approve-erc20-button]')
  await expect(approve).toBeEnabled()
  await approve.click()
  await expect(approve).toBeHidden()
}

const hexSchema = z.templateLiteral(['0x', z.string()])

// What the app must post to the orderbook for a Sushi limit order.
const submissionSchema = z
  .object({
    from: evmAddress(),
    appData: z.string(),
    appDataHash: hexSchema,
    signature: hexSchema,
    signingScheme: z.literal('eip712'),
  })
  .passthrough()

const unsignedOrderSchema = z.object({
  sellToken: evmAddress(),
  buyToken: evmAddress(),
  receiver: evmAddress(),
  sellAmount: z.string(),
  buyAmount: z.string(),
  validTo: z.number(),
  appData: hexSchema,
  feeAmount: z.literal('0'),
  kind: z.literal('sell'),
  partiallyFillable: z.literal(true),
  sellTokenBalance: z.literal('erc20'),
  buyTokenBalance: z.literal('erc20'),
})

test('CoW creates, edits and cancels an order with a real token approval', async ({
  page,
  fork,
  mocks,
}) => {
  const orders: Record<string, unknown>[] = []
  mocks.add(async (request) => {
    const url = new URL(request.url)
    if (url.hostname !== 'api.cow.fi') return
    if (url.pathname.endsWith('/quote'))
      return Response.json({
        quote: {
          sellAmount: '1000000000000000000',
          buyAmount: '2000000',
          feeAmount: '0',
        },
        expiration: new Date(Date.now() + 60_000).toISOString(),
      })
    if (url.pathname.endsWith('/orders') && request.method === 'POST') {
      const submission = submissionSchema.parse(await request.json())
      const order = unsignedOrderSchema.parse({
        ...submission,
        appData: submission.appDataHash,
      })
      const domain = {
        name: 'Gnosis Protocol',
        version: 'v2',
        chainId,
        verifyingContract: getCowSettlement(chainId),
      }
      const typedData = {
        domain,
        types: OrderSigningUtils.getEIP712Types(),
        primaryType: 'Order' as const,
        message: order,
      }
      expect(
        (
          await recoverTypedDataAddress({
            ...typedData,
            signature: submission.signature,
          })
        ).toLowerCase(),
      ).toBe(account.address.toLowerCase())
      expect(order.partiallyFillable).toBe(true)
      expect(order.feeAmount).toBe('0')
      const metadata = z
        .object({
          appCode: z.literal('Sushi'),
          metadata: z.object({
            replacedOrder: z.object({ uid: z.string() }).optional(),
            partnerFee: z.unknown().optional(),
          }),
        })
        .parse(JSON.parse(submission.appData))
      expect(metadata.metadata.partnerFee).toBeUndefined()
      if (metadata.metadata.replacedOrder) {
        const previous = orders.find(
          (item) => item.uid === metadata.metadata.replacedOrder?.uid,
        )
        expect(previous).toBeDefined()
        if (previous) previous.status = 'cancelled'
      }
      const uid = concatHex([
        hashTypedData(typedData),
        submission.from,
        toHex(order.validTo, { size: 4 }),
      ])
      orders.unshift({
        ...order,
        uid,
        owner: submission.from,
        fullAppData: submission.appData,
        status: 'open',
        creationDate: new Date().toISOString(),
        signingScheme: 'eip712',
        executedSellAmountBeforeFees: '0',
        executedSellAmount: '0',
        executedBuyAmount: '0',
      })
      return Response.json(uid)
    }
    if (url.pathname.endsWith('/orders') && request.method === 'DELETE') {
      const cancellation = z
        .object({ orderUids: z.array(z.string()) })
        .parse(await request.json())
      for (const order of orders)
        if (cancellation.orderUids.includes(String(order.uid)))
          order.status = 'cancelled'
      return Response.json({})
    }
    if (/\/account\/.*\/orders$/.test(url.pathname))
      return Response.json(orders)
    if (url.pathname.includes('/orders/')) {
      const order = orders.find(
        (item) => item.uid === url.pathname.split('/').at(-1),
      )
      return order
        ? Response.json(order)
        : Response.json({ errorType: 'NotFound' }, { status: 404 })
    }
    if (url.pathname.endsWith('/trades')) return Response.json([])
    throw new Error(`Unhandled CoW request ${request.method} ${url.pathname}`)
  })
  await page.goto(
    `/polygon/limit?token0=${fork.token.address}&token1=${USDC[chainId].address}`,
  )
  const actions = new BaseActions(page, fork)
  await actions.connect()
  const switchNetwork = page.locator(
    `[testdata-id=switch-network-${chainId}-button]`,
  )
  if (await switchNetwork.isVisible()) await actions.switchNetwork(chainId)
  const input = page.locator('[testdata-id=cow-sell-input]')
  await input.fill('1')
  await page.getByLabel('Limit price', { exact: false }).fill('3')
  const expiry = page.getByRole('combobox', { name: 'Order expiry' })
  await expect(expiry).toHaveText('1 week')
  await expiry.click()
  await page.getByRole('option', { name: '1 day', exact: true }).click()
  await expect(expiry).toHaveText('1 day')
  // The approval checker approves this order plus the account's open orders.
  await approveForCow(page)
  await expect
    .poll(() =>
      fork.client.readContract({
        address: fork.token.address,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [account.address, getCowSpender(chainId)],
      }),
    )
    .toBe(10n ** 18n)
  await page
    .getByRole('button', { name: 'Review limit order', exact: true })
    .click()
  await page.getByRole('button', { name: 'Place order', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Success!' })).toBeVisible()
  expect(orders).toHaveLength(1)
  expect(orders[0]?.buyAmount).toBe('3000000')
  expect(Number(orders[0]?.validTo)).toBeGreaterThan(
    Math.floor(Date.now() / 1000) + 86_000,
  )
  expect(Number(orders[0]?.validTo)).toBeLessThanOrEqual(
    Math.floor(Date.now() / 1000) + 86_400,
  )
  await page.getByRole('button', { name: 'Place another order' }).click()
  await page.getByRole('button', { name: /FT.*Open/ }).click()
  await page.getByRole('button', { name: 'Edit order', exact: true }).click()
  await expect(input).toHaveValue('1')
  await page.getByLabel('Limit price', { exact: false }).fill('4')
  await page
    .getByRole('button', { name: 'Review changes', exact: true })
    .click()
  await page.getByRole('button', { name: 'Replace order', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Success!' })).toBeVisible()
  expect(orders).toHaveLength(2)
  expect(orders[0]?.buyAmount).toBe('4000000')
  expect(orders[1]?.status).toBe('cancelled')
  expect(orders[0]?.validTo).toBe(orders[1]?.validTo)
  await page.getByRole('button', { name: 'Place another order' }).click()
  await page.getByRole('combobox', { name: 'Filter orders' }).click()
  await page.getByRole('option', { name: 'Open', exact: true }).click()
  await expect(page.getByRole('button', { name: /FT.*Cancelled/ })).toHaveCount(
    0,
  )
  const openOrder = page.getByRole('button', { name: /FT.*Open/ })
  await openOrder.click()
  await page.getByRole('button', { name: 'Cancel order', exact: true }).click()
  await openOrder.click()
  await expect(
    page.getByRole('button', { name: 'Cancel without gas' }),
  ).not.toBeVisible()
  await openOrder.click()
  await page.getByRole('button', { name: 'Cancel without gas' }).click()
  await expect.poll(() => orders[0]?.status).toBe('cancelled')
  await expect(page.getByText('No open orders found.')).toBeVisible()
})

test('CoW reports unavailable quotes without exposing an order submission', async ({
  page,
  fork,
  mocks,
}) => {
  mocks.add((request) =>
    new URL(request.url).hostname === 'api.cow.fi'
      ? Response.json(
          { errorType: 'NoLiquidity', description: 'No liquidity' },
          { status: 400 },
        )
      : undefined,
  )
  await page.goto(
    `/polygon/limit?token0=${fork.token.address}&token1=${USDC[chainId].address}`,
  )
  const actions = new BaseActions(page, fork)
  await actions.connect()
  const switchNetwork = page.locator(
    `[testdata-id=switch-network-${chainId}-button]`,
  )
  if (await switchNetwork.isVisible()) await actions.switchNetwork(chainId)
  await page.locator('[testdata-id=cow-sell-input]').fill('1')
  await page.getByLabel('Limit price', { exact: false }).fill('3')
  await expect(
    page.getByText('CoW cannot find liquidity for this pair and amount.', {
      exact: false,
    }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Review limit order', exact: true }),
  ).toBeDisabled()
})

test('Legacy Orbs limits have no creation controls', async ({ page }) => {
  await page.goto('/katana/limit-legacy')
  await expect(
    page.getByRole('heading', { name: 'Limit (Legacy — Orbs)' }),
  ).toBeVisible()
  await expect(page.locator('[testdata-id=cow-sell-input]')).toHaveCount(0)
  await expect(
    page.getByRole('button', { name: 'Orders', exact: true }),
  ).toBeVisible()
})

test('CoW native sell wraps only the shortfall and does not wrap again on retry', async ({
  page,
  fork,
  mocks,
}) => {
  mocks.add(async (request) => {
    const url = new URL(request.url)
    if (url.hostname !== 'api.cow.fi') return
    if (url.pathname.endsWith('/quote'))
      return Response.json({
        quote: {
          sellAmount: '1000000000000000000',
          buyAmount: '2000000',
          feeAmount: '0',
        },
        expiration: new Date(Date.now() + 60_000).toISOString(),
      })
    if (/\/account\/.*\/orders$/.test(url.pathname)) return Response.json([])
    if (url.pathname.endsWith('/orders') && request.method === 'POST') {
      // Record the wrapped balance at submission; the order itself is rejected.
      postedWithBalance.push(await balance())
      return Response.json({ errorType: 'NoLiquidity' }, { status: 400 })
    }
    throw new Error(`Unhandled CoW request ${request.method} ${url.pathname}`)
  })
  const postedWithBalance: bigint[] = []
  const wrapped = EvmNative.fromChainId(chainId).wrap()
  const balance = () =>
    fork.client.readContract({
      address: wrapped.address,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [account.address],
    })
  const allowance = () =>
    fork.client.readContract({
      address: wrapped.address,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [account.address, getCowSpender(chainId)],
    })
  const before = await balance()
  // Only the native amount the wrapped balance does not cover is wrapped.
  expect(before).toBeLessThan(10n ** 18n)
  await page.goto(
    `/polygon/limit?token0=NATIVE&token1=${USDC[chainId].address}`,
  )
  const actions = new BaseActions(page, fork)
  await actions.connect()
  if (
    await page
      .locator(`[testdata-id=switch-network-${chainId}-button]`)
      .isVisible()
  )
    await actions.switchNetwork(chainId)
  await page.locator('[testdata-id=cow-sell-input]').fill('1')
  await page.getByLabel('Limit price', { exact: false }).fill('3')
  await approveForCow(page)
  await expect.poll(allowance).toBe(10n ** 18n)
  await page
    .getByRole('button', { name: 'Review limit order', exact: true })
    .click()
  const confirm = page.getByRole('button', {
    name: 'Place order',
    exact: true,
  })
  const rejected = page.getByText(
    'CoW cannot find liquidity for this pair and amount.',
  )
  await confirm.click()
  await expect(rejected).toBeVisible()
  expect(await balance()).toBe(10n ** 18n)
  expect(postedWithBalance).toEqual([10n ** 18n])
  // A retry after the rejected submission signs again but does not re-wrap.
  await confirm.click()
  await expect.poll(() => postedWithBalance).toEqual([10n ** 18n, 10n ** 18n])
  expect(await balance()).toBe(10n ** 18n)
})
