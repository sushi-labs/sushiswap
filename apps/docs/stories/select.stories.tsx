// Select.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import { Button, Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/Select',
  component: Select,
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof Select>

export const Default = {
  args: {
    children: 'Select',
  },
  render: () => (
    <Select>
      <SelectGroup>
        <SelectTrigger>
          <SelectValue placeholder="Select an item" />
        </SelectTrigger>
      </SelectGroup>

      <SelectContent>
        <SelectItem value="Item 0">Item 0</SelectItem>
        <SelectItem value="Item 1">Item 1</SelectItem>
        <SelectItem value="Item 2">Item 2</SelectItem>
        <SelectItem value="Item 3">Item 3</SelectItem>
        <SelectItem value="Item 4">Item 4</SelectItem>
      </SelectContent>
    </Select>
  ),
} satisfies Story

export const WithCustomTrigger = {
  storyName: 'With custom trigger',
  args: {
    children: 'Select',
  },
  render: () => (
    <Select>
      <SelectTrigger asChild>
        <Button>Click me</Button>
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="Item 0">Item 0</SelectItem>
        <SelectItem value="Item 1">Item 1</SelectItem>
        <SelectItem value="Item 2">Item 2</SelectItem>
        <SelectItem value="Item 3">Item 3</SelectItem>
        <SelectItem value="Item 4">Item 4</SelectItem>
      </SelectContent>
    </Select>
  ),
} satisfies Story
