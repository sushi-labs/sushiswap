import { ChainId } from '@sushiswap/chain'

import { CreateStreamFormSchemaType } from '../../../CreateForm'

export interface CellProps {
  row: CreateStreamFormSchemaType
  index: number
  chainId?: ChainId
}
