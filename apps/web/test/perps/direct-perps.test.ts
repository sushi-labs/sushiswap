import type { Locator, Page } from '@playwright/test'
import {
  LIFI_PERPS_CHAIN_ID,
  LIFI_PERPS_USDC_ADDRESS,
} from 'src/lib/perps/deposit/lifi-perps-schemas'
import { getChainById } from 'sushi'
import { EvmChainId, USDC } from 'sushi/evm'
import { decodeFunctionData, erc20Abi, numberToHex, parseEther } from 'viem'
import {
  ANY_TOKEN_ANY_CHAIN_DEPOSIT_CHAIN_IDS,
  type AnyTokenAnyChainDepositChainId,
} from '~evm/perps/_ui/account-management/deposit-dialog/any-token-deposit-config'
import { expect, test } from './fixtures'
import {
  PERPS_ROUTER_ADDRESS,
  PERPS_TEST_ADDRESS,
  PERPS_TRANSACTION_HASH,
} from './wallet'

async function openDeposit(
  page: Page,
  sourceChainId: AnyTokenAnyChainDepositChainId,
): Promise<Locator> {
  await page.goto('/perps', { waitUntil: 'domcontentloaded' })
  const connect = page.locator('[testdata-id=connect-button]:visible').first()
  const connected = page
    .locator('[data-sidebar-trigger]:not([testdata-id=connect-button]):visible')
    .first()
  await expect(connect.or(connected).first()).toBeVisible({ timeout: 60_000 })
  if (await connect.isVisible()) await connect.click()
  await expect(connected).toBeVisible()
  await page
    .getByRole('button', { name: 'Deposit', exact: true })
    .first()
    .click()
  const dialog = page.getByRole('dialog', { name: 'Deposit', exact: true })
  await expect(dialog).toBeVisible()
  await dialog.getByRole('combobox', { name: 'Deposit network' }).click()
  await page
    .getByRole('option', {
      name: getChainById(sourceChainId).name,
      exact: true,
    })
    .click()
  await expect(
    dialog.getByRole('textbox', { name: 'Amount', exact: true }),
  ).toBeEnabled()
  await dialog.getByRole('textbox', { name: 'Amount', exact: true }).fill('1')
  const switchNetwork = dialog.getByRole('button', {
    name: `Switch to ${getChainById(sourceChainId).name}`,
    exact: true,
  })
  const deposit = dialog.getByRole('button', { name: 'Deposit', exact: true })
  await expect(switchNetwork.or(deposit).first()).toBeVisible()
  if (await switchNetwork.isVisible()) await switchNetwork.click()
  await expect(deposit).toBeEnabled()
  return dialog
}

