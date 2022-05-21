import { BentoApproveButton } from 'components/Approve/BentoApproveButton'
import { ComponentsWrapper } from 'components/Approve/ComponentsWrapper'
import { TokenApproveButton } from 'components/Approve/TokenApproveButton'
import { ApprovalState } from 'hooks'
import React, { isValidElement, ReactNode, useCallback, useMemo, useRef } from 'react'
import { FC } from 'react'

interface Props {
  components: React.ReactElement<ComponentsWrapper<any>>
  render({ approved }: { approved: boolean }): ReactNode
}

const Controller: FC<Props> = ({ components, render }) => {
  const refs = useRef<ApprovalState[]>([])

  const handleUpdate = useCallback((value: ApprovalState, index: number) => {
    const state = [...refs.current]
    state[index] = value
    refs.current = state
  }, [])

  const children = useMemo(() => {
    return React.cloneElement(
      components,
      components.props,
      React.Children.map(components.props.children, (component, index) => {
        if (isValidElement<TokenApproveButton | BentoApproveButton>(component)) {
          return React.cloneElement(component, {
            setState: (value: ApprovalState) => handleUpdate(value, index),
          })
        }
      }),
    )
  }, [components, handleUpdate])

  return (
    <>
      {children}
      {render({ approved: refs.current.every((el) => el === ApprovalState.APPROVED || el === ApprovalState.PENDING) })}
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
