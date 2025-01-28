// Popover.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SelectIcon,
} from '@sushiswap/ui'

const meta = {
  title: 'Primitives/Popover',
  component: Popover,
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof Popover>

export const Default = {
  args: {
    children: 'Popover',
  },
  render: () => (
    <Popover>
      <PopoverTrigger>
        <Button>Click me</Button>
      </PopoverTrigger>

      <PopoverContent>
        <h1>This is popover content</h1>
      </PopoverContent>
    </Popover>
  ),
} satisfies Story

export const PopoverWithMenu = {
  name: 'Popover example with command',
  args: {
    children: 'Popover',
  },
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" role="combobox">
          <span>Networks</span>
          <SelectIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="!p-0 !overflow-x-hidden !overflow-y-scroll scroll">
        <Command>
          <CommandInput placeholder="Search network" />
          <CommandGroup>
            <CommandItem value="Item 0">Command Item 0</CommandItem>
            <CommandItem value="Item 1">Command Item 1</CommandItem>
            <CommandItem value="Item 2">Command Item 2</CommandItem>
            <CommandItem value="Item 3">Command Item 3</CommandItem>
          </CommandGroup>
          <CommandEmpty>No network found.</CommandEmpty>
        </Command>
      </PopoverContent>
    </Popover>
  ),
} satisfies Story
