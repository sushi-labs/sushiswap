import React from 'react'

type Props = {
  children?: React.ReactNode
  backdrop?: React.ReactNode
}

/**
 * @deprecated
 */
export function Backdrop({ children, backdrop }: Props): JSX.Element {
  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none">{backdrop}</div>
      {children}
    </>
  )
}
