import type { Meta, StoryObj } from '@storybook/react'
import { TTLStorageKey } from '@sushiswap/hooks'
import { Button, SettingsModule, SettingsOverlay } from '@sushiswap/ui'
import { userEvent, within } from 'storybook/test'
const meta = {
  title: 'Primitives/SettingsOverlay',
  component: SettingsOverlay,
  beforeEach: () => {
    const keys = [
      'slippage-swap',
      'expertMode',
      'carbonOffset',
      TTLStorageKey.AddLiquidity,
    ]
    const previous = keys.map(
      (key) => [key, localStorage.getItem(key)] as const,
    )
    for (const key of keys) localStorage.removeItem(key)
    return () => {
      for (const [key, value] of previous) {
        if (value === null) localStorage.removeItem(key)
        else localStorage.setItem(key, value)
      }
    }
  },
} satisfies Meta<typeof SettingsOverlay>

export default meta
type Story = StoryObj<typeof meta>

export const Default = {
  args: {
    modules: [
      SettingsModule.SlippageTolerance,
      SettingsModule.TransactionDeadline,
      SettingsModule.ExpertMode,
      SettingsModule.CarbonOffset,
    ],
    options: {
      transactionDeadline: { storageKey: TTLStorageKey.AddLiquidity },
    },
    children: <Button>Open settings</Button>,
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Open settings' }),
    )
  },
} satisfies Story
export const Perps = {
  ...Default,
  args: {
    ...Default.args,
    theme: 'perps',
    modules: [SettingsModule.SlippageTolerance],
  },
} satisfies Story
