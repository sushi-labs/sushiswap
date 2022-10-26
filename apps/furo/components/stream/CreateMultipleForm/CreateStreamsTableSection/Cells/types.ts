import { ChainId } from '@sushiswap/chain'

import { CreateStreamBaseSchemaType } from '../../../CreateForm'

export interface CellProps {
  row: CreateStreamBaseSchemaType
  index: number
  chainId?: ChainId
}
