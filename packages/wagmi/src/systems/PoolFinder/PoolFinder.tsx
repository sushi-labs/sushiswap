import { Children, cloneElement, FC, isValidElement, ReactElement, ReactNode, useMemo, useReducer } from 'react'

import { SushiSwapV2PoolState } from '../../hooks'
import { ComponentsWrapper } from './ComponentsWrapper'
import { SushiSwapV2Pool } from './SushiSwapV2Pool'
import { TridentConstantPool } from './TridentConstantPool'
import { TridentStablePool } from './TridentStablePool'
import {
  ComponentsWrapperProps,
  PoolExistenceStateAction,
  PoolStateUnion,
  SushiSwapV2PoolFinderProps,
  TridentPoolFinderProps,
} from './types'

interface Props {
  components: ReactElement<ComponentsWrapperProps<SushiSwapV2PoolFinderProps | TridentPoolFinderProps>>
  children({ pool }: { pool: PoolStateUnion }): ReactNode
}

export interface PoolFinderState {
  pool: PoolStateUnion
}

const reducer = (state: PoolFinderState, action: PoolExistenceStateAction) => {
  switch (action.type) {
    case 'update': {
      return {
        pool: action.payload.state,
      }
    }
  }
}

const Controller: FC<Props> = ({ components, children }) => {
  const [state, dispatch] = useReducer(reducer, {
    pool: [SushiSwapV2PoolState.LOADING, null],
  })

  const childrenComponents = useMemo(() => {
    return cloneElement(
      components,
      components.props,
      Children.map(components.props.children, (component, index) => {
        if (isValidElement(component) && component.props.enabled) {
          return cloneElement(component, {
            dispatch,
            index,
          })
        }
      })
    )
  }, [components])

  return (
    <>
      {children(state)}
      {childrenComponents}
    </>
  )
}

export const PoolFinder: typeof Controller & {
  Components: typeof ComponentsWrapper
  SushiSwapV2Pool: typeof SushiSwapV2Pool
  TridentConstantPool: typeof TridentConstantPool
  TridentStablePool: typeof TridentStablePool
} = Object.assign(Controller, {
  Components: ComponentsWrapper,
  SushiSwapV2Pool,
  TridentConstantPool,
  TridentStablePool,
})
