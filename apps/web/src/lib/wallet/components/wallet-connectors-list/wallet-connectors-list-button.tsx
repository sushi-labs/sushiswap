import { Button, Loader, classNames } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/network-icon'
import { getChainById } from 'sushi'
import { DEFAULT_CHAIN_ID_BY_NAMESPACE } from '../../config'
import { usePrivyRuntime } from '../../privy/use-privy-runtime'
import { useWalletState } from '../../provider/wallet-state-provider'
import type { WalletLoginMethod, WalletWithState } from '../../types'
import { ConnectWalletButton } from '../connect-wallet-button'
import type { ConnectWalletButtonProps } from '../connect-wallet-button/types'

export function WalletConnectorsListButton({
  variant = 'wallet',
  ...props
}: Omit<ConnectWalletButtonProps, 'asChild' | 'children'> & {
  variant?: 'wallet' | 'namespace'
}) {
  const { wallet } = props
  const loginMethod = variant === 'wallet' ? wallet.loginMethod : undefined
  const privyRuntime = usePrivyRuntime()
  const rightChip = getWalletStatusLabel({
    activePrivyLoginMethod:
      privyRuntime.status === 'ready' && privyRuntime.authenticated
        ? privyRuntime.loginMethod
        : undefined,
    hasPrivySession:
      privyRuntime.status === 'ready' && privyRuntime.authenticated,
    wallet,
  })

  const {
    isPending: isWalletPending,
    pendingWalletId,
    setPendingWalletId,
  } = useWalletState()

  const isPending = pendingWalletId === wallet.id

  return (
    <ConnectWalletButton
      asChild
      {...props}
      onMutate={() => {
        setPendingWalletId(wallet.id)
        props.onMutate?.()
      }}
      onSettled={() => {
        setPendingWalletId(undefined)
        props.onSettled?.()
      }}
    >
      <Button
        fullWidth
        size="lg"
        variant={
          loginMethod === 'email'
            ? 'default'
            : loginMethod === 'twitter'
              ? 'blank'
              : 'ghost'
        }
        className={classNames(
          '!h-auto gap-3 !px-4 !py-4 !text-base focus-visible:ring-pink',
          loginMethod
            ? '!min-h-[52px]'
            : '!min-h-[72px] !justify-between !rounded-none bg-secondary hover:!bg-muted focus-visible:!ring-inset focus-visible:!ring-offset-0',
          loginMethod === 'twitter' && 'text-pink hover:bg-pink/5',
        )}
        disabled={isWalletPending}
      >
        {loginMethod ? (
          <span className="flex-1 text-center">
            {loginMethod === 'email' ? 'Continue with email' : 'Log in with X'}
          </span>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-4 text-left">
            {variant === 'namespace' ? (
              <div className="flex min-w-0 items-center gap-4">
                <NetworkIcon
                  chainId={DEFAULT_CHAIN_ID_BY_NAMESPACE[wallet.namespace]}
                  className="h-8 w-8 shrink-0"
                />
                <span className="whitespace-normal break-words">
                  {
                    getChainById(
                      DEFAULT_CHAIN_ID_BY_NAMESPACE[wallet.namespace],
                    ).name
                  }
                </span>
              </div>
            ) : (
              <div className="flex min-w-0 items-center gap-4">
                <div className="rounded-lg border border-accent p-1">
                  <img
                    src={wallet.icon}
                    alt={wallet.name}
                    className="h-8 w-8 shrink-0"
                  />
                </div>
                <span className="whitespace-normal break-words">
                  {wallet.name}
                </span>
              </div>
            )}
          </div>
        )}
        {isPending ? (
          <Loader />
        ) : rightChip && variant === 'wallet' ? (
          <span className="shrink-0 text-sm font-normal">{rightChip}</span>
        ) : null}
      </Button>
    </ConnectWalletButton>
  )
}

export function getWalletStatusLabel({
  activePrivyLoginMethod,
  hasPrivySession,
  wallet,
}: {
  activePrivyLoginMethod: WalletLoginMethod | undefined
  hasPrivySession: boolean
  wallet: WalletWithState
}): 'Logged in' | 'Recent' | 'Installed' | undefined {
  if (hasPrivySession && wallet.loginMethod) {
    return wallet.loginMethod === activePrivyLoginMethod
      ? 'Logged in'
      : undefined
  }
  if (wallet.isRecent) return 'Recent'
  return wallet.isInstalled ? 'Installed' : undefined
}
