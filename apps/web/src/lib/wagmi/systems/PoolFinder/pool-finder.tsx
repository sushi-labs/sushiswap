import {
  Children,
  type FC,
  type ReactElement,
  type ReactNode,
  cloneElement,
  isValidElement,
  useMemo,
  useReducer,
} from 'react'

import { SushiSwapV2PoolState } from '../../hooks/pools/hooks/useSushiSwapV2Pools'
import { ComponentsWrapper } from './components-wrapper'
import { SushiSwapV2Pool } from './sushi-swap-v2-pool'
import type {
  ComponentsWrapperProps,
  PoolExistenceStateAction,
  PoolStateUnion,
  SushiSwapV2PoolFinderProps,
} from './types'

interface Props {
  components: ReactElement<ComponentsWrapperProps<SushiSwapV2PoolFinderProps>>
  children({ pool }: { pool: PoolStateUnion }): ReactNode
}

interface PoolFinderState {
  pool: PoolStateUnion
}

const reducer = (_state: PoolFinderState, action: PoolExistenceStateAction) => {
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
      }),
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
} = Object.assign(Controller, {
  Components: ComponentsWrapper,
  SushiSwapV2Pool,
})
