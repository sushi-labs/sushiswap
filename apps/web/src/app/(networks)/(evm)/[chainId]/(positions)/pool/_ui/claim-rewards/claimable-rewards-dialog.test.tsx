/** @vitest-environment jsdom */

import { type PropsWithChildren, act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import type { ClaimableRewards } from 'src/lib/hooks/react-query'
import type { useClaimRewards } from 'src/lib/wagmi/hooks/rewards/hooks/use-claim-rewards'
import { Amount } from 'sushi'
import { EvmChainId, EvmNative } from 'sushi/evm'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { ClaimableRewardsDialog } from './claimable-rewards-dialog'

const mocks = vi.hoisted(() => ({
  isMd: true,
  useClaimRewards: vi.fn(),
  write: vi.fn(),
}))

vi.mock('@sushiswap/ui', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@sushiswap/ui')>()),
  useBreakpoint: () => ({ isMd: mocks.isMd }),
}))
vi.mock('wagmi', () => ({
  useConnection: () => ({
    address: '0x0000000000000000000000000000000000000001',
    chainId: EvmChainId.ETHEREUM,
    isConnecting: false,
  }),
}))
vi.mock('src/lib/wagmi/systems/checker/connect', () => ({
  Connect: ({ children }: PropsWithChildren) => children,
}))
vi.mock('src/lib/wagmi/systems/checker/network', () => ({
  Network: ({ children }: PropsWithChildren) => children,
}))
vi.mock('src/lib/wagmi/hooks/rewards/hooks/use-claim-rewards', () => ({
  useClaimRewards: mocks.useClaimRewards,
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const transactionHash =
  '0x1111111111111111111111111111111111111111111111111111111111111111'
const token = EvmNative.fromChainId(EvmChainId.ETHEREUM).wrap()
const rewards: ClaimableRewards = {
  chainId: EvmChainId.ETHEREUM,
  rewardAmounts: { [token.address]: new Amount(token, 10n ** 18n) },
  rewardAmountsUSD: { [token.address]: 20 },
  totalRewardsUSD: 20,
  claimArgs: [
    ['0x0000000000000000000000000000000000000001'],
    [token.address],
    [10n ** 18n],
    [[]],
  ],
}

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(320)
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(560)
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

async function render(rows: ClaimableRewards[]): Promise<void> {
  await act(async () => {
    root.render(
      <ClaimableRewardsDialog
        rewards={rows}
        isLoading={false}
        isError={false}
      />,
    )
  })
}

async function click(
  label: string,
  parent: ParentNode = document.body,
): Promise<void> {
  const button = Array.from(parent.querySelectorAll('button')).find(
    (element) => element.textContent?.trim() === label,
  )
  if (!button) throw new Error(`Missing button: ${label}`)
  await act(async () => button.click())
}

function visibleDialog(): HTMLElement {
  const dialog = Array.from(
    document.body.querySelectorAll<HTMLElement>('[role="dialog"]'),
  ).find((element) => !element.closest('[aria-hidden="true"]'))
  if (!dialog) throw new Error('Missing active dialog')
  return dialog
}

it.each(['desktop', 'mobile'])(
  'claims from the %s rewards list',
  async (layout) => {
    mocks.isMd = layout === 'desktop'
    const receipt = Promise.withResolvers<void>()
    mocks.useClaimRewards.mockImplementation(
      ({ onRewardsSubmitted }: Parameters<typeof useClaimRewards>[0]) => ({
        isPending: false,
        write: () => {
          mocks.write()
          onRewardsSubmitted?.(transactionHash, receipt.promise)
        },
      }),
    )

    await render([rewards])
    await click('Claim Rewards', container)
    const list = visibleDialog()
    expect(list.textContent).toContain('Claimable Rewards (1)')
    expect(
      list.querySelector(layout === 'desktop' ? 'table' : 'dl'),
    ).toBeTruthy()
    await click('Claim Rewards', list)
    expect(mocks.write).not.toHaveBeenCalled()
    expect(mocks.useClaimRewards).toHaveBeenLastCalledWith(
      expect.objectContaining({ rewards }),
    )

    await click('Claim', visibleDialog())
    expect(mocks.write).toHaveBeenCalledOnce()
    expect(visibleDialog().textContent).toContain('Confirming')
    expect(visibleDialog().querySelector('a')?.href).toContain(transactionHash)

    await render([])
    expect(list.textContent).toContain('Claimable Rewards (0)')
    expect(visibleDialog().textContent).toContain('Confirming')
    await act(async () => receipt.resolve())
    expect(visibleDialog().textContent).toContain('Success')
    await click('Close', visibleDialog())
    expect(visibleDialog()).toBe(list)
  },
)
