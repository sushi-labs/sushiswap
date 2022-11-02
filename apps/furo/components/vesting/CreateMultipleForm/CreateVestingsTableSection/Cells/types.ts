import { ChainId } from '@sushiswap/chain'

import { CreateVestingFormSchemaType } from '../../../CreateForm'

export interface CellProps {
  row: CreateVestingFormSchemaType
  index: number
  chainId?: ChainId
}
