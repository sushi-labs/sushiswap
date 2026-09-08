import type { Meta, StoryObj } from '@storybook/react'
import { Button, SwappedButton, SwappedProvider } from '@sushiswap/ui'
import { expect, userEvent, within } from 'storybook/test'
const meta = {
  title: 'Primitives/SwappedButton',
  component: SwappedButton,
} satisfies Meta<typeof SwappedButton>

export default meta
type Story = StoryObj<typeof SwappedButton>

async function unusedSignature(): Promise<string> {
  throw new Error('Wallet signing is unavailable in Storybook')
}
export const Disconnected = {
  render: () => (
    <SwappedProvider signSwappedData={unusedSignature}>
      <SwappedButton>
        <Button>Buy crypto</Button>
      </SwappedButton>
    </SwappedProvider>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Buy crypto' }),
    )
    await expect(
      await within(canvasElement.ownerDocument.body).findByText(
        'Connect Wallet in App',
      ),
    ).toBeVisible()
  },
} satisfies Story
