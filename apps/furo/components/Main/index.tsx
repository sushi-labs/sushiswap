import React, { FC } from 'react'

type Props = {
  children?: React.ReactNode | React.ReactNode[]
}

const Main: FC<Props> = ({ children }) => (
  <main className="flex flex-col items-center justify-start flex-grow w-full h-full" style={{ height: 'max-content' }}>
    {children}
  </main>
)

export default Main
