import { useIsMounted } from '@sushiswap/hooks'
import { classNames } from '@sushiswap/ui'
import React, { Children, cloneElement, FC, isValidElement, ReactElement, ReactNode, useMemo, useReducer } from 'react'

import { ApprovalState } from '../../hooks'
import { BentoApproveButton } from './BentoApproveButton'
import { ComponentsWrapper } from './ComponentsWrapper'
import { TokenApproveButton } from './TokenApproveButton'
import { ApproveButton } from './types'
import { PromiseNotification } from '@sushiswap/dexie'

interface Props {
  className?: string
  components: ReactElement<ApproveButton<'button'>>
  render({ isUnknown, approved }: { approved: boolean | undefined; isUnknown: boolean | undefined }): ReactNode
}

export interface State {
  approvals: ([ApprovalState, ReactElement | undefined, boolean] | undefined)[]
  length: number
  isUnknown: boolean
  isApproved: boolean
  isPending: boolean
}

export type ApprovalAction =
  | {
      type: 'update'
      payload: {
        state: [ApprovalState, ReactElement | undefined, boolean]
        index: number
      }
    }
  | { type: 'remove'; payload: { index: number } }

const reducer = (state: State, action: ApprovalAction) => {
  switch (action.type) {
    case 'update': {
      const approvals = [...state.approvals]
      approvals[action.payload.index] = action.payload.state
      const isUnknown = approvals.some((el) => el?.[0] === ApprovalState.UNKNOWN)
      const isPending = approvals.some((el) => el?.[0] === ApprovalState.PENDING)
      const isApproved = approvals.every(
        (el) => el?.[0] === ApprovalState.APPROVED || (el?.[0] === ApprovalState.PENDING && el?.[2])
      )
      return { ...state, approvals, isUnknown, isApproved, isPending }
    }
    case 'remove': {
      const approvals = [...state.approvals]
      approvals.splice(action.payload.index, 1)
      const isUnknown = approvals.some((el) => el?.[0] === ApprovalState.UNKNOWN)
      const isPending = approvals.some((el) => el?.[0] === ApprovalState.PENDING)
      const isApproved = approvals.every(
        (el) => el?.[0] === ApprovalState.APPROVED || (el?.[0] === ApprovalState.PENDING && el?.[2])
      )
      return { ...state, approvals, isUnknown, isApproved, isPending }
    }
  }
}

const Controller: FC<Props> = ({ className, components, render }) => {
  const isMounted = useIsMounted()
  const [state, dispatch] = useReducer(reducer, {
    approvals: [],
    length: Children.count(components.props.children),
    isApproved: false,
    isUnknown: true,
    isPending: false,
  })

  const initialized =
    state.approvals.length === Children.toArray(components.props.children).length &&
    !state.approvals.some((el) => el?.[0] === ApprovalState.UNKNOWN)

  const children = useMemo(() => {
    return cloneElement(
      components,
      components.props,
      Children.map(components.props.children, (component, index) => {
        const valid = isValidElement<TokenApproveButton | BentoApproveButton>(component)
        if (valid) {
          return cloneElement(component, {
            dispatch,
            index,
            allApproved: state.isApproved,
            initialized,
          })
        }

        return null
      })
    )
  }, [components, initialized, state.isApproved])

  const button = useMemo(() => {
    const index = state.approvals.findIndex((el) => el?.[0] === ApprovalState.NOT_APPROVED)
    if (state.approvals && index !== undefined && index >= 0 && state.approvals[index]) {
      return state.approvals[index]?.[1]
    }

    return render({
      approved: state.isApproved && initialized,
      isUnknown: state.isUnknown && initialized,
    })
  }, [initialized, render, state.approvals, state.isApproved, state.isUnknown])

  // Only render renderProp since we can't get approval states on the server anyway
  if (!isMounted) return <>{render({ approved: state.isApproved, isUnknown: true })}</>

  return (
    <div className={classNames(className, 'flex flex-col justify-center items-center w-full')}>
      {children}
      {button}
    </div>
  )
}

/**
 * @deprecated use future/systems/Checker
 */
export const Approve: typeof Controller & {
  Components: typeof ComponentsWrapper
  Bentobox: typeof BentoApproveButton
  Token: typeof TokenApproveButton
} = Object.assign(Controller, {
  Components: ComponentsWrapper,
  Bentobox: BentoApproveButton,
  Token: TokenApproveButton,
})
