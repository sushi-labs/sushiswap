import type { Meta, StoryObj } from '@storybook/react'
import { Loader, LoadingOverlay, LogoLoader } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/Loader',
  component: Loader,
} satisfies Meta<typeof Loader>

export default meta
type Story = StoryObj<typeof meta>

export const Default = { args: { size: 32 } } satisfies Story
export const Sizes = {
  render: () => (
    <div className="flex items-center gap-6">
      {[16, 24, 32, 48].map((size) => (
        <Loader key={size} size={size} />
      ))}
    </div>
  ),
} satisfies Story
export const Logo = {
  render: () => <LogoLoader width={48} height={48} />,
} satisfies Story
export const Overlay = {
  render: () => (
    <div className="h-64">
      <LoadingOverlay show />
    </div>
  ),
} satisfies Story
