'use client'
import {
  type FC,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

interface State {
  mutate: {
    setIsDetailsCollapsed(isCollapsed: boolean): void
    setWasDetailsTouched(wasTouched: boolean): void
    resetDetailsTrackedState(): void
  }
  state: {
    isDetailsCollapsed: boolean
    wasDetailsTouched: boolean
  }
}

const DetailsInteractionTrackerContext = createContext<State>({} as State)

interface DetailsInteractionTrackerProviderProps {
  children: ReactNode
}

const DetailsInteractionTrackerProvider: FC<
  DetailsInteractionTrackerProviderProps
> = ({ children }) => {
  const [isDetailsCollapsed, setIsDetailsCollapsed] = useState(true)
  const [wasDetailsTouched, setWasDetailsTouched] = useState(false)

  const resetDetailsTrackedState = useCallback(() => {
    setIsDetailsCollapsed(true)
    setWasDetailsTouched(false)
  }, [])

  return (
    <DetailsInteractionTrackerContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setIsDetailsCollapsed,
            setWasDetailsTouched,
            resetDetailsTrackedState,
          },
          state: {
            isDetailsCollapsed,
            wasDetailsTouched,
          },
        }
      }, [isDetailsCollapsed, wasDetailsTouched, resetDetailsTrackedState])}
    >
      {children}
    </DetailsInteractionTrackerContext.Provider>
  )
}

const useDetailsInteractionTracker = () => {
  const context = useContext(DetailsInteractionTrackerContext)
  if (!context) {
    throw new Error(
      'useDetailsInteractionTracker must be used within a DetailsInteractionTrackerProvider',
    )
  }
  return context
}

export { DetailsInteractionTrackerProvider, useDetailsInteractionTracker }
