import { TableButton } from '~evm/perps/_ui/_common'
import { useVaultTables } from '../vault-tables-provider'

export const ExpandAll = ({ label }: { label?: string }) => {
  const {
    state: { expandAll },
    mutate: { setExpandAll },
  } = useVaultTables()

  return (
    <TableButton onClick={() => setExpandAll(!expandAll)}>
      {expandAll ? 'Collapse' : 'Expand'} All {label ? label : ''}
    </TableButton>
  )
}
