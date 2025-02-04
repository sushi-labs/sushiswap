import type { FC } from 'react'

import { Custody } from './Section1/Custody'
import { Move } from './Section2/Move'

export const Story: FC = () => {
  return (
    <>
      <Custody />
      <Move />
      {/*<Guard />*/}
    </>
  )
}
