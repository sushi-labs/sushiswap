// Popover.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  PopoverContent,
  PopoverNew,
  PopoverTrigger,
  SelectIcon,
} from '@sushiswap/ui'

const meta = {
  title: 'Primitives/Popover',
  component: PopoverNew,
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof PopoverNew>

export default meta
type Story = StoryObj<typeof PopoverNew>

export const Default = {
  args: {
    children: 'Popover',
  },
  render: () => (
    <PopoverNew>
      <PopoverTrigger>
        <Button>Click me</Button>
      </PopoverTrigger>

      <PopoverContent>
        <h1>This is popover content</h1>
      </PopoverContent>
    </PopoverNew>
  ),
} satisfies Story

export const PopoverWithMenu = {
  storyName: 'Popover example with command',
  args: {
    children: 'Popover',
  },
  render: () => (
    <PopoverNew>
      <PopoverTrigger asChild>
        <Button variant="secondary" role="combobox">
          <span>Networks</span>
          <SelectIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="!p-0 !overflow-x-hidden !overflow-y-scroll scroll">
        <Command>
          <CommandInput placeholder="Search network" />
          <CommandEmpty>No network found.</CommandEmpty>
          <CommandGroup>
            <CommandItem value="Item 0">Command Item 0</CommandItem>
            <CommandItem value="Item 1">Command Item 1</CommandItem>
            <CommandItem value="Item 2">Command Item 2</CommandItem>
            <CommandItem value="Item 3">Command Item 3</CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </PopoverNew>
  ),
} satisfies Story