for (const sourceChainId of ANY_TOKEN_ANY_CHAIN_DEPOSIT_CHAIN_IDS) {
  test.describe(`${getChainById(sourceChainId).name} direct perps deposit`, () => {
    test.use({ sourceChainId })

    test('uses one source transaction and waits for verified perps settlement', async ({
      page,
      wallet,
      perps,
    }) => {
      const dialog = await openDeposit(page, sourceChainId)
      await expect(dialog.getByText('~1 second', { exact: true })).toBeVisible()
      await dialog.getByRole('button', { name: 'Deposit', exact: true }).click()

      await expect.poll(() => wallet.transactions.length).toBe(1)
      expect(wallet.transactions[0]).toMatchObject({
        hash: PERPS_TRANSACTION_HASH,
        status: 'success',
        transaction: {
          chainId: numberToHex(sourceChainId),
          from: PERPS_TEST_ADDRESS,
          to: PERPS_ROUTER_ADDRESS,
          data: '0x12345678',
          value: numberToHex(parseEther('1')),
        },
      })
      await expect.poll(() => perps.statusRequests.length).toBeGreaterThan(0)
      expect(perps.quoteRequests.at(-1)).toMatchObject({
        fromChainId: sourceChainId,
        toChainId: LIFI_PERPS_CHAIN_ID,
        toTokenAddress: LIFI_PERPS_USDC_ADDRESS,
        toAddress: PERPS_TEST_ADDRESS,
        options: { order: 'FASTEST', allowSwitchChain: false },
      })
      expect(perps.stepRequests.at(-1)?.id).toContain('-fast:0')
      expect(perps.statusRequests.at(-1)?.searchParams.get('txHash')).toBe(
        PERPS_TRANSACTION_HASH,
      )
      await expect(
        dialog.getByText('Waiting for perps USDC', { exact: true }),
      ).toBeVisible()
      await expect(
        dialog.getByRole('button', { name: 'Deposit pending', exact: true }),
      ).toBeDisabled()
      await expect(
        dialog.getByRole('combobox', { name: 'Deposit network' }),
      ).toBeDisabled()

      perps.setSettlement('completed')
      await expect(dialog).toBeHidden({ timeout: 20_000 })
      expect(wallet.transactions).toHaveLength(1)
      expect(perps.accountValue).toBe('198.5')
      await expect(
        page.getByText('$198.50', { exact: true }).first(),
      ).toBeVisible()
      expect(
        wallet.rpcRequests.filter(
          (request) => request.method === 'eth_sendTransaction',
        ),
      ).toHaveLength(1)
    })
  })
}

