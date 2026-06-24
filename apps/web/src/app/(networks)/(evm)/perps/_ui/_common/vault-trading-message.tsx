'use client'
import { Message, classNames } from '@sushiswap/ui'
import { useLegalCheck } from 'src/lib/perps/info/use-legal-check'
import { useAccount } from 'src/lib/wallet'
import { useActiveAccountState } from '../../active-account-provider'

export const VaultTradingMessage = () => {
  const address = useAccount('evm')
  const { data, isLoading, error } = useLegalCheck({ address })
  const {
    state: { activeAccount },
  } = useActiveAccountState()

  const isBlocked = data?.ipAllowed === false && !isLoading && !error

  return (
    <div
      data-vault-trading={activeAccount?.type === 'vault'}
      className={classNames(
        'hidden data-[vault-trading=true]:block data-[vault-trading=true]:animate-slide w-screen z-[11] items-center justify-center bg-perps-background',
        isBlocked && activeAccount?.type === 'vault'
          ? 'top-[112px]'
          : !isBlocked && activeAccount?.type === 'vault'
            ? 'top-[56px]'
            : 'top-[56px]',
      )}
    >
      <Message
        variant="info"
        className="!p-3 !text-xs !rounded-md !text-blue-100 border border-blue/50 mx-1"
      >
        IMPORTANT: You are trading on behalf of your vault {activeAccount?.name}
        .
      </Message>
    </div>
  )
}
