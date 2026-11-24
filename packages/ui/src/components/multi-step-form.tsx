'use client'

import classNames from 'classnames'
import { ArrowRight, Check } from 'lucide-react'
import { type ReactElement, type ReactNode, useRef, useState } from 'react'
import { Button } from './button'
import { Card } from './card'

export interface MultiStepFormStep {
  id: string
  label: string
  ariaLabel?: string
  content: ReactNode
  canContinue?: boolean
  summary?: ReactNode
  editLabel?: string
}

interface MultiStepFormProps {
  progressLabel: string
  steps: readonly MultiStepFormStep[]
}

export function MultiStepForm({
  progressLabel,
  steps,
}: MultiStepFormProps): ReactElement | null {
  const [activeId, setActiveId] = useState(steps[0]?.id)
  const progressRef = useRef<HTMLOListElement>(null)
  const activeIndex = Math.max(
    0,
    steps.findIndex(({ id }) => id === activeId),
  )
  const firstIncompleteIndex = steps.findIndex(
    (step) => step.canContinue === false,
  )
  const lastReachableIndex =
    firstIncompleteIndex === -1 ? steps.length - 1 : firstIncompleteIndex
  const summaries = steps
    .slice(0, activeIndex)
    .filter((step) => step.summary != null)

  function goToStep(id: string) {
    setActiveId(id)
    progressRef.current?.focus({ preventScroll: true })
    progressRef.current?.scrollIntoView({ block: 'start' })
  }

  if (steps.length === 0) return null

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-8">
      <ol
        ref={progressRef}
        tabIndex={-1}
        aria-label={progressLabel}
        className="grid grid-cols-2 gap-4 rounded-2xl border border-accent p-4 scroll-mt-24 lg:grid-cols-1 lg:gap-6 lg:p-6"
      >
        {steps.map(({ id, label }, index) => (
          <li key={id}>
            <button
              type="button"
              aria-current={index === activeIndex ? 'step' : undefined}
              disabled={index > activeIndex && index > lastReachableIndex}
              className="flex w-full items-start gap-3 rounded-lg text-left disabled:cursor-not-allowed lg:items-center"
              onClick={() => goToStep(id)}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  'mt-1 flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold lg:mt-0',
                  index <= activeIndex
                    ? 'bg-primary text-background'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {index < activeIndex ? <Check size={16} /> : index + 1}
              </span>
              <span>
                <span className="block text-xs text-muted-foreground">
                  Step {index + 1}
                </span>
                <span
                  className={classNames(
                    'text-sm font-medium',
                    index > activeIndex && 'text-muted-foreground',
                  )}
                >
                  {label}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      {steps.map(({ id, label, ariaLabel, content }, index) => {
        const nextStep = steps[index + 1]
        return (
          <section
            key={id}
            hidden={index !== activeIndex}
            aria-label={ariaLabel ?? label}
          >
            <Card className="divide-y divide-accent px-4 sm:px-6">
              {index === activeIndex &&
                summaries.map((completed) => (
                  <div
                    key={completed.id}
                    className="flex items-center gap-3 py-4"
                  >
                    <div className="min-w-0 flex-1">{completed.summary}</div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      aria-label={
                        completed.editLabel ?? `Edit ${completed.label}`
                      }
                      onClick={() => goToStep(completed.id)}
                    >
                      Edit
                    </Button>
                  </div>
                ))}
              {content}
              {nextStep && (
                <div className="py-4">
                  <Button
                    type="button"
                    fullWidth
                    size="lg"
                    icon={ArrowRight}
                    iconPosition="end"
                    disabled={index >= lastReachableIndex}
                    onClick={() => goToStep(nextStep.id)}
                  >
                    Continue
                  </Button>
                </div>
              )}
            </Card>
          </section>
        )
      })}
    </div>
  )
}
