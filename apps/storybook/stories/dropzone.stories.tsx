import type { Meta, StoryObj } from '@storybook/react'
import { Dropzone } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/Dropzone',
  component: Dropzone,
} satisfies Meta<typeof Dropzone>

export default meta
type Story = StoryObj<typeof meta>

export const Default = {
  args: { accept: { 'text/csv': ['.csv'] }, multiple: false },
} satisfies Story
export const Disabled = {
  args: { ...Default.args, disabled: true, label: 'Uploads are unavailable' },
} satisfies Story
