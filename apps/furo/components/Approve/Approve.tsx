import { BentoApproveButton } from 'components/Approve/BentoApproveButton'
import { TokenApproveButton } from 'components/Approve/TokenApproveButton'
import { ApprovalState } from 'hooks'
import React, { isValidElement, ReactNode, useCallback, useMemo, useState } from 'react'
import { FC } from 'react'

interface Props {
  components: ReactNode[]
  render({ approved }: { approved: boolean }): ReactNode
}

const Controller: FC<Props> = ({ components, render }) => {
  const [state, setState] = useState<ApprovalState[]>(Array(components.length))
  const handleUpdate = useCallback((value: ApprovalState, index: number) => {
    setState((prevState) => {
      const state = [...prevState]
      state[index] = value
      return state
    })
  }, [])

  const children = useMemo(() => {
    return components.map((component, index) => {
      if (isValidElement(component)) {
        return React.cloneElement(component, { setState: (value: ApprovalState) => handleUpdate(value, index) })
      }
    })
  }, [components, handleUpdate])

  return (
    <>
      {children}
      {render({ approved: state.every((el) => el === ApprovalState.APPROVED || el === ApprovalState.PENDING) })}
    </>
  )
}

export const Approve: typeof Controller & {
  Bentobox: typeof BentoApproveButton
  Token: typeof TokenApproveButton
} = Object.assign(Controller, {
  Bentobox: BentoApproveButton,
  Token: TokenApproveButton,
})
