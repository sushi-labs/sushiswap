// Input.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import { Text } from '@sushiswap/ui/src/components/input/Text'

const meta = {
  title: 'Primitives/Input/Text',
  component: Text,
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof Text>

export const Default = {
  args: {
    label: 'Label',
    id: 'input',
  },
} satisfies Story
