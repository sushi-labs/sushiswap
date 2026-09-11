import type { Meta, StoryObj } from '@storybook/react'
import { SplashController } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/SplashController',
  component: SplashController,
} satisfies Meta<typeof SplashController>

export default meta
type Story = StoryObj<typeof meta>

export const Loading = {
  args: { show: true, children: 'Application ready' },
} satisfies Story
export const Ready = { args: { ...Loading.args, show: false } } satisfies Story
