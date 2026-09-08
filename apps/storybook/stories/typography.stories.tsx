import type { Meta, StoryObj } from '@storybook/react'
import { typographyVariants } from '@sushiswap/ui'

const meta = { title: 'Primitives/Typography' } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const Scale = {
  render: () => (
    <div className="max-w-2xl space-y-6">
      <h1 className={typographyVariants({ variant: 'h1' })}>Heading one</h1>
      <h2 className={typographyVariants({ variant: 'h2' })}>Heading two</h2>
      <h3 className={typographyVariants({ variant: 'h3' })}>Heading three</h3>
      <h4 className={typographyVariants({ variant: 'h4' })}>Heading four</h4>
      <p className={typographyVariants({ variant: 'lead' })}>
        Trade, earn, and provide liquidity.
      </p>
      <p className={typographyVariants({ variant: 'p' })}>
        Body text explains the details of your position.
      </p>
      <blockquote className={typographyVariants({ variant: 'blockquote' })}>
        Liquidity makes markets possible.
      </blockquote>
      <div className={typographyVariants({ variant: 'large' })}>Large text</div>
      <div className={typographyVariants({ variant: 'small' })}>Small text</div>
      <div className={typographyVariants({ variant: 'muted' })}>
        Muted supporting text
      </div>
    </div>
  ),
} satisfies Story
