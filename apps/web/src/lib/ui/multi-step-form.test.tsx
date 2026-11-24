/** @vitest-environment jsdom */

import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MultiStepForm } from '../../../../../packages/ui/src/components/multi-step-form'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

describe('MultiStepForm', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  function render(poolReady: boolean, rewardsReady: boolean) {
    act(() =>
      root.render(
        <MultiStepForm
          progressLabel="Setup progress"
          steps={[
            {
              id: 'pool',
              label: 'Pool',
              content: 'Select pool',
              canContinue: poolReady,
              summary: 'ETH / USDC',
              editLabel: 'Edit pool setup',
            },
            {
              id: 'rewards',
              label: 'Rewards',
              content: <input aria-label="Reward amount" />,
              canContinue: rewardsReady,
            },
            { id: 'review', label: 'Review', content: 'Review rewards' },
          ]}
        />,
      ),
    )
    const progress = container.querySelector('ol')!
    progress.scrollIntoView = vi.fn()
    return progress
  }

  function visibleStep(): HTMLElement {
    return container.querySelector('section:not([hidden])')!
  }

  it('gates forward navigation on every preceding step', () => {
    const progress = render(false, true)
    const [pool, rewards, review] = progress.querySelectorAll('button')
    const firstContinue = visibleStep().querySelector('button')!

    expect(firstContinue.disabled).toBe(true)
    expect(rewards.disabled).toBe(true)
    expect(review.disabled).toBe(true)
    act(() => review.click())
    expect(pool.getAttribute('aria-current')).toBe('step')

    render(true, false)
    expect(firstContinue.disabled).toBe(false)
    expect(rewards.disabled).toBe(false)
    expect(review.disabled).toBe(true)
    act(() => firstContinue.click())
    const secondContinue = [...visibleStep().querySelectorAll('button')].find(
      (button) => button.textContent === 'Continue',
    )!
    expect(secondContinue.disabled).toBe(true)

    render(true, true)
    expect(secondContinue.disabled).toBe(false)
    expect(review.disabled).toBe(false)
    act(() => review.click())
    expect(review.getAttribute('aria-current')).toBe('step')
    expect(visibleStep().getAttribute('aria-label')).toBe('Review')
  })

  it('preserves input and focuses progress when editing and continuing', () => {
    const progress = render(true, true)
    const [pool, rewards] = progress.querySelectorAll('button')
    const next = visibleStep().querySelector('button')!

    act(() => next.click())
    const input = visibleStep().querySelector('input')!
    input.focus()
    input.value = '12.50'
    act(() =>
      visibleStep()
        .querySelector<HTMLButtonElement>('[aria-label="Edit pool setup"]')!
        .click(),
    )

    expect(visibleStep().getAttribute('aria-label')).toBe('Pool')
    expect(pool.getAttribute('aria-current')).toBe('step')
    expect(document.activeElement).toBe(progress)

    next.focus()
    act(() => next.click())
    expect(visibleStep().querySelector('input')?.value).toBe('12.50')
    expect(rewards.getAttribute('aria-current')).toBe('step')
    expect(document.activeElement).toBe(progress)
  })
})
