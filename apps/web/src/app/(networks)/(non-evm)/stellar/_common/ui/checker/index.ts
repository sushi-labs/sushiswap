import type { FC } from 'react'

import { Trustline, type TrustlineProps } from './trustline'

type CheckerProps = {
  Trustline: FC<TrustlineProps>
}

export const Checker: CheckerProps = {
  Trustline,
}
