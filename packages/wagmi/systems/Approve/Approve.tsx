import { useIsMounted } from '@sushiswap/hooks'
import React, {
  Children,
  cloneElement,
  FC,
  isValidElement,
  ReactElement,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react'

import { ApprovalState } from '../../hooks'
import { BentoApproveButton } from './BentoApproveButton'
import { ComponentsWrapper } from './ComponentsWrapper'
import { TokenApproveButton } from './TokenApproveButton'
import { ApproveButton } from './types'

interface Props {
  components: ReactElement<ApproveButton<'button'>>
  render({ approved, isUnknown }: { approved: boolean; isUnknown: boolean }): ReactNode
}

const Controller: FC<Props> = ({ components, render }) => {
  const [state, setState] = useState<ApprovalState[]>([])
  const isMounted = useIsMounted()

  const handleUpdate = useCallback((value: ApprovalState, index: number) => {
    setState((state) => {
      const newState = [...state]
      if (value === undefined) {
        newState.splice(index, 1)
      } else {
        newState[index] = value
      }
      return newState
    })
  }, [])

  const children = useMemo(() => {
    return cloneElement(
      components,
      components.props,
      Children.map(components.props.children, (component, index) => {
        if (isValidElement<TokenApproveButton | BentoApproveButton>(component)) {
          return cloneElement(component, {
            setState: (value: ApprovalState) => handleUpdate(value, index),
          })
        }
      })
    )
  }, [components, handleUpdate])

  const isUnknown =
    state.some((el) => el === ApprovalState.UNKNOWN) && Children.count(components.props.children) === state.length
  const approved =
    state.every((el) => el === ApprovalState.APPROVED || el === ApprovalState.PENDING) &&
    Children.count(components.props.children) === state.length

  // Only render renderProp since we can't get approval states on the server anyway
  if (!isMounted)
    return (
      <>
        {render({
          isUnknown: true,
          approved: false,
        })}
      </>
    )

  return (
    <>
      {children}
      {render({
        isUnknown,
        approved,
      })}
    </>
  )
}

export const Approve: typeof Controller & {
  Components: typeof ComponentsWrapper
  Bentobox: typeof BentoApproveButton
  Token: typeof TokenApproveButton
} = Object.assign(Controller, {
  Components: ComponentsWrapper,
  Bentobox: BentoApproveButton,
  Token: TokenApproveButton,
})
