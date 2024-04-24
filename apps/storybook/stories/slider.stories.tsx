// Input.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import { Slider } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/Slider',
  component: Slider,
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof Slider>

export const Default = {
  render: () => {
    return <Slider max={100} step={5} className="col-span-9 w-full" />
  },
} satisfies Story
