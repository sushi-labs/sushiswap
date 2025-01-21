import { FC, ReactElement } from 'react'

export interface StepDetails {
  // Left-justified icon representing the step and grayed out when step is not active
  icon: ReactElement
  // Ripple animation around the icon of the currently active step (use color extraction to select)
  rippleColor?: string
  // Text shown before the step becomes active
  previewTitle: string
  // Text shown when the step is active and awaiting user input
  actionRequiredTitle: string | ReactElement
  // Text shown when user input has been accepted and step has yet to complete
  inProgressTitle?: string
  // Amount of time in seconds the user has to take action on a step (e.g. UniswapX exclusivity window)
  timeToStart?: number
  // Text shown when timeToStart is exceeded (countdown reaches zero)
  delayedStartTitle?: string
  // Estimated amount of time in seconds for a pending step to complete (i.e. transaction confirmation time)
  timeToEnd?: number | null
  // Text shown when timeToEnd is exceeded (countdown reaches zero)
  delayedEndTitle?: string
  // Anchor text displayed for the Learn-More link
  learnMoreLinkText?: string
  // URL for Learn-More link (opened in new tab)
  learnMoreLinkHref?: string
}

export enum StepStatus {
  PREVIEW = 'review',
  ACTIVE = 'active',
  IN_PROGRESS = 'in-progress',
  COMPLETE = 'complete',
}

interface ProgressStepProps {
  stepStatus: StepStatus
  stepDetails: StepDetails
}

export const ProgressStep: FC<ProgressStepProps> = ({
  stepDetails,
  stepStatus,
}) => {
  return (
    <div className="flex justify-between gap-2">
      <div className="flex items-center gap-3">
        <div
          className={
            stepStatus === StepStatus.IN_PROGRESS
              ? 'opacity-50 mix-blend-luminosity'
              : ''
          }
        >
          {stepDetails.icon}
        </div>
        <span
          className={
            stepStatus === StepStatus.IN_PROGRESS ? 'text-muted-foreground' : ''
          }
        >
          {stepStatus === StepStatus.PREVIEW
            ? stepDetails.previewTitle
            : stepStatus === StepStatus.ACTIVE
              ? // ? isTimeRemaining
                stepDetails.actionRequiredTitle
              : // : stepDetails.delayedStartTitle
                stepStatus === StepStatus.IN_PROGRESS
                ? // ? isTimeRemaining
                  stepDetails.inProgressTitle
                : // : stepDetails.delayedEndTitle
                  stepStatus === StepStatus.COMPLETE
                  ? stepDetails.previewTitle
                  : null}
        </span>
      </div>
      {}
    </div>
  )
}
