import { fireEvent, render, screen } from '@testing-library/react'

import { CreateForm } from '../components/stream'
import React from 'react'

const setup = () => render(<CreateForm chainId={1} />)

describe('CreateForm', () => {
  let startDateInput
  let endDateInput
  let recipientInput

  beforeEach(() => {
    startDateInput = screen.getByRole('textbox', { name: /dates.startDate/i })
    endDateInput = screen.getByRole('textbox', { name: /dates.endDate/i })
    recipientInput = screen.getByRole('textbox', { name: /dates.recipient/i })
  })

  it('should display an alert if start date is too soon', async () => {
    setup()

    fireEvent.input(startDateInput, {
      target: {
        value: new Date().toISOString().slice(0, 16),
      },
    })

    fireEvent.blur(startDateInput)
    expect(await screen.findAllByRole('alert')).toHaveLength(1)
    expect(screen.getByRole('execute')).toHaveProperty('disabled', true)
  })

  it('should display an alert if end date is earlier than start date', async () => {
    setup()

    const today = new Date()
    const tomorrow = new Date(today)
    const twoDays = new Date(today)

    tomorrow.setDate(tomorrow.getDate() + 1)
    twoDays.setDate(tomorrow.getDate() + 2)

    fireEvent.input(startDateInput, {
      target: {
        value: twoDays.toISOString().slice(0, 16),
      },
    })
    fireEvent.blur(startDateInput)

    fireEvent.input(endDateInput, {
      target: {
        value: tomorrow.toISOString().slice(0, 16),
      },
    })
    fireEvent.blur(endDateInput)

    expect(await screen.findAllByRole('alert')).toHaveLength(1)
    expect(screen.getByRole('execute')).toHaveProperty('disabled', true)
  })

  it('should not display an alert if start date and end date are valid', async () => {
    setup()

    const today = new Date()
    const tomorrow = new Date(today)
    const twoDays = new Date(today)

    tomorrow.setDate(tomorrow.getDate() + 1)
    twoDays.setDate(tomorrow.getDate() + 2)

    fireEvent.input(startDateInput, {
      target: {
        value: tomorrow.toISOString().slice(0, 16),
      },
    })
    fireEvent.blur(startDateInput)

    fireEvent.input(endDateInput, {
      target: {
        value: twoDays.toISOString().slice(0, 16),
      },
    })
    fireEvent.blur(endDateInput)

    expect(await screen.findAllByRole('alert')).toHaveLength(0)
  })

  it('should display an alert if recipient is invalid', async () => {
    setup()

    fireEvent.input(recipientInput, {
      target: {
        value: 'blabla',
      },
    })

    fireEvent.blur(recipientInput)

    expect(await screen.findAllByRole('alert')).toHaveLength(1)
    expect(screen.getByRole('execute')).toHaveProperty('disabled', true)
  })

  it('should not display an alert if recipient is valid', async () => {
    setup()

    const recipientInput = screen.getByRole('textbox', {
      name: /dates.recipient/i,
    })
    fireEvent.input(recipientInput, {
      target: {
        value: '0x4ab2fc6e258a0ca7175d05ff10c5cf798a672cae',
      },
    })

    fireEvent.blur(recipientInput)

    expect(await screen.findAllByRole('alert')).toHaveLength(0)
    expect(screen.getByRole('execute')).toHaveProperty('disabled', true)
  })
})
