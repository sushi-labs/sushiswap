// Explainer.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import { Explainer } from '@sushiswap/ui'
import * as React from 'react'

const meta = {
  title: 'Primitives/Explainer',
  component: Explainer,
  argTypes: {},
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof Explainer>

export default meta
type Story = StoryObj<typeof Explainer>

export const Default = {
  args: {},
  render: (args) => {
    return (
      <div className="flex text-sm gap-1">
        Hover icon to see explainer
        <Explainer {...args}>
          <div className="flex flex-col gap-3">
            We need your approval to execute this transaction on your behalf.
            <a
              target="_blank"
              className="flex items-center gap-1 text-blue dark:text-blue dark:font-semibold hover:text-blue-700"
              href="https://www.sushi.com/academy/articles/what-is-token-approval"
              rel="noreferrer"
            >
              Learn more
            </a>
          </div>
        </Explainer>
      </div>
    )
  },
} satisfies Story
