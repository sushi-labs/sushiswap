import { FC } from 'react'

import External, { ExternalLinkProps } from './External'

export type LinkProps = {
  External: FC<ExternalLinkProps>
}

export const Link: LinkProps = { External }
