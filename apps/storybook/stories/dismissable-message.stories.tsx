import type { Meta, StoryObj } from '@storybook/react'
import { DismissableMessage } from '@sushiswap/ui'
import { expect, userEvent, within } from 'storybook/test'
import { withFixedTime } from '../components/fixed-time'
const meta = {
  title: 'Primitives/DismissableMessage',
  component: DismissableMessage,
  beforeEach: () => {
    const resetTime = withFixedTime()
    const key = 'storybook-dismissable-message'
    const previous = localStorage.getItem(key)
    localStorage.removeItem(key)
    return () => {
      resetTime()
      if (previous === null) localStorage.removeItem(key)
      else localStorage.setItem(key, previous)
    }
  },
} satisfies Meta<typeof DismissableMessage>

export default meta
type Story = StoryObj<typeof meta>

export const Default = {
  args: {
    storageKey: 'storybook-dismissable-message',
    showUntil: '2026-02-01T00:00:00Z',
    children: 'A new version of the interface is available.',
  },
} satisfies Story
export const Dismiss = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
    await expect(
      canvas.queryByText('A new version of the interface is available.'),
    ).not.toBeInTheDocument()
  },
} satisfies Story
export const Expired = {
  args: { ...Default.args, showUntil: '2026-01-01T00:00:00Z' },
} satisfies Story
