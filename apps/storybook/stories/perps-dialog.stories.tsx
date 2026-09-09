import type { Meta, StoryObj } from '@storybook/react'
import {
  Button,
  PerpsDialog,
  PerpsDialogClose,
  PerpsDialogContent,
  PerpsDialogDescription,
  PerpsDialogHeader,
  PerpsDialogTitle,
} from '@sushiswap/ui'

const meta = {
  title: 'Primitives/PerpsDialog',
  component: PerpsDialog,
} satisfies Meta<typeof PerpsDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default = {
  render: () => (
    <PerpsDialog defaultOpen>
      <PerpsDialogContent>
        <PerpsDialogHeader>
          <PerpsDialogTitle>Close position</PerpsDialogTitle>
          <PerpsDialogDescription>
            Review the position before continuing.
          </PerpsDialogDescription>
        </PerpsDialogHeader>
        <div className="p-6">ETH / USD · Long · 2×</div>
        <div className="p-6">
          <PerpsDialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </PerpsDialogClose>
        </div>
      </PerpsDialogContent>
    </PerpsDialog>
  ),
} satisfies Story
