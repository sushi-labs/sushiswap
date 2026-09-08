import type { Meta, StoryObj } from '@storybook/react'
import { Stat, StatLabel, StatValue } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/Stat',
  component: Stat,
} satisfies Meta<typeof Stat>

export default meta
type Story = StoryObj<typeof meta>

export const Default = {
  render: () => (
    <Stat>
      <StatLabel>Total value locked</StatLabel>
      <StatValue size="3xl">$12,345,678</StatValue>
    </Stat>
  ),
} satisfies Story
export const Sizes = {
  render: () => (
    <div className="flex flex-wrap gap-8">
      {(['xs', 'sm', 'default', 'lg', 'xl'] as const).map((size) => (
        <Stat key={size} size={size}>
          <StatLabel size={size}>Volume ({size})</StatLabel>
          <StatValue size={size}>$42,000</StatValue>
        </Stat>
      ))}
    </div>
  ),
} satisfies Story
export const Alignments = {
  render: () => (
    <div className="grid grid-cols-3 gap-8">
      {(['left', 'center', 'right'] as const).map((align) => (
        <Stat key={align}>
          <StatLabel align={align}>Volume</StatLabel>
          <StatValue align={align}>$42,000</StatValue>
        </Stat>
      ))}
    </div>
  ),
} satisfies Story
