// Form.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormMessage,
  FormSection,
  TextField,
  useForm,
} from '@sushiswap/ui'
import * as React from 'react'

const meta = {
  title: 'Primitives/Form',
  component: FormSection,
  argTypes: {},
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof FormSection>

export default meta
type Story = StoryObj<typeof FormSection>

export const Default = {
  args: {},
  render: () => {
    const methods = useForm()

    return (
      <Form {...methods}>
        <FormSection
          title="General Details"
          description="Furo allows you to create a vested or non vested stream using your wallet or BentoBox balance."
        >
          <FormItem>
            <FormControl>
              <TextField type="text" />
            </FormControl>
            <FormDescription>
              The amount that gets unlocked after the cliff end date.
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormSection>
      </Form>
    )
  },
} satisfies Story
