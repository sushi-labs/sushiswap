import type { Meta, StoryObj } from '@storybook/react'
import { Timer } from '@sushiswap/ui'
import { expect, within } from 'storybook/test'
import { withFixedTime } from '../components/fixed-time'
const meta = {
  title: 'Primitives/Timer',
  component: Timer,
  beforeEach: withFixedTime,
} satisfies Meta<typeof Timer>

export default meta
type Story = StoryObj<typeof meta>

export const Countdown = {
  args: {
    date: new Date('2026-01-17T15:04:05.000Z'),
    children: ({ days, hours, minutes, seconds }) => (
      <span className="font-mono text-2xl">
        {days}d {hours}h {minutes}m {seconds}s
      </span>
    ),
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).findByText(
        '02d 03h 04m 05s',
        {},
        { timeout: 3000 },
      ),
    ).resolves.toBeVisible()
  },
} satisfies Story
export const Expired = {
  args: { ...Countdown.args, date: new Date('2026-01-14T12:00:00.000Z') },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).findByText(
        '00d 00h 00m 00s',
        {},
        { timeout: 3000 },
      ),
    ).resolves.toBeVisible()
  },
} satisfies Story
