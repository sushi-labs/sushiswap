import type { Meta, StoryObj } from '@storybook/react'
import { CloudinaryImage } from '@sushiswap/ui'

const meta = {
  title: 'Primitives/CloudinaryImage',
  component: CloudinaryImage,
} satisfies Meta<typeof CloudinaryImage>

export default meta
type Story = StoryObj<typeof meta>

export const Default = {
  args: {
    src: '/storybook-image.svg',
    alt: 'Sushi image placeholder',
    width: 320,
    height: 180,
    unoptimized: true,
  },
} satisfies Story
