import type { Meta, StoryObj } from '@storybook/react'
import { Badge, Button } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/Badge',
  component: Badge,
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof Badge>

export const Default = {
  args: {
    position: 'top-right',
    badgeContent: (
      <span className="rounded-full bg-blue px-2 text-xs text-white">3</span>
    ),
    children: <Button variant="secondary">Notifications</Button>,
  },
  decorators: [
    (Story) => (
      <div className="inline-flex p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Story
export const Positions = {
  render: () => (
    <div className="flex flex-wrap gap-16 p-8">
      {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map(
        (position) => (
          <Badge
            key={position}
            position={position}
            badgeContent={
              <span className="rounded-full bg-blue px-2 text-xs text-white">
                3
              </span>
            }
          >
            <Button variant="secondary">{position}</Button>
          </Badge>
        ),
      )}
    </div>
  ),
} satisfies Story
