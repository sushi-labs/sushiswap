// Select.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import {
  Button,
  Select,
  SelectCaption,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@sushiswap/ui'

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
      <SelectTrigger>
        <SelectValue placeholder="Select an item" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Group 1</SelectLabel>
          <SelectItem value="Item 0">Item 0</SelectItem>
          <SelectItem value="Item 1">Item 1</SelectItem>
        </SelectGroup>

        <SelectGroup>
          <SelectLabel>Group 2</SelectLabel>
          <SelectItem value="Item 2">Item 2</SelectItem>
          <SelectItem value="Item 3">Item 3</SelectItem>
          <SelectItem value="Item 4">Item 4</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
} satisfies Story

export const Trigger = {
  storyName: 'Custom trigger',
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

export const Caption = {
  storyName: 'Including a caption',
  args: {
    children: 'Select',
  },
  render: () => (
    <>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an item" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="Item 0">Item 0</SelectItem>
          <SelectItem value="Item 1">Item 1</SelectItem>
          <SelectItem value="Item 2">Item 2</SelectItem>
          <SelectItem value="Item 3">Item 3</SelectItem>
          <SelectItem value="Item 4">Item 4</SelectItem>
        </SelectContent>
        <SelectCaption caption="This is a caption">This is a caption</SelectCaption>
      </Select>
    </>
  ),
} satisfies Story

export const Error = {
  storyName: 'Error caption',
  args: {
    children: 'Select',
  },
  render: () => (
    <>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an item" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="Item 0">Item 0</SelectItem>
          <SelectItem value="Item 1">Item 1</SelectItem>
          <SelectItem value="Item 2">Item 2</SelectItem>
          <SelectItem value="Item 3">Item 3</SelectItem>
          <SelectItem value="Item 4">Item 4</SelectItem>
        </SelectContent>
        <SelectCaption caption="This is a caption" isError={true}>
          This is a caption as an error
        </SelectCaption>
      </Select>
    </>
  ),
} satisfies Story
