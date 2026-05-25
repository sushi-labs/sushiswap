import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@sushiswap/ui'
import { SortIcon } from '@sushiswap/ui/icons/SortIcon'
import {
  VAULT_FILTER_VALUES,
  type VaultFilterValueString,
  useVaultTables,
} from '../vault-tables-provider'

export const VaultFilter = () => {
  const {
    state: { vaultFilter, activeTab },
    mutate: { handleSetVaultFilter },
  } = useVaultTables()
  const _currentVaultFilter = vaultFilter?.[activeTab]

  return (
    <Select
      onValueChange={(t) => {
        handleSetVaultFilter({
          ...(vaultFilter ?? {}),
          [activeTab]: t as VaultFilterValueString,
        })
      }}
      value={_currentVaultFilter ?? undefined}
    >
      <SelectTrigger
        aria-label="Table Filter Select"
        className="!py-0 !px-2 !text-xs !max-h-[32px] !min-h-[32px] !h-[32px] max-w-fit capitalize cursor-pointer !text-perps-muted-50"
        asChild
      >
        <Button variant="perps-secondary" size="sm">
          <div className="flex items-center gap-1">
            {_currentVaultFilter ? (
              <div className="!text-perps-muted">
                <SelectValue />
              </div>
            ) : null}
            <SortIcon width={16} height={16} />
          </div>
        </Button>
      </SelectTrigger>

      <SelectContent className="!bg-black/10">
        {VAULT_FILTER_VALUES.map((type) => (
          <SelectItem
            key={type}
            value={`${activeTab}:${type}`}
            className="capitalize"
          >
            {type}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
