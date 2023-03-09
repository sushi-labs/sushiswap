import { FC } from 'react'

import { ApproveBentoboxFn, Bentobox } from './Bentobox'
import { Root, RootProps } from './Root'
import { ApproveTokenFn, Token } from './Token'

export const Approve2: {
  Root: FC<RootProps>
  Bentobox: ApproveBentoboxFn
  Token: ApproveTokenFn
} = {
  Root,
  Bentobox,
  Token,
}
