import { FC } from 'react'

import { External, ExternalLinkProps } from './External'
import { Internal, InternalLinkProps } from './Internal'

export type LinkProps = {
  External: FC<ExternalLinkProps>
  Internal: FC<InternalLinkProps>
}

export const Link: LinkProps = { External, Internal }
