import { Amount } from 'sushi'
import { EvmNative, EvmToken, erc20Abi_balanceOf } from 'sushi/evm'
import { type Hex, decodeFunctionResult, encodeFunctionData } from 'viem'
import { accounts } from '../../../src/lib/wagmi/config/test/constants'
import { SwapPage } from '../../helpers/swap'
import { expect, test } from '../fixtures'
import { waitForSuccessfulReceipt } from '../receipt'
import type { TestedChainId } from '../tested-chains'
import { TOKEN_CORPUS } from '../token-corpus'

test.skip(
  process.env.AGENTIC_RUN_MUTATING !== 'true',
  'Set AGENTIC_RUN_MUTATING=true and configure a fork backend to run live swaps.',
)

test('wrapped-native/stable round trip has successful receipts and balance deltas', async ({
  agenticHarness,
  page,
  scenarioSnapshot: _scenarioSnapshot,
}, testInfo) => {
  const chainId = testInfo.project.metadata.chainId as TestedChainId
  const smokeTokens = TOKEN_CORPUS.filter(
    (token) => token.chainId === chainId && token.coverage === 'smoke',
  )
  const stableSeed = smokeTokens[1]
  if (!stableSeed) throw new Error(`Chain ${chainId} has no smoke stable`)

  await page.route(`**/price/v1/${chainId}`, (route) =>
    route.fulfill({ json: {} }),
  )
  await page.route('**/api/swap', (route) =>
    route.fulfill({ json: { maintenance: false } }),
  )

  const sender = accounts[0].privateKey
  const account = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
  expect(sender).toHaveLength(66)
  const native = EvmNative.fromChainId(chainId)
  const stable = new EvmToken(stableSeed)
  const amount = new Amount(native, 10n ** 15n)
  const swapPage = new SwapPage(page, chainId)
  const stableBefore = await tokenBalance(
    agenticHarness.controller,
    stableSeed.address,
    account,
  )

  await swapPage.goTo(`/${chainId}/swap`)
  await swapPage.connect()
  await swapPage.switchNetwork(chainId)
  await swapPage.swap(native, stable, amount)

  const stableAfterBuy = await tokenBalance(
    agenticHarness.controller,
    stableSeed.address,
    account,
  )
  expect(stableAfterBuy).toBeGreaterThan(stableBefore)

  await swapPage.swap(stable, native, 'max')
  const stableAfterSell = await tokenBalance(
    agenticHarness.controller,
    stableSeed.address,
    account,
  )
  expect(stableAfterSell).toBeLessThan(stableAfterBuy)
  expect(agenticHarness.transactionHashes.length).toBeGreaterThanOrEqual(3)
  await Promise.all(
    agenticHarness.transactionHashes.map((hash) =>
      waitForSuccessfulReceipt(agenticHarness.controller, hash),
    ),
  )
})

async function tokenBalance(
  controller: import('../fork-controller').ForkController,
  token: `0x${string}`,
  account: `0x${string}`,
): Promise<bigint> {
  const result = await controller.requestAdmin<Hex>('eth_call', [
    {
      data: encodeFunctionData({
        abi: erc20Abi_balanceOf,
        args: [account],
        functionName: 'balanceOf',
      }),
      to: token,
    },
    'latest',
  ])
  return decodeFunctionResult({
    abi: erc20Abi_balanceOf,
    data: result,
    functionName: 'balanceOf',
  })
}
