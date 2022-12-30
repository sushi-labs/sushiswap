import { Stream, Vesting } from '../../lib'
import { FuroTableType } from './StreamTable'

export interface CellProps {
  row: Stream | Vesting
  tableType?: FuroTableType
}