test.describe('direct perps recovery', () => {
  test.use({ sourceChainId: EvmChainId.BASE })

  test('does not complete a pending transfer when an unrelated account credit arrives', async ({
    page,
    wallet,
    perps,
  }) => {
    const dialog = await openDeposit(page, EvmChainId.BASE)
    await dialog.getByRole('button', { name: 'Deposit', exact: true }).click()
    await expect.poll(() => perps.statusRequests.length).toBeGreaterThan(0)
    perps.setAccountValue('250')
    await expect(
      page.getByText('$250.00', { exact: true }).first(),
    ).toBeVisible()
    await expect(
      dialog.getByText('Waiting for perps USDC', { exact: true }),
    ).toBeVisible()
    await expect(
      dialog.getByRole('button', { name: 'Deposit pending', exact: true }),
    ).toBeDisabled()
    expect(wallet.transactions).toHaveLength(1)

    perps.setSettlement('completed')
    await expect(dialog).toBeHidden({ timeout: 20_000 })
    expect(wallet.transactions).toHaveLength(1)
  })

  test('keeps the transfer pending across dialog dismissal without resubmitting', async ({
    page,
    wallet,
    perps,
  }) => {
    let dialog = await openDeposit(page, EvmChainId.BASE)
    await dialog.getByRole('button', { name: 'Deposit', exact: true }).click()
    await expect.poll(() => perps.statusRequests.length).toBeGreaterThan(0)
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await page
      .getByRole('button', { name: 'Deposit', exact: true })
      .first()
      .click()
    dialog = page.getByRole('dialog', { name: 'Deposit', exact: true })
    await expect(
      dialog.getByText('Waiting for perps USDC', { exact: true }),
    ).toBeVisible()
    expect(wallet.transactions).toHaveLength(1)
    perps.setSettlement('completed')
    await expect(dialog).toBeHidden({ timeout: 20_000 })
    expect(wallet.transactions).toHaveLength(1)
  })

  for (const settlement of ['partial', 'refunded', 'unverified'] as const) {
    test(`does not treat ${settlement} delivery as a perps deposit`, async ({
      page,
      wallet,
      perps,
    }) => {
      const dialog = await openDeposit(page, EvmChainId.BASE)
      perps.setSettlement(settlement)
      await dialog.getByRole('button', { name: 'Deposit', exact: true }).click()
      await expect(
        dialog.getByText('Deposit needs attention', { exact: true }),
      ).toBeVisible()
      await expect(
        dialog.getByRole('link', { name: 'View transfer' }),
      ).toHaveAttribute(
        'href',
        `https://scan.li.fi/tx/${PERPS_TRANSACTION_HASH}`,
      )
      expect(perps.accountValue).toBe('100')
      expect(wallet.transactions).toHaveLength(1)
    })
  }

  test('shows a reverted source transaction as failed', async ({
    page,
    wallet,
    perps,
  }) => {
    const dialog = await openDeposit(page, EvmChainId.BASE)
    wallet.revertNextTransaction()
    await dialog.getByRole('button', { name: 'Deposit', exact: true }).click()
    await expect(
      dialog.getByText(
        'The source transaction reverted. Your deposit was not sent.',
        { exact: true },
      ),
    ).toBeVisible()
    await expect(
      dialog.getByRole('button', { name: 'Try again', exact: true }),
    ).toBeEnabled()
    expect(perps.accountValue).toBe('100')
    expect(wallet.transactions).toHaveLength(1)
  })

  test('allows retry after the wallet rejects the source transaction', async ({
    page,
    wallet,
  }) => {
    const dialog = await openDeposit(page, EvmChainId.BASE)
    wallet.rejectNextTransaction()
    await dialog.getByRole('button', { name: 'Deposit', exact: true }).click()
    await expect
      .poll(
        () =>
          wallet.rpcRequests.filter(
            (request) => request.method === 'eth_sendTransaction',
          ).length,
      )
      .toBe(1)
    await expect(
      dialog.getByRole('button', { name: 'Deposit', exact: true }),
    ).toBeEnabled()
    expect(wallet.transactions).toHaveLength(0)
  })

  test('does not submit an old quote when the new amount has no route', async ({
    page,
    wallet,
    perps,
  }) => {
    const dialog = await openDeposit(page, EvmChainId.BASE)
    perps.quoteAvailable = false
    await dialog.getByRole('textbox', { name: 'Amount', exact: true }).fill('2')
    await expect(
      dialog.getByRole('button', {
        name: 'No deposit route available',
        exact: true,
      }),
    ).toBeDisabled()
    expect(wallet.transactions).toHaveLength(0)
  })

  test('approves an ERC20 on the source chain before depositing directly to perps', async ({
    page,
    wallet,
    perps,
  }) => {
    const dialog = await openDeposit(page, EvmChainId.BASE)
    await dialog.getByRole('combobox', { name: 'Deposit token' }).click()
    await page.getByRole('option').filter({ hasText: 'USDC' }).click()
    await dialog.getByRole('textbox', { name: 'Amount', exact: true }).fill('1')
    const approve = dialog.getByRole('button', { name: /^Approve USDC/ })
    await expect(approve).toBeEnabled()
    await approve.click()
    await expect.poll(() => wallet.transactions.length).toBe(1)
    expect(wallet.transactions[0].transaction).toMatchObject({
      chainId: numberToHex(EvmChainId.BASE),
      to: USDC[EvmChainId.BASE].address,
    })
    const approval = decodeFunctionData({
      abi: erc20Abi,
      data: wallet.transactions[0].transaction.data,
    })
    expect(approval.functionName).toBe('approve')
    expect(approval.args).toEqual([PERPS_ROUTER_ADDRESS, 1_000_000n])
    await expect(
      dialog.getByRole('button', { name: 'Deposit', exact: true }),
    ).toBeEnabled()
    await dialog.getByRole('button', { name: 'Deposit', exact: true }).click()
    await expect.poll(() => perps.statusRequests.length).toBeGreaterThan(0)
    expect(wallet.transactions).toHaveLength(2)
    expect(wallet.transactions[1].transaction).toMatchObject({
      chainId: numberToHex(EvmChainId.BASE),
      to: PERPS_ROUTER_ADDRESS,
      value: '0x0',
    })
    perps.setSettlement('completed')
    await expect(dialog).toBeHidden({ timeout: 20_000 })
    expect(wallet.transactions).toHaveLength(2)
  })
})
