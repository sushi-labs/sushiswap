import type { FC } from 'react'

import {
  GeoBlockedTokens,
  type GeoBlockedTokensProps,
} from './geo-blocked-tokens'
import { Trustline, type TrustlineProps } from './trustline'

type CheckerProps = {
  Trustline: FC<TrustlineProps>
  GeoBlockedTokens: FC<GeoBlockedTokensProps>
}

export const Checker: CheckerProps = {
  Trustline,
  GeoBlockedTokens,
}
