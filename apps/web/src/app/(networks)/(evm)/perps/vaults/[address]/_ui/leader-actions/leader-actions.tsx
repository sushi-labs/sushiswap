import { ChevronDownIcon } from '@heroicons/react-v1/solid'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  LinkInternal,
  classNames,
} from '@sushiswap/ui'
import { type MouseEvent, useCallback, useState } from 'react'
import { useVaultDetails, useVaultModify } from 'src/lib/perps'
import type { EvmAddress } from 'sushi/evm'
import { PerpsChecker } from '~evm/perps/_ui/perps-checker'
import { CloseVaultDialog } from './close-vault-dialog'
import { DistributeVaultDialog } from './distribute-vault-dialog'

export const LeaderActions = ({
  vaultAddress,
}: { vaultAddress: EvmAddress }) => {
  const { data, refetch } = useVaultDetails({ vaultAddress })
  const [isOpen, setIsOpen] = useState(false)
  const { modifyVaultAsync, isPending } = useVaultModify()
  const [isCloseVaultOpen, setIsCloseVaultOpen] = useState(false)
  const [isDistributeOpen, setIsDistributeOpen] = useState(false)

  const handleToggleDeposits = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      if (!vaultAddress) return
      e.preventDefault()
      await modifyVaultAsync({
        vaultAddress,
        allowDeposits: !data?.allowDeposits,
      })
      await refetch()
    },
    [vaultAddress, data?.allowDeposits, modifyVaultAsync, refetch],
  )
  const handleToggleAutoClose = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      if (!vaultAddress) return
      e.preventDefault()
      await modifyVaultAsync({
        vaultAddress,
        alwaysCloseOnWithdraw: !data?.alwaysCloseOnWithdraw,
      })
      await refetch()
    },
    [vaultAddress, data?.alwaysCloseOnWithdraw, modifyVaultAsync, refetch],
  )

  return (
    <PerpsChecker.EnableTrading
      fullWidth={false}
      size="default"
      variant="perps-tertiary"
    >
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="perps-tertiary">
            <div className="flex items-center justify-between gap-2">
              <div>Leader Actions</div>
              <ChevronDownIcon
                className={classNames(
                  'w-4 h-4 text-perps-muted-50 transition-transform duration-200',
                  isOpen && 'rotate-180',
                )}
              />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          className="w-60 !bg-perps-background"
        >
          <DropdownMenuItem asChild>
            <LinkInternal
              href={`/perps`}
              className="flex flex-col !items-start gap-1 !text-xs cursor-pointer"
            >
              Trade for Vault
            </LinkInternal>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <button
              disabled={isPending}
              onClick={handleToggleDeposits}
              type="button"
              className="w-full !text-xs"
            >
              {data?.allowDeposits ? 'Disable' : 'Enable'} Deposits
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <button
              disabled={isPending}
              onClick={handleToggleAutoClose}
              type="button"
              className="w-full !text-xs"
            >
              {data?.alwaysCloseOnWithdraw ? 'Disable' : 'Enable'} Auto-Close on
              Withdraw
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <button
              disabled={isPending}
              onClick={() => setIsDistributeOpen(true)}
              type="button"
              className="w-full !text-xs"
            >
              Distribute
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <button
              disabled={isPending}
              onClick={() => setIsCloseVaultOpen(true)}
              type="button"
              className="w-full !text-xs"
            >
              Close Vault
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DistributeVaultDialog
        vaultAddress={vaultAddress}
        isOpen={isDistributeOpen}
        onOpenChange={setIsDistributeOpen}
        trigger={<div className="hidden" />}
      />
      <CloseVaultDialog
        vaultAddress={vaultAddress}
        isOpen={isCloseVaultOpen}
        onOpenChange={setIsCloseVaultOpen}
        trigger={<div className="hidden" />}
      />
    </PerpsChecker.EnableTrading>
  )
}
