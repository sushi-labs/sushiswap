import { SkeletonText } from '@sushiswap/ui'
import type { ColumnDef } from '@tanstack/react-table'
import type { IPositionRowData } from '~stellar/_common/ui/Pools/PositionsTable/PositionsTable'
import { LegacyPositionCollectableCell } from './LegacyPositionCollectable'
import { LegacyPositionMigrateCell } from './LegacyPositionMigrateCell'
import { LegacyPositionPrincipalCell } from './LegacyPositionPrincipalCell'

export {
  POSITION_NAME_COLUMN,
  PRICE_RANGE_COLUMN,
  VALUE_COLUMN,
  SIZE_COLUMN,
  APR_COLUMN,
} from '~stellar/_common/ui/Pools/PositionsTable/PositionColumns'

export const PRINCIPAL_COLUMN: ColumnDef<IPositionRowData, unknown> = {
  id: 'principal',
  header: 'Principal',
  cell: (props) => <LegacyPositionPrincipalCell data={props.row.original} />,
  meta: {
    body: {
      skeleton: (
        <div className="flex items-center w-full gap-2">
          <div className="flex flex-col w-full">
            <SkeletonText fontSize="lg" />
          </div>
        </div>
      ),
    },
  },
}

export const COLLECTABLE_COLUMN: ColumnDef<IPositionRowData, unknown> = {
  id: 'collectable',
  header: 'Collectable',
  cell: (props) => <LegacyPositionCollectableCell data={props.row.original} />,
  meta: {
    body: {
      skeleton: (
        <div className="flex items-center w-full gap-2">
          <div className="flex flex-col w-full">
            <SkeletonText fontSize="lg" />
          </div>
        </div>
      ),
    },
  },
}

export const MIGRATE_COLUMN: ColumnDef<IPositionRowData, unknown> = {
  id: 'migrate',
  header: 'Migrate',
  cell: (props) => <LegacyPositionMigrateCell data={props.row.original} />,
  meta: {
    body: {
      skeleton: (
        <div className="flex items-center w-full gap-2">
          <div className="flex flex-col w-full">
            <SkeletonText fontSize="lg" />
          </div>
        </div>
      ),
    },
  },
}
