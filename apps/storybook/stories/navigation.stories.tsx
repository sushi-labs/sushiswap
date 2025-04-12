// Form.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import {
  Navigation,
  NavigationElementType,
  OnramperProvider,
} from '@sushiswap/ui'

const meta = {
  title: 'Components/Navigation',
  component: Navigation,
  args: {
    leftElements: [
      {
        title: 'Home',
        href: '/',
        show: 'everywhere',
        type: NavigationElementType.Single,
      },
    ],
  },
  argTypes: {},
  parameters: {
    docs: {
      page: null,
      story: {
        inline: false,
        iframeHeight: 500,
      },
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof Navigation>

export default meta
type Story = StoryObj<typeof meta>

export const Default = {
  args: {},
  render: (args) => {
    return (
      <OnramperProvider>
        <Navigation {...args} />
      </OnramperProvider>
    )
  },
} satisfies Story

export const Transparent = {
  args: {
    variant: 'transparent',
  },
  render: (args) => {
    return (
      <OnramperProvider>
        <Navigation {...args} />
      </OnramperProvider>
    )
  },
} satisfies Story
