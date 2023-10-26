// Input.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof Tabs>

export const Default = {
  render: () => {
    return (
      <Tabs defaultValue="add">
        <TabsList className="!flex">
          <TabsTrigger
            testdata-id="add-tab"
            value="add"
            className="flex flex-1"
          >
            Add
          </TabsTrigger>
          <TabsTrigger
            testdata-id="remove-tab"
            value="remove"
            className="flex flex-1"
          >
            Remove
          </TabsTrigger>
          <TabsTrigger
            testdata-id="stake-tab"
            value="stake"
            className="flex flex-1"
          >
            Stake
          </TabsTrigger>
          <TabsTrigger
            testdata-id="unstake-tab"
            value="unstake"
            className="flex flex-1"
          >
            Unstake
          </TabsTrigger>
        </TabsList>
        <TabsContent value="add">Add tab content</TabsContent>
        <TabsContent value="remove">Remove tab content </TabsContent>
        <TabsContent value="stake">Stake tab content </TabsContent>
        <TabsContent value="unstake">Unstake tab content </TabsContent>
      </Tabs>
    )
  },
} satisfies Story
