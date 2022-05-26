import React, {
  Children,
  cloneElement,
  FC,
  isValidElement,
  ReactElement,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
} from 'react'

import { ApprovalState } from '../../hooks/useApproveCallback'
import { BentoApproveButton } from './BentoApproveButton'
import { ComponentsWrapper } from './ComponentsWrapper'
import { TokenApproveButton } from './TokenApproveButton'

interface Props {
  components: ReactElement<ComponentsWrapper<any>>
  render({ approved, isUnknown }: { approved: boolean; isUnknown: boolean }): ReactNode
}

const Controller: FC<Props> = ({ components, render }) => {
  const refs = useRef<ApprovalState[]>([])

  const handleUpdate = useCallback((value: ApprovalState, index: number) => {
    const state = [...refs.current]
    state[index] = value
    refs.current = state
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

  const isUnknown = refs.current.some((el) => el === ApprovalState.UNKNOWN)
  const approved = refs.current.every((el) => el === ApprovalState.APPROVED || el === ApprovalState.PENDING)

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
