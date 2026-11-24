'use client'

import {
  Fragment,
  type ReactElement,
  type ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

export function PoolFormSession({
  children,
}: { children: ReactNode }): ReactElement {
  const [visit, setVisit] = useState(0)
  const hasVisited = useRef(false)

  useLayoutEffect(() => {
    // Next reconnects layout effects when it reveals a cached page.
    // Remount with this visit's URL defaults before the form is painted.
    if (hasVisited.current) setVisit((previous) => previous + 1)
    hasVisited.current = true
  }, [])

  return <Fragment key={visit}>{children}</Fragment>
}
