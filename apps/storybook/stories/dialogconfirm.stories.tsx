// Dialog.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import {
  Button,
  DialogConfirm,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
  DialogTrigger,
  List,
} from '@sushiswap/ui'
import * as React from 'react'

const meta = {
  title: 'Primitives/Dialog/Review and Confirm',
  component: DialogConfirm,
  argTypes: {
    status: {
      options: ['loading', 'error', 'success'],
      control: { type: 'select' },
    },
  },
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof DialogConfirm>

export default meta
type Story = StoryObj<typeof DialogConfirm>

export const Pending = {
  name: 'Pending',
  args: {},
  render: () => {
    return (
      <DialogProvider>
        <DialogReview>
          {({ confirm }) => (
            <>
              <DialogTrigger asChild>
                <Button>Trigger</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Header</DialogTitle>
                  <DialogDescription>
                    This is a dialog description
                  </DialogDescription>
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
                  <Button fullWidth size="xl" onClick={confirm}>
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </>
          )}
        </DialogReview>
        <DialogConfirm
          chainId={1}
          status="pending"
          testId="incentivize-confirmation-modal"
          successMessage={'Successfully incentivized V3 pool'}
          txHash="0x58c018d0f15df78c392e0850f5ee5e74e1e919213552646d979c9a37e6f5119a"
        />
      </DialogProvider>
    )
  },
} satisfies Story

export const Success = {
  name: 'Success',
  args: { chainId: 1, status: 'success' },
  render: () => {
    return (
      <DialogProvider>
        <DialogReview>
          {({ confirm }) => (
            <>
              <DialogTrigger asChild>
                <Button>Trigger</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Header</DialogTitle>
                  <DialogDescription>
                    This is a dialog description
                  </DialogDescription>
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
                  <Button fullWidth size="xl" onClick={confirm}>
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </>
          )}
        </DialogReview>
        <DialogConfirm
          chainId={1}
          status="success"
          testId="incentivize-confirmation-modal"
          successMessage={'Successfully incentivized V3 pool'}
          txHash="0x58c018d0f15df78c392e0850f5ee5e74e1e919213552646d979c9a37e6f5119a"
        />
      </DialogProvider>
    )
  },
} satisfies Story

// biome-ignore lint/suspicious/noShadowRestrictedNames: This is a storybook
export const Error = {
  name: 'Error',
  args: { chainId: 1, status: 'error' },
  render: () => {
    return (
      <DialogProvider>
        <DialogReview>
          {({ confirm }) => (
            <>
              <DialogTrigger asChild>
                <Button>Trigger</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Header</DialogTitle>
                  <DialogDescription>
                    This is a dialog description
                  </DialogDescription>
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
                  <Button fullWidth size="xl" onClick={confirm}>
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </>
          )}
        </DialogReview>
        <DialogConfirm
          chainId={1}
          status="error"
          testId="incentivize-confirmation-modal"
          successMessage={'Successfully incentivized V3 pool'}
          txHash="0x58c018d0f15df78c392e0850f5ee5e74e1e919213552646d979c9a37e6f5119a"
        />
      </DialogProvider>
    )
  },
} satisfies Story
