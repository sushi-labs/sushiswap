import { TableButton } from '../../_common'
import { useTradeTables } from '../trade-tables-provider'

export const ExpandAll = ({ label }: { label?: string }) => {
  const {
    state: { expandAll },
    mutate: { setExpandAll },
  } = useTradeTables()

  return (
    <TableButton onClick={() => setExpandAll(!expandAll)}>
      {expandAll ? 'Collapse' : 'Expand'} All {label ? label : ''}
    </TableButton>
  )
}
