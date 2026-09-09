import type { Meta, StoryObj } from '@storybook/react'
import { Carousel } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/Carousel',
  component: Carousel,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Carousel>

export default meta
type Story = StoryObj<typeof meta>

export const Default = {
  args: {
    slides: ['Ethereum', 'Arbitrum', 'Base', 'Polygon'],
    slideWidth: 280,
    containerWidth: 1280,
    render: (slide) => (
      <div className="w-64 rounded-xl border border-accent bg-secondary p-8">
        {String(slide)}
      </div>
    ),
  },
} satisfies Story
export const SingleSlide = {
  args: { ...Default.args, slides: ['Ethereum'] },
} satisfies Story
