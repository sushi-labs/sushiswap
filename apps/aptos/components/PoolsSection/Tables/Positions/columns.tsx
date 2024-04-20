import { SkeletonText } from '@sushiswap/ui'
import { ColumnDef } from '@tanstack/react-table'
import { Pool } from 'utils/hooks/usePools'
// import { PoolMyPositionAprCell } from './PoolPositionAPRCell'
import { PoolMyPositionTVLCell } from './PoolPositionTVLCell'

export const MYPOSITION_TVL_COLUMN: ColumnDef<Pool, unknown> = {
  id: 'Size',
  header: 'Size',
  cell: (props) => <PoolMyPositionTVLCell row={props.row.original} />,
  meta: {
    skeleton: (
      <div className="flex items-center w-full gap-2">
        <div className="flex flex-col w-full">
          <SkeletonText fontSize="lg" />
        </div>
      </div>
    ),
  },
}

// export const MYPOSITION_APR_COLUMN: ColumnDef<Pool, unknown> = {
//   id: 'APR',
//   header: 'APR',
//   cell: (props) => <PoolMyPositionAprCell row={props.row.original} />,
//   meta: {
//     skeleton: (
//       <div className="flex items-center w-full gap-2">
//         <div className="flex flex-col w-full">
//           <SkeletonText fontSize="lg" />
//         </div>
//       </div>
//     ),
//   },
// }
