// Dialog.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import {
  Button,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogNew,
  DialogTitle,
  DialogTrigger,
  List,
} from '@sushiswap/ui'
import * as React from 'react'

const meta = {
  title: 'Primitives/Dialog/Simple',
  component: DialogNew,
  argTypes: {},
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof DialogNew>

export default meta
type Story = StoryObj<typeof DialogNew>

export const LosslessDialog = {
  storyName: 'Simple dialog with no followup',
  args: {},
  render: () => {
    return (
      <DialogNew>
        <DialogTrigger asChild>
          <Button>Trigger</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Header</DialogTitle>
            <DialogDescription>This is a dialog description</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <List className="!pt-0">
              <List.Control>
                <List.KeyValue title="Item 0">Value 0</List.KeyValue>
                <List.KeyValue title="Item 1">Value 1</List.KeyValue>
              </List.Control>
            </List>
            <List className="!pt-0">
              <List.Control>
                <List.KeyValue title="Item 0">Value 0</List.KeyValue>
                <List.KeyValue title="Item 1">Value 1</List.KeyValue>
              </List.Control>
            </List>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button fullWidth size="xl">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </DialogNew>
    )
  },
} satisfies Story
