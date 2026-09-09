import type { Meta, StoryObj } from '@storybook/react'
import {
  Button,
  Widget,
  WidgetAction,
  WidgetDescription,
  WidgetFooter,
  WidgetHeader,
  WidgetTitle,
} from '@sushiswap/ui'

const meta = {
  title: 'Primitives/Widget',
  component: Widget,
} satisfies Meta<typeof Widget>

export default meta
type Story = StoryObj<typeof meta>

export const Default = {
  render: (args) => (
    <Widget {...args} className="max-w-md rounded-2xl">
      <WidgetHeader>
        <WidgetTitle>Swap</WidgetTitle>
        <WidgetDescription>
          Trade tokens on your favorite network.
        </WidgetDescription>
      </WidgetHeader>
      <WidgetAction>
        <Button size="xs" variant="ghost">
          Settings
        </Button>
      </WidgetAction>
      <div className="rounded-xl bg-secondary p-6">1.00 ETH</div>
      <WidgetFooter>
        <Button fullWidth>Review swap</Button>
      </WidgetFooter>
    </Widget>
  ),
} satisfies Story
export const Empty = { ...Default, args: { variant: 'empty' } } satisfies Story
