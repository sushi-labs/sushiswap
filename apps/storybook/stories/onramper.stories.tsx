import type { Meta, StoryObj } from '@storybook/react'
import { Button, OnramperButton, OnramperProvider } from '@sushiswap/ui'
import { expect, userEvent, within } from 'storybook/test'
const meta = {
  title: 'Primitives/OnramperButton',
  component: OnramperButton,
} satisfies Meta<typeof OnramperButton>

export default meta
type Story = StoryObj<typeof OnramperButton>

async function unavailableOnramp(): Promise<string> {
  throw new Error('Storybook fixture: provider unavailable')
}
export const Unavailable = {
  render: () => (
    <OnramperProvider createOnramperUrl={unavailableOnramp}>
      <OnramperButton>
        <Button>Buy crypto</Button>
      </OnramperButton>
    </OnramperProvider>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Buy crypto' }),
    )
    await expect(
      await within(document.body).findByRole('alert'),
    ).toHaveTextContent('Onramper could not be loaded')
  },
} satisfies Story
