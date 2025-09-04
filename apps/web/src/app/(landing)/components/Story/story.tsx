import type { FC } from 'react'

import { Custody } from './Section1/custody'
import { Move } from './Section2/move'

export const Story: FC = () => {
  return (
    <>
      <Custody />
      <Move />
      {/*<Guard />*/}
    </>
  )
}
