import type { FC } from 'react'

import { Custody } from './section1/custody'
import { Move } from './section2/move'

export const Story: FC = () => {
  return (
    <>
      <Custody />
      <Move />
      {/*<Guard />*/}
    </>
  )
}
