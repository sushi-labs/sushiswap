import { Children, cloneElement, FC, isValidElement, ReactElement, ReactNode, useMemo, useReducer } from 'react'

import { PairState } from '../../hooks'
import { ComponentsWrapper } from './ComponentsWrapper'
import { ConstantProductPool } from './ConstantProductPool'
import { LegacyPool } from './LegacyPool'
import { StablePool } from './StablePool'
import {
  ComponentsWrapperProps,
  LegacyPoolFinderProps,
  PoolExistenceStateAction,
  PoolStateUnion,
  TridentPoolFinderProps,
} from './types'

interface Props {
  components: ReactElement<ComponentsWrapperProps<LegacyPoolFinderProps | TridentPoolFinderProps>>
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
    pool: [PairState.LOADING, null],
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
  LegacyPool: typeof LegacyPool
  ConstantProductPool: typeof ConstantProductPool
  StablePool: typeof StablePool
} = Object.assign(Controller, {
  Components: ComponentsWrapper,
  LegacyPool,
  ConstantProductPool,
  StablePool,
})
