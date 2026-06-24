'use client'
import {
  ClipboardCheckIcon,
  ClipboardCopyIcon,
} from '@heroicons/react-v1/outline'
import { ChevronDownIcon } from '@heroicons/react-v1/solid'
import { WalletIcon } from '@heroicons/react/24/outline'
import { useCopyClipboard } from '@sushiswap/hooks'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  classNames,
} from '@sushiswap/ui'
import { SafeIcon } from '@sushiswap/ui/icons/SafeIcon'
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useLeadingVaults } from 'src/lib/perps/info/use-leading-vaults'
import { useAccount } from 'src/lib/wallet'
import { truncateString } from 'sushi'
import type { EvmAddress } from 'sushi/evm'
import { useActiveAccountState } from '../../active-account-provider'
import {
  type AccountType,
  reconcileActiveAccountWithLeaderVaults,
} from '../../active-account-state'

type AccountOption = {
  label: string
  name: string
  address: EvmAddress
  icon: ReactNode
  type: AccountType
}

export const ActiveAccountSelector = () => {
  const address = useAccount('evm')
  const {
    data: vaultData,
    isFetching,
    isLoading,
    isSuccess,
  } = useLeadingVaults({ address })
  const [isOpen, setIsOpen] = useState(false)
  const {
    state: { activeAccount },
    mutate: { setActiveAccount },
  } = useActiveAccountState()
  const [isCopied, staticCopy] = useCopyClipboard()

  const accountOptions = useMemo(() => {
    const accountOptions: AccountOption[] = []
    if (address) {
      accountOptions.push({
        label: 'Master',
        name: truncateString(address, 10, 'middle'),
        address: address,
        icon: <WalletIcon className="w-4 h-4 text-perps-muted" />,
        type: 'master',
      })
    }
    if (vaultData) {
      vaultData.forEach((vault) => {
        accountOptions.push({
          label: 'Vault',
          name: vault.name,
          address: vault.address,
          icon: <SafeIcon className="w-4 h-4 text-perps-muted" />,
          type: 'vault',
        })
      })
    }
    return accountOptions
  }, [vaultData, address])

  const activeOption = useMemo(() => {
    return accountOptions.find(
      (option) =>
        option.address.toLowerCase() === activeAccount?.address?.toLowerCase(),
    )
  }, [accountOptions, activeAccount])

  useEffect(() => {
    if (
      !address ||
      !activeAccount ||
      activeAccount.type !== 'vault' ||
      !isSuccess ||
      isFetching
    ) {
      return
    }

    const nextActiveAccount = reconcileActiveAccountWithLeaderVaults(
      activeAccount,
      address,
      vaultData,
    )

    if (nextActiveAccount !== activeAccount) {
      setActiveAccount(
        nextActiveAccount?.address ?? null,
        nextActiveAccount?.type ?? 'master',
        nextActiveAccount?.name ?? '',
      )
    }
  }, [
    address,
    activeAccount,
    isFetching,
    isSuccess,
    setActiveAccount,
    vaultData,
  ])

  const handleSelectAccount = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, option: AccountOption) => {
      e.preventDefault()
      setActiveAccount(option.address, option.type, option.name)
      setIsOpen(false)
    },
    [setActiveAccount],
  )

  if (!address || isLoading || !vaultData || vaultData.length === 0) {
    return null
  }
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="perps-secondary" className="!px-2">
          <div className="flex items-center gap-0.5">
            {activeOption?.icon}
            <ChevronDownIcon
              className={classNames(
                'w-4 h-4 text-perps-muted-50 transition-transform duration-200',
                isOpen && 'rotate-180',
              )}
            />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" className="w-60 !bg-perps-background">
        {accountOptions?.map((option) => (
          <DropdownMenuItem asChild key={option.address}>
            <button
              type="button"
              className={classNames(
                'flex w-full !items-start gap-1 !text-xs cursor-pointer justify-between',
                option.address.toLowerCase() ===
                  activeAccount?.address?.toLowerCase()
                  ? 'bg-perps-muted/10'
                  : '',
              )}
              onClick={(e) => handleSelectAccount(e, option)}
            >
              <p>{option.label}</p>

              <div className="flex items-center gap-2">
                <div>{option.name}</div>
                <div
                  onKeyDown={(e) => {
                    e.stopPropagation()
                    staticCopy(option.address)
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    staticCopy(option.address)
                  }}
                >
                  {isCopied ? (
                    <ClipboardCheckIcon className="w-3.5 h-3.5" />
                  ) : (
                    <ClipboardCopyIcon className="w-3.5 h-3.5" />
                  )}
                </div>
              </div>
            </button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
